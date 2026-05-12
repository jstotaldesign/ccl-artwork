import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession, SESSION_COOKIE, SESSION_TTL_DAYS } from "@/lib/auth";
import { withApi } from "@/lib/api-middleware";
import { audit } from "@/lib/audit";
import { badRequest, conflict } from "@/lib/api-error";
import { DEFAULT_ROLES, ALL_PERMISSIONS } from "@/lib/permissions";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  tenantName: z.string().min(1),
});

export const POST = withApi(async (req: NextRequest) => {
  const body = schema.parse(await req.json());

  const existing = await prisma.user.findUnique({ where: { email: body.email } });
  if (existing) throw conflict("email_taken");

  const slugBase = body.tenantName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
  const slug = slugBase ? `${slugBase}-${nanoid(6)}` : nanoid(10);

  const password = await hashPassword(body.password);

  const { userId } = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email: body.email, password, name: body.name },
    });
    const tenant = await tx.tenant.create({
      data: { slug, name: body.tenantName },
    });

    const ownerRole = await tx.role.create({
      data: {
        tenantId: tenant.id,
        name: DEFAULT_ROLES.owner.name,
        slug: "owner",
        isSystem: true,
        permissions: { create: [{ permission: "*" }] },
      },
    });
    for (const r of ["admin", "member", "viewer"] as const) {
      const def = DEFAULT_ROLES[r];
      const perms = def.permissions[0] === "*" ? ALL_PERMISSIONS : def.permissions;
      await tx.role.create({
        data: {
          tenantId: tenant.id,
          name: def.name,
          slug: r,
          isSystem: true,
          permissions: { create: perms.map((p) => ({ permission: p })) },
        },
      });
    }
    await tx.membership.create({
      data: { userId: user.id, tenantId: tenant.id, roleId: ownerRole.id, status: "ACTIVE" },
    });
    return { userId: user.id, tenantId: tenant.id };
  });

  await audit({ req, userId, action: "user.signup" });

  const sessionToken = await createSession(userId, req);
  const res = NextResponse.json({ data: { ok: true } });
  res.cookies.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  });
  return res;
});
