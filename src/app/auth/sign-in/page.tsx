"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Btn, Input, Field } from "@/components/ui";
import { Separator } from "@/components/ui/Separator";
import { OAuthRow } from "@/components/auth/OAuthRow";
import { toast } from "@/lib/toast";

export default function SignInPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const search = useSearchParams();
  const redirect = search.get("redirect") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [magicSent, setMagicSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "magic") {
        const res = await fetch("/api/auth/magic-link/request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (!res.ok) throw new Error("request_failed");
        setMagicSent(true);
        return;
      }
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        toast.error(data?.error?.code ?? "sign_in_failed");
        return;
      }
      router.push(redirect);
    } catch {
      toast.error("network_error");
    } finally {
      setLoading(false);
    }
  }

  if (magicSent) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-[var(--brand-soft)] flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-[var(--brand)]" />
        </div>
        <h2 className="text-xl font-bold">Check your email</h2>
        <p className="text-sm text-[var(--muted-fg)] mt-2">
          We sent a magic link to <strong className="text-[var(--foreground)]">{email}</strong>.
          The link expires in 15 minutes.
        </p>
        <button
          onClick={() => {
            setMagicSent(false);
            setMode("password");
          }}
          className="text-xs text-[var(--brand)] hover:underline mt-6"
        >
          ← Use a different email
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm">
      <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
      <p className="text-sm text-[var(--muted-fg)] mt-1">Sign in to continue to your workspace.</p>

      <div className="mt-6">
        <OAuthRow />
      </div>

      <Separator label="or" />

      <form onSubmit={onSubmit} className="space-y-4">
        <Field label={t("email")} required>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-fg)]" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
              placeholder="you@company.com"
              className="!pl-9"
            />
          </div>
        </Field>
        {mode === "password" && (
          <Field
            label={t("password")}
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
        )}
        <Btn type="submit" loading={loading} className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
          {mode === "magic" ? "Send magic link" : "Sign in"}
        </Btn>
        <button
          type="button"
          onClick={() => setMode(mode === "password" ? "magic" : "password")}
          className="text-xs text-[var(--muted-fg)] hover:text-[var(--foreground)] w-full text-center transition-colors"
        >
          {mode === "password" ? "→ Send me a magic link instead" : "→ Use password instead"}
        </button>
      </form>

      <p className="text-sm text-center text-[var(--muted-fg)] mt-8 pt-6 border-t border-[var(--border)]">
        New to NextPolyglot?{" "}
        <Link href="/auth/sign-up" className="text-[var(--brand)] hover:underline font-semibold">
          Create an account
        </Link>
      </p>
    </div>
  );
}
