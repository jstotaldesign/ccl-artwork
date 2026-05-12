/**
 * Resolve the app's base URL at runtime. Prefers `NEXT_PUBLIC_APP_URL` when
 * it's set to a non-localhost value (production). In dev (or when the env
 * var is missing) reads the request headers so magic-link emails and Stripe
 * checkout URLs stay correct even when the dev server lands on a non-3000
 * port.
 *
 * Server-only — uses `next/headers`. Call from route handlers, server
 * components, server actions. Falls back to "http://localhost:3000" if no
 * request context is available (e.g., the seed script).
 */

import { headers } from "next/headers";

const FALLBACK = "http://localhost:3000";

function isProdEnvUrl(url: string | undefined): url is string {
  if (!url) return false;
  // Treat the localhost default in .env.example as "not set" so dev-mode
  // host detection takes over when the port shifts.
  return !/^https?:\/\/localhost(:\d+)?\/?$/i.test(url);
}

export async function getAppUrl(): Promise<string> {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (isProdEnvUrl(envUrl)) return envUrl.replace(/\/+$/, "");

  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    if (host) {
      const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
      return `${proto}://${host}`;
    }
  } catch {
    // Outside request context — fall through.
  }

  return envUrl ?? FALLBACK;
}
