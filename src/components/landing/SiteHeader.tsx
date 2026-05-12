"use client";

import Link from "next/link";
import { Btn } from "@/components/ui";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { Sparkles } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-[var(--background)]/70 border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="w-7 h-7 rounded-lg bg-brand-gradient flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </span>
          NextPolyglot
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-[var(--muted-fg)]">
          <a href="/#features" className="hover:text-[var(--foreground)] transition-colors">Features</a>
          <Link href="/components" className="hover:text-[var(--foreground)] transition-colors">Components</Link>
          <Link href="/pricing" className="hover:text-[var(--foreground)] transition-colors">Pricing</Link>
          <Link href="/blog" className="hover:text-[var(--foreground)] transition-colors">Blog</Link>
          <Link href="/faq" className="hover:text-[var(--foreground)] transition-colors">FAQ</Link>
        </nav>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
          <Link href="/auth/sign-in" className="hidden sm:inline text-sm font-medium text-[var(--muted-fg)] hover:text-[var(--foreground)] px-3 py-2">
            Sign in
          </Link>
          <Btn href="/auth/sign-up" size="sm">Get started</Btn>
        </div>
      </div>
    </header>
  );
}
