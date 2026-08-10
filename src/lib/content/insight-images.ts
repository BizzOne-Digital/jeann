/** Stable cover art for seed insights (local assets only). */
const BY_SLUG: Record<string, string> = {
  "fob-vs-cif-for-bulk-commodities": "/images/home-2.png",
  "how-purchase-requests-work": "/images/home-1.png",
  "packaging-options-in-bulk-trade": "/images/products/product-1.png",
  "document-checklists-are-route-specific": "/images/products/product-3.png",
};

const FALLBACK = [
  "/images/home-1.png",
  "/images/home-2.png",
  "/images/products/product-1.png",
  "/images/products/product-3.png",
];

export function getInsightCover(slug: string, index = 0): string {
  return BY_SLUG[slug] ?? FALLBACK[index % FALLBACK.length]!;
}
