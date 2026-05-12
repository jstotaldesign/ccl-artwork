"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Globe, Check } from "lucide-react";
import { locales, localeLabels, type Locale } from "@/i18n/config";

/**
 * Locale switcher — sets the `NEXT_LOCALE` cookie that next-intl reads on the
 * server, then refreshes the route so messages re-render in the new language.
 *
 * Cookie matches the default name next-intl looks for. 365-day expiry, root path.
 */
export function LocaleSwitcher({ compact = false }: { compact?: boolean }) {
  const current = useLocale() as Locale;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  function pick(loc: Locale) {
    document.cookie = `NEXT_LOCALE=${loc}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    setOpen(false);
    router.refresh();
  }

  const currentLabel = localeLabels[current];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 rounded-lg hover:bg-[var(--muted)] text-[var(--muted-fg)] hover:text-[var(--foreground)] transition-colors ${
          compact ? "w-9 h-9 justify-center" : "px-2.5 py-1.5 text-sm"
        }`}
        aria-label="Change language"
        title="Change language"
      >
        {compact ? (
          <Globe className="w-4 h-4" />
        ) : (
          <>
            <span className="text-base leading-none">{currentLabel.flag}</span>
            <span className="font-semibold uppercase">{current}</span>
          </>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 min-w-[180px] py-1 rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-lg z-50">
          {locales.map((loc) => {
            const label = localeLabels[loc];
            const active = loc === current;
            return (
              <button
                key={loc}
                onClick={() => pick(loc)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--muted)] transition-colors"
              >
                <span className="text-base leading-none">{label.flag}</span>
                <span className="flex-1 text-left">{label.native}</span>
                <span className="text-[10px] font-mono text-[var(--muted-fg)] uppercase">{loc}</span>
                {active && <Check className="w-3.5 h-3.5 text-[var(--brand)]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
