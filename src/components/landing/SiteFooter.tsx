import Link from "next/link";
import { Sparkles } from "lucide-react";

const cols = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "Components", href: "/components" },
      { label: "Demo", href: "/auth/sign-up" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Credits & Licenses", href: "/credits" },
      { label: "Refund policy", href: "/terms#6-refunds" },
      { label: "Support", href: "mailto:hello@nextpolyglot.dev" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <span className="w-7 h-7 rounded-lg bg-brand-gradient flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </span>
              NextPolyglot
            </Link>
            <p className="text-xs text-[var(--muted-fg)] mt-3 max-w-xs">
              The Next.js SaaS boilerplate for global teams.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)] mb-3">{c.title}</p>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-[var(--muted-fg)] hover:text-[var(--foreground)] transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--muted-fg)]">
          <p>© 2026 NextPolyglot. Not affiliated with Vercel, Stripe, or any third-party brand.</p>
          <p className="font-mono">🇬🇧 🇹🇭 🇨🇳 🇻🇳 🇰🇭 🇱🇦 🇲🇲</p>
        </div>
      </div>
    </footer>
  );
}
