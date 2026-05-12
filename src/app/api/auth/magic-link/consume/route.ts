import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { consumeVerificationToken, createSession, SESSION_COOKIE, SESSION_TTL_DAYS } from "@/lib/auth";
import { withApi } from "@/lib/api-middleware";
import { audit } from "@/lib/audit";
import { unauthorized } from "@/lib/api-error";

const schema = z.object({ token: z.string().min(10) });

export const POST = withApi(async (req: NextRequest) => {
  const { token } = schema.parse(await req.json());
  const email = await consumeVerificationToken(token, "magic-link");
  if (!email) throw unauthorized("invalid_or_expired_token");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw unauthorized("user_not_found");

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerifiedAt: user.emailVerifiedAt ?? new Date() },
  });
  await audit({ req, userId: user.id, action: "user.magic_link" });

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
