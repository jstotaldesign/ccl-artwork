import { requireUser, pickTenant } from "@/lib/auth-server";
import { hasPermission } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { Page, PageHeader } from "@/components/ui";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ArtworkDiscontinueForm } from "./ArtworkDiscontinueForm";

export default async function NewArtworkDiscontinuePage() {
  const user = await requireUser();
  const tenant = pickTenant(user);
  if (!tenant) redirect("/auth/sign-up");
  if (!hasPermission(tenant.permissions, "artworkDiscontinue.create")) redirect("/dashboard");

  return (
    <Page>
      <Breadcrumb
        items={[
          { label: "Artwork Discontinue", href: "/artwork-discontinue" },
          { label: "New form" },
        ]}
        showHome={false}
      />
      <PageHeader
        title="Artwork Discontinue Form"
        subtitle="ใบแจ้งยกเลิกไอเทม — 8-step departmental sign-off"
      />
      <ArtworkDiscontinueForm />
    </Page>
  );
}
