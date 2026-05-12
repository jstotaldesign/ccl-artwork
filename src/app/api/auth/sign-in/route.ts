import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession, SESSION_COOKIE, SESSION_TTL_DAYS } from "@/lib/auth";
import { withApi } from "@/lib/api-middleware";
import { audit } from "@/lib/audit";
import { unauthorized } from "@/lib/api-error";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const POST = withApi(async (req: NextRequest) => {
  const body = schema.parse(await req.json());
  const user = await prisma.user.findUnique({ where: { email: body.email } });
  if (!user || !user.password) throw unauthorized("invalid_credentials");
  const ok = await verifyPassword(body.password, user.password);
  if (!ok) throw unauthorized("invalid_credentials");

  await audit({ req, userId: user.id, action: "user.signin" });
  const sessionToken = await createSession(user.id, req);

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
