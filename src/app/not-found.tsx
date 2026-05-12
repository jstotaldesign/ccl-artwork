import Link from "next/link";
import { Compass, Home, ArrowLeft, Search } from "lucide-react";
import { Btn } from "@/components/ui";

export const metadata = { title: "Page not found — NextPolyglot" };

const SUGGESTIONS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Components", href: "/components" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-mesh">
      <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
      <div className="relative max-w-2xl mx-auto px-6 text-center py-12">
        <div className="relative inline-block mb-6">
          <p className="text-[140px] sm:text-[180px] font-extrabold leading-none tracking-tight text-brand-gradient select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-[var(--card)] border border-[var(--border)] shadow-lg flex items-center justify-center">
              <Compass className="w-9 h-9 text-[var(--brand)] animate-pulse" />
            </div>
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Page not found</h1>
        <p className="text-[var(--muted-fg)] mt-3 max-w-md mx-auto">
          The link is broken, or the page has been moved. Don&apos;t worry — here&apos;s where to go next.
        </p>
        <div className="flex items-center justify-center gap-3 mt-7">
          <Btn href="/" icon={<Home className="w-4 h-4" />}>Back to home</Btn>
          <Btn href="/components" variant="outline" icon={<Search className="w-4 h-4" />}>
            Browse components
          </Btn>
        </div>
        <div className="mt-10">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-fg)] mb-3">
            Popular pages
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {SUGGESTIONS.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--card)] border border-[var(--border)] hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
