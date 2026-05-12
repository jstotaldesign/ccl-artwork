"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { Btn, Input, Field } from "@/components/ui";
import { toast } from "@/lib/toast";

/**
 * "Cover" auth variant — bypasses the split-screen layout for a centered
 * full-bleed look. Buyers often prefer this style for landing-style auth.
 */
export default function CoverSignInPage() {
  const [email, setEmail] = useState("demo@nextpolyglot.dev");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    toast.success("Welcome back");
  }

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-2xl shadow-black/5">
      <div className="bg-brand-gradient relative px-8 py-12 text-center text-white">
        <div className="absolute inset-0 bg-grid opacity-25" aria-hidden />
        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-lg mb-5">
            <span className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </span>
            NextPolyglot
          </Link>
          <h2 className="text-2xl font-extrabold tracking-tight">Welcome back</h2>
          <p className="text-sm opacity-90 mt-1">Sign in to your workspace</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="p-8 space-y-4">
        <Field label="Email" required>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-fg)]" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@company.com"
              className="!pl-9"
            />
          </div>
        </Field>
        <Field
          label="Password"
          required
          trailing={
            <Link href="/auth/reset-password" className="text-xs font-medium text-[var(--brand)] hover:underline">
              Forgot?
            </Link>
          }
        >
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-fg)]" />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="!pl-9"
            />
          </div>
        </Field>
        <Btn type="submit" loading={loading} className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
          Sign in
        </Btn>

        <p className="text-sm text-center text-[var(--muted-fg)] pt-4 border-t border-[var(--border)] mt-2">
          New to NextPolyglot?{" "}
          <Link href="/auth/sign-up" className="text-[var(--brand)] hover:underline font-semibold">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
