/** A date as YYYYMMDD, the form SWIFT fields :31C: and :31D: use. Returns undefined for a missing or invalid date. */
export function swiftDate(value: Date | string | undefined | null): string | undefined {
  if (!value) return undefined;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return (
    String(d.getUTCFullYear()).padStart(4, "0") +
    String(d.getUTCMonth() + 1).padStart(2, "0") +
    String(d.getUTCDate()).padStart(2, "0")
  );
}
