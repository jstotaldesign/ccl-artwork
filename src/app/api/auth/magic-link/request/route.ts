import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createVerificationToken, MAGIC_LINK_TTL_MINUTES } from "@/lib/auth";
import { sendMagicLink } from "@/lib/mailer";
import { withApi } from "@/lib/api-middleware";

const schema = z.object({ email: z.string().email() });

export const POST = withApi(async (req: NextRequest) => {
  const { email } = schema.parse(await req.json());
  const user = await prisma.user.findUnique({ where: { email } });
  // Always return ok — don't leak whether email exists.
  if (user) {
    const token = await createVerificationToken(email, "magic-link", MAGIC_LINK_TTL_MINUTES);
    await sendMagicLink(email, token).catch((err) => console.error("[magic-link] send failed:", err));
  }
  return NextResponse.json({ data: { ok: true } });
});
