/**
 * Shared formatters — locale-aware date/time/money rendering.
 * Server-safe (no React, no DOM). Null/undefined/NaN safe.
 */

let _locale = "en-US";
export function setLocale(locale: string) { _locale = locale; }
export function getLocale() { return _locale; }

// ─── Date / Time ─────────────────────────────────────────────────────────────

export type DatePreset = "short" | "long" | "monthDay" | "compact" | "numeric" | "monthYear";

const DATE_OPTS: Record<DatePreset, Intl.DateTimeFormatOptions> = {
  short: { day: "2-digit", month: "short", year: "numeric" },
  long: { weekday: "long", day: "2-digit", month: "long", year: "numeric" },
  monthDay: { day: "2-digit", month: "short" },
  compact: { day: "2-digit", month: "2-digit", year: "2-digit" },
  numeric: { day: "numeric", month: "short", year: "numeric" },
  monthYear: { month: "long", year: "numeric" },
};

export function fmtDate(
  value: string | Date | null | undefined,
  preset: DatePreset = "short",
  fallback = "-",
  locale = _locale,
): string {
  if (value == null || value === "") return fallback;
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return fallback;
  return d.toLocaleDateString(locale, DATE_OPTS[preset]);
}

export type DateTimePreset = "short" | "long" | "full";

const DATETIME_OPTS: Record<DateTimePreset, Intl.DateTimeFormatOptions> = {
  short: { day: "2-digit", month: "short", year: "2-digit", hour: "2-digit", minute: "2-digit" },
  long: { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" },
  full: { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" },
};

export function fmtDateTime(
  value: string | Date | null | undefined,
  preset: DateTimePreset = "long",
  fallback = "-",
  locale = _locale,
): string {
  if (value == null || value === "") return fallback;
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return fallback;
  return d.toLocaleString(locale, DATETIME_OPTS[preset]);
}

export function fmtTime(
  value: string | Date | null | undefined,
  fallback = "—",
  locale = _locale,
): string {
  if (value == null || value === "") return fallback;
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return fallback;
  return d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
}

export function toLocalYmd(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function toUtcYmd(value: string | Date): string {
  const iso = value instanceof Date ? value.toISOString() : value;
  return iso.slice(0, 10);
}

// ─── Money / Number ──────────────────────────────────────────────────────────

/** Format cents as currency. amount is in *cents* (Stripe convention). */
export function fmtMoney(
  cents: number | null | undefined,
  currency = "USD",
  locale = _locale,
  fallback = "—",
): string {
  if (cents == null || isNaN(cents)) return fallback;
  return (cents / 100).toLocaleString(locale, {
    style: "currency",
    currency,
  });
}

/** Format a number value with locale grouping. NOT money. */
export function fmtNumber(
  value: number | string | null | undefined,
  maxDecimals = 0,
  fallback = "0",
  locale = _locale,
): string {
  if (value == null || value === "") return fallback;
  const n = typeof value === "string" ? Number(value) : value;
  if (isNaN(n)) return fallback;
  return n.toLocaleString(locale, { maximumFractionDigits: maxDecimals });
}

export function fmtInt(value: number | string | null | undefined, fallback = "0"): string {
  return fmtNumber(value, 0, fallback);
}

export function fmtPercent(
  value: number | null | undefined,
  decimals = 0,
  fallback = "0%",
  locale = _locale,
): string {
  if (value == null || isNaN(value)) return fallback;
  return value.toLocaleString(locale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** "2 hours ago", "in 3 days" — uses Intl.RelativeTimeFormat. */
export function fmtRelative(
  value: string | Date | null | undefined,
  fallback = "—",
  locale = _locale,
): string {
  if (value == null || value === "") return fallback;
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return fallback;
  const diffMs = d.getTime() - Date.now();
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const ranges: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 365 * 24 * 60 * 60 * 1000],
    ["month", 30 * 24 * 60 * 60 * 1000],
    ["week", 7 * 24 * 60 * 60 * 1000],
    ["day", 24 * 60 * 60 * 1000],
    ["hour", 60 * 60 * 1000],
    ["minute", 60 * 1000],
    ["second", 1000],
  ];
  for (const [unit, ms] of ranges) {
    if (Math.abs(diffMs) >= ms || unit === "second") {
      return rtf.format(Math.round(diffMs / ms), unit);
    }
  }
  return rtf.format(0, "second");
}
