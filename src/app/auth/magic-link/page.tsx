"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, Spinner, Btn } from "@/components/ui";

export default function MagicLinkPage() {
  const router = useRouter();
  const search = useSearchParams();
  const token = search.get("token");
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorCode, setErrorCode] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorCode("missing_token");
      return;
    }
    fetch("/api/auth/magic-link/consume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        if (res.ok) {
          router.push("/dashboard");
          return;
        }
        const data = await res.json().catch(() => null);
        setStatus("error");
        setErrorCode(data?.error?.code ?? "unknown_error");
      })
      .catch(() => {
        setStatus("error");
        setErrorCode("network_error");
      });
  }, [token, router]);

  if (status === "loading") {
    return (
      <Card>
        <div className="flex flex-col items-center py-6">
          <Spinner size="lg" />
          <p className="text-sm text-[var(--muted-fg)] mt-4">Signing you in…</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-lg font-bold">Link invalid</h2>
      <p className="text-sm text-[var(--muted-fg)] mt-2">
        {errorCode === "invalid_or_expired_token"
          ? "This magic link has expired or already been used. Request a new one."
          : "Something went wrong. Please try again."}
      </p>
      <div className="mt-4">
        <Btn href="/auth/sign-in" variant="primary">
          Back to sign in
        </Btn>
      </div>
    </Card>
  );
}
