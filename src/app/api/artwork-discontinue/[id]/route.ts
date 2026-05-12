import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withApi, apiResponse } from "@/lib/api-middleware";
import { audit } from "@/lib/audit";
import { requireTenant } from "@/lib/tenant-context";
import { hasPermission } from "@/lib/permissions";
import { forbidden, notFound } from "@/lib/api-error";

const isoDate = z.string().min(1).optional().nullable();

const updateSchema = z.object({
  documentNo: z.string().max(60).optional().nullable(),
  customer: z.string().min(1).max(120).optional(),
  customerDocRef: z.string().max(120).optional().nullable(),
  informedDate: isoDate,
  contactPerson: z.string().max(120).optional().nullable(),
  customerService: z.string().max(120).optional().nullable(),
  artworkNo: z.string().max(60).optional().nullable(),
  gcasNo: z.string().max(60).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  remark: z.string().max(2000).optional().nullable(),

  salesVerify: z.boolean().optional(),
  salesBlockNav: z.boolean().optional(),
  salesInformDept: z.boolean().optional(),
  salesSignedBy: z.string().max(120).optional().nullable(),
  salesSignedDate: isoDate,
  approvedBy: z.string().max(120).optional().nullable(),

  whHasFgStock: z.enum(["no", "yes"]).optional().nullable(),
  whInformedBy: z.string().max(120).optional().nullable(),
  whFgHandling: z.string().max(2000).optional().nullable(),
  whSignedBy: z.string().max(120).optional().nullable(),
  whSignedDate: isoDate,

  prodHasInProgress: z.enum(["no", "yes"]).optional().nullable(),
  prodSignedBy: z.string().max(120).optional().nullable(),
  prodSignedDate: isoDate,

  techAcknowledged: z.boolean().optional(),
  techSignedBy: z.string().max(120).optional().nullable(),
  techSignedDate: isoDate,

  graphicUpdateAwStatus: z.boolean().optional(),
  graphicSignedBy: z.string().max(120).optional().nullable(),
  graphicSignedDate: isoDate,

  shopfloorSeparate: z.boolean().optional(),
  shopfloorDestroyed: z.boolean().optional(),
  shopfloorDestroyDate: isoDate,
  shopfloorSignedBy: z.string().max(120).optional().nullable(),
  shopfloorSignedDate: isoDate,

  qaHasReleaseWaiting: z.enum(["no", "yes"]).optional().nullable(),
  qaSeparatePss: z.boolean().optional(),
  qaCancelColorLog: z.boolean().optional(),
  qaSignedBy: z.string().max(120).optional().nullable(),
  qaSignedDate: isoDate,

  csVerifyAllAck: z.boolean().optional(),
  csFinalSignedBy: z.string().max(120).optional().nullable(),
  csFinalSignedDate: isoDate,

  status: z.enum(["DRAFT", "IN_PROGRESS", "COMPLETED"]).optional(),
});

function toDate(v: unknown): Date | null {
  if (!v || typeof v !== "string") return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

interface Ctx {
  params: Promise<{ id: string }>;
}

export const GET = withApi<{ id: string }>(async (_req, ctx: Ctx) => {
  const tenant = await requireTenant();
  if (!hasPermission(tenant.permissions, "artworkDiscontinue.read")) throw forbidden("missing_permission");

  const { id } = await ctx.params;
  const record = await prisma.artworkDiscontinue.findFirst({
    where: { id, tenantId: tenant.tenantId },
  });
  if (!record) throw notFound();
  return apiResponse(record);
});

export const PATCH = withApi<{ id: string }>(async (req, ctx: Ctx) => {
  const tenant = await requireTenant();
  if (!hasPermission(tenant.permissions, "artworkDiscontinue.update")) throw forbidden("missing_permission");

  const { id } = await ctx.params;
  const existing = await prisma.artworkDiscontinue.findFirst({
    where: { id, tenantId: tenant.tenantId },
    select: { id: true },
  });
  if (!existing) throw notFound();

  const body = updateSchema.parse(await req.json());

  // Build update payload — only include keys that are present in the body,
  // and coerce ISO strings → Date for the date fields.
  const dateKeys = [
    "informedDate",
    "salesSignedDate",
    "whSignedDate",
    "prodSignedDate",
    "techSignedDate",
    "graphicSignedDate",
    "shopfloorDestroyDate",
    "shopfloorSignedDate",
    "qaSignedDate",
    "csFinalSignedDate",
  ] as const;
  type DateKey = (typeof dateKeys)[number];
  const dateSet = new Set<string>(dateKeys);

  const data: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(body)) {
    data[k] = dateSet.has(k) ? toDate(v) : v;
  }
  // Drop `customer` if it became empty (zod min(1) blocks empty already).
  if (data.customer === "") delete data.customer;
  // Cast date fields cleanly for the keys we know exist.
  for (const dk of dateKeys) {
    if (dk in data) (data as Record<DateKey, Date | null>)[dk] = toDate(body[dk]);
  }

  const record = await prisma.artworkDiscontinue.update({
    where: { id },
    data,
  });

  await audit({
    req,
    tenantId: tenant.tenantId,
    userId: tenant.user.id,
    action: "artworkDiscontinue.update",
    entity: "ArtworkDiscontinue",
    entityId: record.id,
    detail: { fields: Object.keys(body) },
  });

  return apiResponse(record);
});

export const DELETE = withApi<{ id: string }>(async (req, ctx: Ctx) => {
  const tenant = await requireTenant();
  if (!hasPermission(tenant.permissions, "artworkDiscontinue.delete")) throw forbidden("missing_permission");

  const { id } = await ctx.params;
  const existing = await prisma.artworkDiscontinue.findFirst({
    where: { id, tenantId: tenant.tenantId },
    select: { id: true, customer: true, artworkNo: true },
  });
  if (!existing) throw notFound();

  await prisma.artworkDiscontinue.delete({ where: { id } });
  await audit({
    req,
    tenantId: tenant.tenantId,
    userId: tenant.user.id,
    action: "artworkDiscontinue.delete",
    entity: "ArtworkDiscontinue",
    entityId: id,
    detail: { customer: existing.customer, artworkNo: existing.artworkNo },
  });

  return apiResponse({ id });
});
