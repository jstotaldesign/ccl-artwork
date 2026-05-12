/**
 * Minimal seed — creates demo tenant + owner user so you can sign in
 * immediately after `npm run db:seed`.
 *
 *   Email:    demo@example.com
 *   Password: demo1234
 *
 * Idempotent: safe to re-run.
 */

import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";
import { DEFAULT_ROLES } from "../src/lib/permissions";

const prisma = new PrismaClient();

const DEMO_EMAIL = "demo@example.com";
const DEMO_PASSWORD = "demo1234";

async function main() {
  const password = await bcrypt.hash(DEMO_PASSWORD, 12);

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {},
    create: {
      email: DEMO_EMAIL,
      password,
      name: "Demo User",
      locale: "en",
      emailVerifiedAt: new Date(),
    },
  });

  const tenant = await prisma.tenant.upsert({
    where: { slug: "demo" },
    update: {},
    create: { slug: "demo", name: "Demo Workspace", themeColor: "#F97316" },
  });

  // Seed 4 system roles (owner / admin / member / viewer) per tenant.
  const hasRoles = await prisma.role.findFirst({ where: { tenantId: tenant.id } });
  if (!hasRoles) {
    for (const slug of ["owner", "admin", "member", "viewer"] as const) {
      const def = DEFAULT_ROLES[slug];
      const perms = def.permissions[0] === "*" ? ["*"] : def.permissions;
      await prisma.role.create({
        data: {
          tenantId: tenant.id,
          name: def.name,
          slug,
          isSystem: true,
          permissions: { create: perms.map((p) => ({ permission: p })) },
        },
      });
    }
  }

  const ownerRole = await prisma.role.findUniqueOrThrow({
    where: { tenantId_slug: { tenantId: tenant.id, slug: "owner" } },
  });

  await prisma.membership.upsert({
    where: { userId_tenantId: { userId: user.id, tenantId: tenant.id } },
    update: {},
    create: { userId: user.id, tenantId: tenant.id, roleId: ownerRole.id, status: "ACTIVE" },
  });

  console.log(`Seeded demo user: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
