"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, CheckCircle2, KeyRound } from "lucide-react";
import { Btn, Input, Field } from "@/components/ui";
import { toast } from "@/lib/toast";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setSent(true);
    toast.success("If an account exists, we've sent reset instructions.");
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-sm">
        <div className="w-14 h-14 rounded-full bg-[var(--brand-soft)] flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-[var(--brand)]" />
        </div>
        <h2 className="text-xl font-bold">Check your email</h2>
        <p className="text-sm text-[var(--muted-fg)] mt-2">
          If <strong className="text-[var(--foreground)]">{email}</strong> is registered,
          you&apos;ll receive a reset link in the next minute. It expires in 30 minutes.
        </p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => {
              setSent(false);
              setEmail("");
            }}
            className="text-xs text-[var(--brand)] hover:underline font-semibold"
          >
            ← Use a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm">
      <div className="w-12 h-12 rounded-2xl bg-[var(--brand-soft)] flex items-center justify-center mb-4">
        <KeyRound className="w-5 h-5 text-[var(--brand)]" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Reset your password</h2>
      <p className="text-sm text-[var(--muted-fg)] mt-1">
        Enter your email — we&apos;ll send a link to reset your password.
      </p>

      <form onSubmit={onSubmit} className="space-y-4 mt-6">
        <Field label="Email" required>
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
        <Btn type="submit" loading={loading} className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
          Send reset link
        </Btn>
      </form>

      <p className="text-sm text-center text-[var(--muted-fg)] mt-8 pt-6 border-t border-[var(--border)]">
        Remembered your password?{" "}
        <Link href="/auth/sign-in" className="text-[var(--brand)] hover:underline font-semibold">
          Sign in
        </Link>
      </p>
    </div>
  );
}
