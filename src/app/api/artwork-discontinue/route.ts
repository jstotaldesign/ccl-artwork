import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withApi, apiResponse } from "@/lib/api-middleware";
import { audit } from "@/lib/audit";
import { requireTenant } from "@/lib/tenant-context";
import { hasPermission } from "@/lib/permissions";
import { forbidden } from "@/lib/api-error";

const isoDate = z.string().datetime({ offset: true }).or(z.string().min(1)).optional().nullable();

const createSchema = z.object({
  documentNo: z.string().max(60).optional().nullable(),
  customer: z.string().min(1).max(120),
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

export const GET = withApi(async (req: NextRequest) => {
  const ctx = await requireTenant();
  if (!hasPermission(ctx.permissions, "artworkDiscontinue.read")) throw forbidden("missing_permission");

  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
  const pageSize = Math.min(200, Math.max(1, Number(url.searchParams.get("pageSize") ?? "20")));

  const [items, total] = await Promise.all([
    prisma.artworkDiscontinue.findMany({
      where: { tenantId: ctx.tenantId },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.artworkDiscontinue.count({ where: { tenantId: ctx.tenantId } }),
  ]);

  return apiResponse(items, { page, pageSize, total });
});

export const POST = withApi(async (req: NextRequest) => {
  const ctx = await requireTenant();
  if (!hasPermission(ctx.permissions, "artworkDiscontinue.create")) throw forbidden("missing_permission");

  const body = createSchema.parse(await req.json());

  const record = await prisma.artworkDiscontinue.create({
    data: {
      tenantId: ctx.tenantId,
      createdBy: ctx.user.id,
      documentNo: body.documentNo ?? null,
      customer: body.customer,
      customerDocRef: body.customerDocRef ?? null,
      informedDate: toDate(body.informedDate),
      contactPerson: body.contactPerson ?? null,
      customerService: body.customerService ?? null,
      artworkNo: body.artworkNo ?? null,
      gcasNo: body.gcasNo ?? null,
      description: body.description ?? null,
      remark: body.remark ?? null,

      salesVerify: body.salesVerify ?? false,
      salesBlockNav: body.salesBlockNav ?? false,
      salesInformDept: body.salesInformDept ?? false,
      salesSignedBy: body.salesSignedBy ?? null,
      salesSignedDate: toDate(body.salesSignedDate),
      approvedBy: body.approvedBy ?? null,

      whHasFgStock: body.whHasFgStock ?? null,
      whInformedBy: body.whInformedBy ?? null,
      whFgHandling: body.whFgHandling ?? null,
      whSignedBy: body.whSignedBy ?? null,
      whSignedDate: toDate(body.whSignedDate),

      prodHasInProgress: body.prodHasInProgress ?? null,
      prodSignedBy: body.prodSignedBy ?? null,
      prodSignedDate: toDate(body.prodSignedDate),

      techAcknowledged: body.techAcknowledged ?? false,
      techSignedBy: body.techSignedBy ?? null,
      techSignedDate: toDate(body.techSignedDate),

      graphicUpdateAwStatus: body.graphicUpdateAwStatus ?? false,
      graphicSignedBy: body.graphicSignedBy ?? null,
      graphicSignedDate: toDate(body.graphicSignedDate),

      shopfloorSeparate: body.shopfloorSeparate ?? false,
      shopfloorDestroyed: body.shopfloorDestroyed ?? false,
      shopfloorDestroyDate: toDate(body.shopfloorDestroyDate),
      shopfloorSignedBy: body.shopfloorSignedBy ?? null,
      shopfloorSignedDate: toDate(body.shopfloorSignedDate),

      qaHasReleaseWaiting: body.qaHasReleaseWaiting ?? null,
      qaSeparatePss: body.qaSeparatePss ?? false,
      qaCancelColorLog: body.qaCancelColorLog ?? false,
      qaSignedBy: body.qaSignedBy ?? null,
      qaSignedDate: toDate(body.qaSignedDate),

      csVerifyAllAck: body.csVerifyAllAck ?? false,
      csFinalSignedBy: body.csFinalSignedBy ?? null,
      csFinalSignedDate: toDate(body.csFinalSignedDate),

      status: body.status ?? "DRAFT",
    },
  });

  await audit({
    req,
    tenantId: ctx.tenantId,
    userId: ctx.user.id,
    action: "artworkDiscontinue.create",
    entity: "ArtworkDiscontinue",
    entityId: record.id,
    detail: { customer: record.customer, artworkNo: record.artworkNo },
  });

  return apiResponse(record, { status: 201 });
});
