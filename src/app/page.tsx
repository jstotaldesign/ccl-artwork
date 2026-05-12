import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-server";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { Btn } from "@/components/ui";
import { Sparkles } from "lucide-react";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div>
      <SiteHeader />
      <main className="min-h-[60vh] flex items-center justify-center px-6 py-16 bg-mesh relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
        <div className="relative max-w-2xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-soft)] text-[var(--brand)] text-xs font-semibold border border-[var(--brand)]/20 mb-5">
            <Sparkles className="w-3 h-3" /> Built on NextPolyglot
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Your SaaS, <span className="text-brand-gradient">starts here</span>.
          </h1>
          <p className="text-lg text-[var(--muted-fg)] mt-5 max-w-xl mx-auto">
            Replace this landing page with your own copy. The framework, auth, and
            multi-tenant model are wired and ready.
          </p>
          <div className="flex items-center justify-center gap-3 mt-7">
            <Btn href="/auth/sign-up">Get started</Btn>
            <Link href="/auth/sign-in" className="text-sm font-semibold text-[var(--muted-fg)] hover:text-[var(--foreground)] px-3 py-2">
              Sign in
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
