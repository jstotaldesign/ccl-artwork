"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, LogOut } from "lucide-react";
import { Btn, Input, Field } from "@/components/ui";
import { toast } from "@/lib/toast";

// In a real app you'd derive these from the current session.
const LOCKED_USER = {
  name: "Demo User",
  email: "demo@nextpolyglot.dev",
  initials: "DU",
};

export default function LockScreenPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    toast.success("Unlocked");
    router.push("/dashboard");
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm text-center">
      <div className="w-20 h-20 rounded-2xl bg-brand-gradient text-white flex items-center justify-center mx-auto mb-4 font-bold text-xl shadow-lg">
        {LOCKED_USER.initials}
      </div>
      <h2 className="text-xl font-bold">{LOCKED_USER.name}</h2>
      <p className="text-xs text-[var(--muted-fg)] mt-1">{LOCKED_USER.email}</p>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-xs font-semibold mt-5">
        <Lock className="w-3 h-3" /> Screen locked
      </div>

      <p className="text-sm text-[var(--muted-fg)] mt-5">
        Enter your password to continue your session.
      </p>

      <form onSubmit={onSubmit} className="space-y-4 mt-6 text-left">
        <Field label="Password" required>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-fg)]" />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              autoComplete="current-password"
              placeholder="••••••••"
              className="!pl-9"
            />
          </div>
        </Field>
        <Btn type="submit" loading={loading} className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
          Unlock
        </Btn>
      </form>

      <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-[var(--border)] text-xs">
        <Link href="/auth/reset-password" className="text-[var(--muted-fg)] hover:text-[var(--foreground)] transition-colors">
          Forgot password?
        </Link>
        <span className="text-[var(--muted-fg)]">·</span>
        <Link href="/auth/sign-in" className="text-[var(--muted-fg)] hover:text-[var(--foreground)] transition-colors flex items-center gap-1">
          <LogOut className="w-3 h-3" /> Sign in as someone else
        </Link>
      </div>
    </div>
  );
}
