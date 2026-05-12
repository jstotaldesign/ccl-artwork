import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { requireUser, pickTenant } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { Page, PageHeader, Card, Badge, Btn, EmptyState } from "@/components/ui";
import { hasPermission } from "@/lib/permissions";
import { fmtDateTime } from "@/lib/formatters";

export default async function ArtworkDiscontinueListPage() {
  const user = await requireUser();
  const tenant = pickTenant(user)!;

  const canCreate = hasPermission(tenant.permissions, "artworkDiscontinue.create");

  const items = await prisma.artworkDiscontinue.findMany({
    where: { tenantId: tenant.tenantId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <Page>
      <PageHeader title="Artwork Discontinue" subtitle={`${items.length} form${items.length === 1 ? "" : "s"}`}>
        {canCreate && (
          <Btn href="/artwork-discontinue/new" icon={<Plus className="w-4 h-4" />}>
            New form
          </Btn>
        )}
      </PageHeader>

      {items.length === 0 ? (
        <Card>
          <EmptyState
            icon={<FileText className="w-6 h-6" />}
            title="No forms yet"
            description={canCreate ? "Create the first Artwork Discontinue form." : "Ask an admin to create one."}
            action={canCreate ? <Btn href="/artwork-discontinue/new">Create form</Btn> : undefined}
          />
        </Card>
      ) : (
        <Card padding="none">
          <table className="w-full text-sm">
            <thead className="bg-[var(--muted)]/40 text-left text-xs text-[var(--muted-fg)] uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Document No.</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Artwork No.</th>
                <th className="px-4 py-3">GCAS</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {items.map((it) => (
                <tr key={it.id} className="hover:bg-[var(--muted)]/30">
                  <td className="px-4 py-3 font-mono text-xs">
                    <Link href={`/artwork-discontinue/${it.id}`} className="hover:text-[var(--brand)]">
                      {it.documentNo || it.id.slice(0, 10)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-medium">{it.customer}</td>
                  <td className="px-4 py-3">{it.artworkNo ?? "—"}</td>
                  <td className="px-4 py-3">{it.gcasNo ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge tone={it.status === "COMPLETED" ? "success" : it.status === "IN_PROGRESS" ? "info" : "default"}>
                      {it.status.toLowerCase()}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--muted-fg)]">{fmtDateTime(it.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </Page>
  );
}
