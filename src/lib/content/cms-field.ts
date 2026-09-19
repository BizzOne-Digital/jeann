export function cmsField(
  fields: Record<string, string> | undefined,
  key: string,
  fallback: string,
): string {
  const value = fields?.[key]?.trim();
  return value || fallback;
}

/** One list item per line in the CMS textarea. */
export function cmsLines(
  fields: Record<string, string> | undefined,
  key: string,
  fallback: string[],
): string[] {
  const raw = fields?.[key]?.trim();
  if (!raw) return fallback;
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/** One paragraph per blank line in the CMS textarea. */
export function cmsParagraphs(
  fields: Record<string, string> | undefined,
  key: string,
  fallback: string[],
): string[] {
  const raw = fields?.[key]?.trim();
  if (!raw) return fallback;
  return raw
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export type CmsSectionMap = Record<string, Record<string, string>>;

export function cmsSection(
  sections: CmsSectionMap | undefined,
  sectionId: string,
): Record<string, string> {
  return sections?.[sectionId] ?? {};
}
