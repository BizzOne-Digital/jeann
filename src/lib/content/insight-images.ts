/** Stable cover art for seed insights — each slug uses a distinct local asset. */
const BY_SLUG: Record<string, string> = {
  "fob-vs-cif-for-bulk-commodities": "/images/packaging/containerized-cargo-port.png",
  "how-purchase-requests-work": "/images/packaging/containerized-cargo-loading.png",
  "packaging-options-in-bulk-trade": "/images/packaging/fibc-jumbo-bags.png",
  "document-checklists-are-route-specific": "/images/packaging/iso-tank-1.png",
};

const FALLBACK = [
  "/images/packaging/bulk-liner.png",
  "/images/packaging/kraft-paper-bags.png",
  "/images/packaging/drums.png",
  "/images/packaging/ibc-1.png",
];

export function getInsightCover(slug: string, index = 0): string {
  return BY_SLUG[slug] ?? FALLBACK[index % FALLBACK.length]!;
}
