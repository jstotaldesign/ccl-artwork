import { notFound, redirect } from "next/navigation";
import { requireUser, pickTenant } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { Page, PageHeader } from "@/components/ui";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ArtworkDiscontinueForm } from "../new/ArtworkDiscontinueForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArtworkDiscontinuePage({ params }: PageProps) {
  const { id } = await params;
  const user = await requireUser();
  const tenant = pickTenant(user);
  if (!tenant) redirect("/auth/sign-up");
  if (!hasPermission(tenant.permissions, "artworkDiscontinue.update")) redirect("/dashboard");

  const record = await prisma.artworkDiscontinue.findFirst({
    where: { id, tenantId: tenant.tenantId },
  });
  if (!record) notFound();

  return (
    <Page>
      <Breadcrumb
        items={[
          { label: "Artwork Discontinue", href: "/artwork-discontinue" },
          { label: record.documentNo || record.id.slice(0, 10) },
        ]}
        showHome={false}
      />
      <PageHeader
        title="Edit Artwork Discontinue Form"
        subtitle={`${record.customer}${record.artworkNo ? ` · ${record.artworkNo}` : ""}`}
      />
      <ArtworkDiscontinueForm
        recordId={record.id}
        initialState={{
          documentNo: record.documentNo ?? "",
          customer: record.customer,
          customerDocRef: record.customerDocRef ?? "",
          informedDate: record.informedDate,
          contactPerson: record.contactPerson ?? "",
          customerService: record.customerService ?? "",
          artworkNo: record.artworkNo ?? "",
          gcasNo: record.gcasNo ?? "",
          description: record.description ?? "",
          remark: record.remark ?? "",

          salesVerify: record.salesVerify,
          salesBlockNav: record.salesBlockNav,
          salesInformDept: record.salesInformDept,
          salesSignedBy: record.salesSignedBy ?? "",
          salesSignedDate: record.salesSignedDate,
          approvedBy: record.approvedBy ?? "",

          whHasFgStock: (record.whHasFgStock ?? "") as "" | "no" | "yes",
          whInformedBy: record.whInformedBy ?? "",
          whFgHandling: record.whFgHandling ?? "",
          whSignedBy: record.whSignedBy ?? "",
          whSignedDate: record.whSignedDate,

          prodHasInProgress: (record.prodHasInProgress ?? "") as "" | "no" | "yes",
          prodSignedBy: record.prodSignedBy ?? "",
          prodSignedDate: record.prodSignedDate,

          techAcknowledged: record.techAcknowledged,
          techSignedBy: record.techSignedBy ?? "",
          techSignedDate: record.techSignedDate,

          graphicUpdateAwStatus: record.graphicUpdateAwStatus,
          graphicSignedBy: record.graphicSignedBy ?? "",
          graphicSignedDate: record.graphicSignedDate,

          shopfloorSeparate: record.shopfloorSeparate,
          shopfloorDestroyed: record.shopfloorDestroyed,
          shopfloorDestroyDate: record.shopfloorDestroyDate,
          shopfloorSignedBy: record.shopfloorSignedBy ?? "",
          shopfloorSignedDate: record.shopfloorSignedDate,

          qaHasReleaseWaiting: (record.qaHasReleaseWaiting ?? "") as "" | "no" | "yes",
          qaSeparatePss: record.qaSeparatePss,
          qaCancelColorLog: record.qaCancelColorLog,
          qaSignedBy: record.qaSignedBy ?? "",
          qaSignedDate: record.qaSignedDate,

          csVerifyAllAck: record.csVerifyAllAck,
          csFinalSignedBy: record.csFinalSignedBy ?? "",
          csFinalSignedDate: record.csFinalSignedDate,
        }}
      />
    </Page>
  );
}
