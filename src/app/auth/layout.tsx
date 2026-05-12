import Link from "next/link";
import { Sparkles, Globe, Shield, CreditCard } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left brand panel — hidden on mobile */}
      <aside className="hidden lg:flex w-1/2 max-w-2xl relative overflow-hidden bg-mesh">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
        <div className="relative flex flex-col p-12 w-full">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-5 h-5" />
            </span>
            NextPolyglot
          </Link>

          <div className="flex-1 flex flex-col justify-center py-16">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
              Ship your SaaS<br />
              <span className="text-brand-gradient">in 7 languages.</span>
            </h1>
            <p className="text-[var(--muted-fg)] mt-4 max-w-md">
              Multi-tenant. RBAC. Stripe billing. Magic-link auth. Audit log. Real-time SSE.
              All wired up. All yours.
            </p>

            <div className="mt-8 space-y-3 max-w-md">
              <Bullet icon={Globe} text="Pre-translated for SEA + China markets" />
              <Bullet icon={Shield} text="Multi-tenant with role-based permissions" />
              <Bullet icon={CreditCard} text="Stripe Checkout & Customer Portal ready" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[var(--muted-fg)] font-mono">
            <span>🇬🇧</span>
            <span>🇹🇭</span>
            <span>🇨🇳</span>
            <span>🇻🇳</span>
            <span>🇰🇭</span>
            <span>🇱🇦</span>
            <span>🇲🇲</span>
            <span className="ml-2">7 languages out of the box</span>
          </div>
        </div>
      </aside>

      {/* Right form panel */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl">
              <span className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </span>
              NextPolyglot
            </Link>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

function Bullet({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-8 h-8 rounded-lg bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--brand)] shrink-0">
        <Icon className="w-4 h-4" />
      </span>
      <span className="text-sm">{text}</span>
    </div>
  );
}
