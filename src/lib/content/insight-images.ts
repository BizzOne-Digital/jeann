/** Cover art used on the Insights hub — distinct paths for articles and the operational guide. */

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

/** Hero for /insights lives at `/images/insights/market-insights-hero.jpg` (see page hero registry). */
export const INSIGHTS_HUB_SECTION_PHOTOS = {
  overview: {
    src: BY_SLUG["fob-vs-cif-for-bulk-commodities"],
    alt: "Container vessel at export port — global commodity trade corridor",
  },
  architecture: {
    src: BY_SLUG["how-purchase-requests-work"],
    alt: "Containerized commodity loading at port",
  },
  protocol: {
    src: BY_SLUG["packaging-options-in-bulk-trade"],
    alt: "FIBC jumbo bags for bulk dry commodity programmes",
  },
  validationBand: {
    src: BY_SLUG["document-checklists-are-route-specific"],
    alt: "ISO tank container for intermodal liquid bulk",
  },
  domainLab: {
    src: FALLBACK[0],
    alt: "Dry bulk container liner for packaged trade flows",
  },
  domainSupply: {
    src: FALLBACK[1],
    alt: "Kraft paper sacks for moisture-sensitive soft commodities",
  },
  domainFinance: {
    src: FALLBACK[2],
    alt: "Steel drums for unitized liquid cargo",
  },
  domainCtrm: {
    src: FALLBACK[3],
    alt: "IBC tote for specialty liquid distribution units",
  },
} as const;

export function getInsightCover(slug: string, index = 0): string {
  return BY_SLUG[slug] ?? FALLBACK[index % FALLBACK.length]!;
}
