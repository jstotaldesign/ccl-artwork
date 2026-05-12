"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, Smartphone, RotateCw } from "lucide-react";
import { Btn } from "@/components/ui";
import { toast } from "@/lib/toast";

const LENGTH = 6;
const CHANNEL_PHONE = "+66 ** *** 4521";

export default function TwoStepPage() {
  const router = useRouter();
  const [code, setCode] = useState<string[]>(Array.from({ length: LENGTH }, () => ""));
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  function setSlot(i: number, value: string) {
    const v = value.replace(/\D/g, "").slice(0, 1);
    const next = [...code];
    next[i] = v;
    setCode(next);
    if (v && i < LENGTH - 1) inputsRef.current[i + 1]?.focus();
  }

  function onKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && i > 0) inputsRef.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < LENGTH - 1) inputsRef.current[i + 1]?.focus();
  }

  function onPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!text) return;
    e.preventDefault();
    const next = Array.from({ length: LENGTH }, (_, i) => text[i] ?? "");
    setCode(next);
    inputsRef.current[Math.min(text.length, LENGTH - 1)]?.focus();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.some((c) => !c)) {
      toast.error("Enter all 6 digits");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    toast.success("Verified");
    router.push("/dashboard");
  }

  function onResend() {
    setCooldown(30);
    toast.info("Code re-sent to your phone");
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm">
      <div className="w-12 h-12 rounded-2xl bg-[var(--brand-soft)] flex items-center justify-center mb-4">
        <ShieldCheck className="w-5 h-5 text-[var(--brand)]" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Two-step verification</h2>
      <p className="text-sm text-[var(--muted-fg)] mt-1 flex items-center gap-1.5">
        <Smartphone className="w-3.5 h-3.5" /> Code sent to <strong className="text-[var(--foreground)]">{CHANNEL_PHONE}</strong>
      </p>

      <form onSubmit={onSubmit} className="mt-6">
        <p className="text-xs font-semibold text-[var(--muted-fg)] mb-3">Enter 6-digit code</p>
        <div className="flex items-center justify-between gap-2">
          {code.map((v, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={v}
              onChange={(e) => setSlot(i, e.target.value)}
              onKeyDown={(e) => onKey(i, e)}
              onPaste={onPaste}
              autoFocus={i === 0}
              className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border border-[var(--border)] bg-[var(--background)] outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-all"
            />
          ))}
        </div>
        <Btn type="submit" loading={loading} className="w-full mt-6" icon={<ArrowRight className="w-4 h-4" />}>
          Verify
        </Btn>
      </form>

      <div className="mt-6 pt-6 border-t border-[var(--border)] text-center text-sm">
        <p className="text-[var(--muted-fg)]">Didn&apos;t get a code?</p>
        <button
          onClick={onResend}
          disabled={cooldown > 0}
          className="inline-flex items-center gap-1.5 text-[var(--brand)] hover:underline font-semibold mt-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
        >
          <RotateCw className="w-3.5 h-3.5" />
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
        </button>
      </div>

      <p className="text-xs text-center text-[var(--muted-fg)] mt-8">
        <Link href="/auth/sign-in" className="hover:text-[var(--foreground)] transition-colors">
          ← Back to sign in
        </Link>
      </p>
    </div>
  );
}
