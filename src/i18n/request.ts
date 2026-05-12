import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale, type Locale } from "./config";

const COOKIE_NAME = "NEXT_LOCALE";

/**
 * Resolve the active locale on every request. Priority:
 *   1. `NEXT_LOCALE` cookie (set by <LocaleSwitcher>)
 *   2. `Accept-Language` header (browser preference)
 *   3. `defaultLocale` fallback
 *
 * No URL-based routing — locale is a session preference, not part of the path.
 */
function isLocale(v: string | null | undefined): v is Locale {
  return !!v && (locales as readonly string[]).includes(v);
}

function detectFromHeader(accept: string | null): Locale | null {
  if (!accept) return null;
  for (const part of accept.split(",")) {
    const code = part.split(";")[0].trim().toLowerCase();
    const base = code.split("-")[0];
    if (isLocale(base)) return base;
  }
  return null;
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const fromCookie = cookieStore.get(COOKIE_NAME)?.value ?? null;
  const fromHeader = detectFromHeader(headerStore.get("accept-language"));

  const locale: Locale = isLocale(fromCookie)
    ? fromCookie
    : fromHeader ?? defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
