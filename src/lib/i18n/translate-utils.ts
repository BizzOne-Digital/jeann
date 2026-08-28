const MYMEMORY_QUOTA = /MYMEMORY WARNING/i;

export function isUsableTranslation(source: string, translated: string | undefined): boolean {
  const original = source.trim();
  const value = translated?.trim() ?? "";
  if (!value || value === original) return false;
  if (MYMEMORY_QUOTA.test(value)) return false;
  return true;
}

export function sanitizeTranslationCache(cache: Record<string, string>) {
  const clean: Record<string, string> = {};
  for (const [source, translated] of Object.entries(cache)) {
    if (isUsableTranslation(source, translated)) {
      clean[source] = translated;
    }
  }
  return clean;
}
