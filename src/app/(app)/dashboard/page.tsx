import { requireUser, pickTenant } from "@/lib/auth-server";
import { Card, Btn } from "@/components/ui";
import { Sparkles, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const user = await requireUser();
  const tenant = pickTenant(user)!;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--border)] bg-brand-gradient text-white p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-25" aria-hidden />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">
            {tenant.tenantName}
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight mt-1">
            Welcome, {user.name ?? user.email.split("@")[0]} 👋
          </h1>
          <p className="opacity-90 mt-2 max-w-md text-sm">
            This is your blank dashboard. Replace it with your product.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-bold flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[var(--brand)]" /> Start building
          </h3>
          <p className="text-sm text-[var(--muted-fg)]">
            Add models to <code className="font-mono text-xs">prisma/schema.prisma</code> and
            run <code className="font-mono text-xs">npm run db:migrate</code>.
          </p>
        </Card>
        <Card>
          <h3 className="font-bold mb-2">Auth + RBAC</h3>
          <p className="text-sm text-[var(--muted-fg)]">
            See <code className="font-mono text-xs">src/lib/permissions.ts</code> to define roles.
          </p>
        </Card>
        <Card>
          <h3 className="font-bold mb-2">UI Kit</h3>
          <p className="text-sm text-[var(--muted-fg)]">
            All components live in <code className="font-mono text-xs">src/components/ui/</code>.
          </p>
        </Card>
      </div>

      <Card>
        <h3 className="font-bold mb-3">Next steps</h3>
        <ol className="space-y-2 text-sm">
          <li>1. Define your domain models in <code className="font-mono text-xs">prisma/schema.prisma</code>.</li>
          <li>2. Add nav items to <code className="font-mono text-xs">src/components/Sidebar.tsx</code>.</li>
          <li>3. Build your first feature route under <code className="font-mono text-xs">src/app/(app)/</code>.</li>
          <li>4. Add translation keys to <code className="font-mono text-xs">messages/*.json</code>.</li>
        </ol>
        <div className="mt-4">
          <Btn href="/settings" icon={<ArrowRight className="w-3.5 h-3.5" />}>Open settings</Btn>
        </div>
      </Card>
    </div>
  );
}
