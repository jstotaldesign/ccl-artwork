"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Mail, Lock, User, Building, ArrowRight } from "lucide-react";
import { Btn, Input, Field } from "@/components/ui";
import { Separator } from "@/components/ui/Separator";
import { OAuthRow } from "@/components/auth/OAuthRow";
import { toast } from "@/lib/toast";

export default function SignUpPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, tenantName }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        toast.error(data?.error?.code ?? "sign_up_failed");
        return;
      }
      router.push("/dashboard");
    } catch {
      toast.error("network_error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm">
      <h2 className="text-2xl font-bold tracking-tight">Create your workspace</h2>
      <p className="text-sm text-[var(--muted-fg)] mt-1">Start shipping in seconds. No credit card required.</p>

      <div className="mt-6">
        <OAuthRow />
      </div>

      <Separator label="or" />

      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Your name" required>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-fg)]" />
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              placeholder="Alex Chen"
              className="!pl-9"
            />
          </div>
        </Field>
        <Field label="Workspace name" hint="The name of your team or company." required>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-fg)]" />
            <Input
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              required
              placeholder="Acme Inc"
              className="!pl-9"
            />
          </div>
        </Field>
        <Field label={t("email")} required>
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
        <Field label={t("password")} hint="At least 8 characters." required>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-fg)]" />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="••••••••"
              className="!pl-9"
            />
          </div>
        </Field>
        <Btn type="submit" loading={loading} className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
          Create workspace
        </Btn>
      </form>

      <p className="text-xs text-center text-[var(--muted-fg)] mt-6">
        By creating an account you agree to our{" "}
        <Link href="/legal" className="underline hover:text-[var(--foreground)]">Terms</Link>
        {" and "}
        <Link href="/legal" className="underline hover:text-[var(--foreground)]">Privacy Policy</Link>.
      </p>

      <p className="text-sm text-center text-[var(--muted-fg)] mt-6 pt-6 border-t border-[var(--border)]">
        Already have an account?{" "}
        <Link href="/auth/sign-in" className="text-[var(--brand)] hover:underline font-semibold">
          Sign in
        </Link>
      </p>
    </div>
  );
}
