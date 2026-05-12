/**
 * Server helper: resolve the *current* tenant for a request. For single-
 * workspace users this is automatic; multi-workspace users can switch via
 * the `np_tenant` cookie set by the workspace selector.
 *
 * Throws ApiError("no_tenant") if the user has no memberships, or
 * ApiError("not_a_member") if the cookie points to a tenant they don't belong to.
 */

import { cookies } from "next/headers";
import { requireSession, type SessionUser } from "./auth-server";
import { forbidden, badRequest } from "./api-error";

const TENANT_COOKIE = "np_tenant";

export interface TenantContext {
  user: SessionUser;
  tenantId: string;
  tenantSlug: string;
  tenantName: string;
  roleSlug: string;
  permissions: string[];
}

export async function requireTenant(): Promise<TenantContext> {
  const user = await requireSession();
  if (user.memberships.length === 0) throw badRequest("no_tenant");

  const cookieStore = await cookies();
  const selected = cookieStore.get(TENANT_COOKIE)?.value;
  const m = selected
    ? user.memberships.find((m) => m.tenantId === selected)
    : user.memberships[0];

  if (!m) throw forbidden("not_a_member");

  return {
    user,
    tenantId: m.tenantId,
    tenantSlug: m.tenantSlug,
    tenantName: m.tenantName,
    roleSlug: m.roleSlug,
    permissions: m.permissions,
  };
}
