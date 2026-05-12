/**
 * SQLite doesn't support String[] — we store list fields as CSV. Use these
 * helpers everywhere you read/write `ApiKey.scopes` or `Webhook.events`.
 *
 * When switching to Postgres in production:
 *   1. Change schema fields back to String[]
 *   2. Replace toList() with the array directly and packList() with no-op
 *      (or just delete this helper and inline the array literals)
 */

export function toList(csv: string | null | undefined): string[] {
  if (!csv) return [];
  return csv.split(",").map((s) => s.trim()).filter(Boolean);
}

export function packList(items: readonly string[]): string {
  return items.map((s) => s.trim()).filter(Boolean).join(",");
}
