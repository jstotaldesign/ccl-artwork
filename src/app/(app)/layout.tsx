import { requireUser, pickTenant } from "@/lib/auth-server";
import { AppShell } from "@/components/AppShell";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const tenant = pickTenant(user);
  if (!tenant) redirect("/auth/sign-up");

  return (
    <AppShell
      user={{ email: user.email, name: user.name }}
      tenant={{ slug: tenant.tenantSlug, name: tenant.tenantName }}
    >
      {children}
    </AppShell>
  );
}
