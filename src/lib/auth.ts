/**
 * Core auth primitives — password hashing, sessions, magic-link tokens.
 * Server-side only.
 */

import bcrypt from "bcryptjs";
import { randomBytes, createHash } from "node:crypto";
import { prisma } from "./prisma";
import { SESSION_COOKIE_NAME } from "./auth-constants";

export const SESSION_COOKIE = SESSION_COOKIE_NAME;
export const SESSION_TTL_DAYS = 30;
export const MAGIC_LINK_TTL_MINUTES = 15;
export const PASSWORD_RESET_TTL_MINUTES = 30;
export const INVITATION_TTL_DAYS = 7;

// ─── Password ────────────────────────────────────────────────────────────────

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

// ─── Session ─────────────────────────────────────────────────────────────────

function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

export async function createSession(userId: string, req?: Request): Promise<string> {
  const sessionToken = randomToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
  const ip = req?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = req?.headers.get("user-agent")?.slice(0, 500) ?? null;

  await prisma.session.create({
    data: { sessionToken, userId, expiresAt, ip, userAgent },
  });
  await prisma.user.update({
    where: { id: userId },
    data: { lastLoginAt: new Date() },
  });
  return sessionToken;
}

export async function findSession(sessionToken: string) {
  if (!sessionToken) return null;
  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  });
  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }
  return session;
}

export async function revokeSession(sessionToken: string): Promise<void> {
  if (!sessionToken) return;
  await prisma.session.deleteMany({ where: { sessionToken } });
}

// ─── Verification tokens (magic-link, password-reset, email-verify) ─────────

export async function createVerificationToken(
  identifier: string,
  purpose: "magic-link" | "email-verify" | "password-reset",
  ttlMinutes: number,
): Promise<string> {
  const token = randomToken();
  await prisma.verificationToken.create({
    data: {
      identifier,
      token: hashToken(token),
      purpose,
      expiresAt: new Date(Date.now() + ttlMinutes * 60 * 1000),
    },
  });
  return token; // raw token sent via email
}

export async function consumeVerificationToken(
  rawToken: string,
  purpose: "magic-link" | "email-verify" | "password-reset",
): Promise<string | null> {
  const hashed = hashToken(rawToken);
  const record = await prisma.verificationToken.findUnique({ where: { token: hashed } });
  if (!record || record.purpose !== purpose) return null;
  if (record.consumedAt) return null;
  if (record.expiresAt < new Date()) return null;
  await prisma.verificationToken.update({
    where: { id: record.id },
    data: { consumedAt: new Date() },
  });
  return record.identifier;
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
