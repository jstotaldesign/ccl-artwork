/**
 * Server helpers for the authenticated app — read the session cookie, fetch
 * the user + their active tenant memberships, expose permission checks.
 *
 * Use in Server Components and Route Handlers. NOT for middleware (which
 * runs in the Edge runtime and can't import Prisma).
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { findSession, SESSION_COOKIE } from "./auth";
import { hasPermission, type Permission } from "./permissions";
import { unauthorized, forbidden } from "./api-error";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  locale: string;
  isSuperadmin: boolean;
  memberships: Array<{
    tenantId: string;
    tenantSlug: string;
    tenantName: string;
    roleSlug: string;
    permissions: string[];
  }>;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await findSession(token);
  if (!session) return null;

  const memberships = await prisma.membership.findMany({
    where: { userId: session.userId, status: "ACTIVE" },
    include: {
      tenant: { select: { id: true, slug: true, name: true } },
      role: {
        select: {
          slug: true,
          permissions: { select: { permission: true } },
        },
      },
    },
  });

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
    locale: session.user.locale,
    isSuperadmin: session.user.isSuperadmin,
    memberships: memberships.map((m) => ({
      tenantId: m.tenant.id,
      tenantSlug: m.tenant.slug,
      tenantName: m.tenant.name,
      roleSlug: m.role.slug,
      permissions: m.role.permissions.map((p) => p.permission),
    })),
  };
}

/** Page guard — redirects to /auth/sign-in when unauthenticated. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");
  return user;
}

/** API guard — throws ApiError (handled by withApi). */
export async function requireSession(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw unauthorized();
  return user;
}

/** API guard with permission check against a specific tenant. */
export async function requirePermission(tenantId: string, permission: Permission): Promise<SessionUser> {
  const user = await requireSession();
  if (user.isSuperadmin) return user;
  const membership = user.memberships.find((m) => m.tenantId === tenantId);
  if (!membership) throw forbidden("not_a_member");
  if (!hasPermission(membership.permissions, permission)) throw forbidden("missing_permission");
  return user;
}

/** Resolve a user's active tenant from a slug (or first membership). */
export function pickTenant(user: SessionUser, slug?: string) {
  if (slug) {
    const m = user.memberships.find((m) => m.tenantSlug === slug);
    if (!m) return null;
    return m;
  }
  return user.memberships[0] ?? null;
}
