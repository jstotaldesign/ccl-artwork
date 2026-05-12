/**
 * Permission registry — generic SaaS scaffolding.
 *
 * Each permission is a dot-notation string ("entity.action"). Roles hold a
 * list of permission strings. Wildcard "*" grants everything; "<entity>.*"
 * grants every action on that entity.
 *
 * To extend: add your domain permissions to PERMISSIONS_REGISTRY, define
 * which built-in roles get them in DEFAULT_ROLE_PERMISSIONS, and run the
 * seed script to backfill existing tenants.
 */

export const PERMISSIONS_REGISTRY = {
  // Tenant administration
  tenant: ["read", "update", "delete"],
  members: ["read", "invite", "update", "remove"],
  roles: ["read", "create", "update", "delete"],
  billing: ["read", "manage"],
  apiKeys: ["read", "create", "revoke"],
  webhooks: ["read", "create", "update", "delete"],
  auditLog: ["read"],
  settings: ["read", "update"],

  // Demo module — Projects
  projects: ["read", "create", "update", "delete", "archive"],
  tasks: ["read", "create", "update", "delete", "assign"],
  comments: ["read", "create", "update", "delete"],

  // CCL — Artwork Discontinue
  artworkDiscontinue: ["read", "create", "update", "delete"],
} as const;

export type PermissionEntity = keyof typeof PERMISSIONS_REGISTRY;
export type Permission = `${PermissionEntity}.${string}` | "*";

export const ALL_PERMISSIONS: Permission[] = Object.entries(PERMISSIONS_REGISTRY).flatMap(
  ([entity, actions]) => actions.map((a) => `${entity}.${a}` as Permission),
);

// ─── Default roles ───────────────────────────────────────────────────────────

export const DEFAULT_ROLES = {
  owner: { name: "Owner", isSystem: true, permissions: ["*"] as Permission[] },
  admin: {
    name: "Admin",
    isSystem: true,
    permissions: [
      "tenant.read",
      "tenant.update",
      "members.read",
      "members.invite",
      "members.update",
      "members.remove",
      "roles.read",
      "roles.create",
      "roles.update",
      "roles.delete",
      "billing.read",
      "billing.manage",
      "apiKeys.read",
      "apiKeys.create",
      "apiKeys.revoke",
      "webhooks.read",
      "webhooks.create",
      "webhooks.update",
      "webhooks.delete",
      "auditLog.read",
      "settings.read",
      "settings.update",
      "projects.read",
      "projects.create",
      "projects.update",
      "projects.delete",
      "projects.archive",
      "tasks.read",
      "tasks.create",
      "tasks.update",
      "tasks.delete",
      "tasks.assign",
      "comments.read",
      "comments.create",
      "comments.update",
      "comments.delete",
    ] as Permission[],
  },
  member: {
    name: "Member",
    isSystem: true,
    permissions: [
      "tenant.read",
      "members.read",
      "roles.read",
      "projects.read",
      "projects.create",
      "projects.update",
      "tasks.read",
      "tasks.create",
      "tasks.update",
      "tasks.assign",
      "comments.read",
      "comments.create",
      "comments.update",
    ] as Permission[],
  },
  viewer: {
    name: "Viewer",
    isSystem: true,
    permissions: [
      "tenant.read",
      "members.read",
      "projects.read",
      "tasks.read",
      "comments.read",
    ] as Permission[],
  },
} as const;

export type RoleSlug = keyof typeof DEFAULT_ROLES;

// ─── Check helpers ───────────────────────────────────────────────────────────

export function hasPermission(granted: readonly string[], required: Permission): boolean {
  if (granted.includes("*")) return true;
  if (granted.includes(required)) return true;
  const [entity] = required.split(".");
  return granted.includes(`${entity}.*`);
}

export function hasAnyPermission(granted: readonly string[], required: Permission[]): boolean {
  return required.some((p) => hasPermission(granted, p));
}

export function hasAllPermissions(granted: readonly string[], required: Permission[]): boolean {
  return required.every((p) => hasPermission(granted, p));
}
