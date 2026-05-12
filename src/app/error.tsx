"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, Home, RotateCcw, LifeBuoy } from "lucide-react";
import { Btn } from "@/components/ui";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with your error tracker (Sentry / etc.)
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-mesh">
      <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
      <div className="relative max-w-2xl mx-auto px-6 text-center py-12">
        <div className="relative inline-block mb-6">
          <p className="text-[140px] sm:text-[180px] font-extrabold leading-none tracking-tight bg-gradient-to-br from-red-500 via-orange-500 to-pink-500 bg-clip-text text-transparent select-none">
            500
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-[var(--card)] border border-[var(--border)] shadow-lg flex items-center justify-center">
              <AlertOctagon className="w-9 h-9 text-red-500" />
            </div>
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Something went wrong</h1>
        <p className="text-[var(--muted-fg)] mt-3 max-w-md mx-auto">
          An unexpected error occurred. Our team has been notified — try refreshing in a moment.
        </p>

        {error.digest && (
          <div className="inline-block px-3 py-1.5 rounded-full bg-[var(--muted)] text-[var(--muted-fg)] text-xs font-mono mt-4">
            error_id: {error.digest}
          </div>
        )}

        <div className="flex items-center justify-center gap-3 mt-7">
          <Btn onClick={reset} icon={<RotateCcw className="w-4 h-4" />}>Try again</Btn>
          <Btn href="/" variant="outline" icon={<Home className="w-4 h-4" />}>Back to home</Btn>
        </div>

        <div className="mt-10">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-fg)] hover:text-[var(--foreground)] transition-colors"
          >
            <LifeBuoy className="w-4 h-4" /> Still broken? Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}
