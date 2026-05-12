/**
 * Field-level diff for audit logs. Use after a Prisma update to record only
 * the fields that actually changed instead of the full record.
 *
 * Pattern:
 *   const before = await prisma.foo.findUnique({ where: { id } });
 *   const after  = await prisma.foo.update({ where: { id }, data });
 *   const changes = diff(before, after, ["name", "isActive"]);
 *   await audit({ action: "foo.update", entity: "Foo", entityId: id, detail: { changes } });
 */

export type FieldChange = { old: unknown; new: unknown };
export type Changes = Record<string, FieldChange>;

const PII_FIELDS = new Set(["password", "passwordHash", "secret", "apiKey", "token", "creditCard"]);

export function diff(
  before: Record<string, unknown> | null | undefined,
  after: Record<string, unknown> | null | undefined,
  fields: readonly string[],
): Changes {
  const changes: Changes = {};
  if (!before || !after) return changes;
  for (const f of fields) {
    const oldRaw = before[f];
    const newRaw = after[f];
    const oldStr = oldRaw == null ? "" : String(oldRaw);
    const newStr = newRaw == null ? "" : String(newRaw);
    if (oldStr === newStr) continue;
    if (PII_FIELDS.has(f)) {
      changes[f] = { old: oldRaw ? "(set)" : "(unset)", new: newRaw ? "(set)" : "(unset)" };
    } else {
      changes[f] = { old: oldRaw, new: newRaw };
    }
  }
  return changes;
}
