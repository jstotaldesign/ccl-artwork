/**
 * Edge proxy — runs before every request (Next.js 16 renamed "middleware" → "proxy").
 *
 * Responsibility: redirect un-authenticated users away from protected paths.
 * Real session validation runs in Server Components / Route Handlers (where
 * Prisma is available — this Edge layer only checks cookie presence).
 */

import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth-constants";

const PUBLIC_PATHS = [
  "/",
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/magic-link",
  "/auth/accept-invite",
  "/auth/reset-password",
  "/auth/lock",
  "/auth/two-step",
  "/auth/cover",
  "/pricing",
  "/components",
  "/about",
  "/contact",
  "/faq",
  "/terms",
  "/privacy",
  "/blog",
  "/coming-soon",
  "/maintenance",
  "/credits",
  "/legal",
];

function isPublic(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (pathname.startsWith("/auth/")) return true;
  if (pathname.startsWith("/api/auth/")) return true;
  if (pathname.startsWith("/api/webhooks/")) return true;
  if (pathname.startsWith("/components")) return true; // marketing showcase + categories
  if (pathname.startsWith("/blog/")) return true; // blog detail pages
  if (pathname.startsWith("/_next/")) return true;
  if (pathname.startsWith("/favicon")) return true;
  return false;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublic(pathname)) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    const url = new URL("/auth/sign-in", req.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|api/webhooks|_next/static|_next/image|favicon.ico).*)"],
};
