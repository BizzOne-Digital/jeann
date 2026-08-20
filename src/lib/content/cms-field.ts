export function cmsField(
  fields: Record<string, string> | undefined,
  key: string,
  fallback: string,
): string {
  const value = fields?.[key]?.trim();
  return value || fallback;
}
