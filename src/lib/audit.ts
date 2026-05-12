/**
 * Audit log helper. Call after any state mutation (POST/PUT/PATCH/DELETE).
 *
 * Standard action names use dot-notation: "entity.verb"
 *   user.signin · user.signup · project.create · project.update · billing.subscribe
 *
 * Pattern with diff:
 *   const before = await prisma.project.findUnique({ where: { id } });
 *   const after  = await prisma.project.update({ where: { id }, data });
 *   const changes = diff(before, after, ["name", "status"]);
 *   await audit({ req, tenantId, userId, action: "project.update", entity: "Project", entityId: id, detail: { changes } });
 */

import { prisma } from "./prisma";

interface AuditInput {
  req?: Request | null;
  tenantId?: string | null;
  userId?: string | null;
  action: string;
  entity?: string | null;
  entityId?: string | null;
  detail?: Record<string, unknown>;
}

function getRequestInfo(req?: Request | null) {
  if (!req) return { ip: null, userAgent: null };
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? null;
  const userAgent = req.headers.get("user-agent")?.slice(0, 500) ?? null;
  return { ip, userAgent };
}

export async function audit({ req, tenantId, userId, action, entity, entityId, detail }: AuditInput): Promise<void> {
  try {
    const { ip, userAgent } = getRequestInfo(req);
    await prisma.auditLog.create({
      data: {
        tenantId: tenantId ?? null,
        userId: userId ?? null,
        action,
        entity: entity ?? null,
        entityId: entityId ?? null,
        detail: detail ? (detail as object) : undefined,
        ip,
        userAgent,
      },
    });
  } catch (err) {
    // Audit must never throw — log to stderr and continue.
    console.error("[audit] failed:", err);
  }
}
