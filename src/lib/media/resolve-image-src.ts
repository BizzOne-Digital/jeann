/** Placeholder when a legacy disk upload path is missing after serverless deploy. */
export const MISSING_UPLOAD_PLACEHOLDER = "/images/products/product-1.png";

/**
 * Resolve image URLs for Next/Image. Legacy `/uploads/...` disk paths are replaced
 * with a placeholder because production filesystem is read-only on Vercel.
 */
export function resolveImageSrc(src?: string | null): string {
  if (!src?.trim()) return MISSING_UPLOAD_PLACEHOLDER;
  const value = src.trim();
  if (value.startsWith("/uploads/")) return MISSING_UPLOAD_PLACEHOLDER;
  return value;
}

export function isStoredUploadUrl(src?: string | null): boolean {
  return Boolean(src?.trim().startsWith("/api/uploads/"));
}
