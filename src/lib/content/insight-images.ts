/** Cover art for the Insights hub — client photos under `public/images/insights/`. */

const BY_SLUG: Record<string, string> = {
  "fob-vs-cif-for-bulk-commodities": "/images/insights/cover-international-rail-containers.jpg",
  "how-purchase-requests-work": "/images/insights/cover-purchase-requests.jpg",
  "packaging-options-in-bulk-trade": "/images/insights/cover-packaging-bulk.jpg",
  "document-checklists-are-route-specific": "/images/insights/cover-trade-documents.jpg",
};

const FALLBACK = [
  "/images/products/product-2.png",
  "/images/products/product-3.png",
  "/images/products/product-4.png",
  "/images/products/product-5.png",
];

/** Hero for /insights lives at `/images/insights/market-insights-hero.jpg` (see page hero registry). */
export const INSIGHTS_HUB_SECTION_PHOTOS = {
  overview: {
    src: BY_SLUG["fob-vs-cif-for-bulk-commodities"],
    alt: "International rail containers — FOB and CIF corridor context",
  },
  architecture: {
    src: BY_SLUG["how-purchase-requests-work"],
    alt: "Trade desk and purchase request documentation",
  },
  protocol: {
    src: BY_SLUG["packaging-options-in-bulk-trade"],
    alt: "FIBC jumbo bags in a warehouse aisle",
  },
  validationBand: {
    src: BY_SLUG["document-checklists-are-route-specific"],
    alt: "Shipping documents stamped at a port office",
  },
  domainLab: {
    src: "/images/insights/validation/domain-lab-wheat.jpg",
    alt: "Grain sampling tools on a laboratory bench — ISO 17025 test method validation context",
  },
  domainSupply: {
    src: "/images/insights/validation/domain-supply-wheat-field.jpg",
    alt: "Wheat field at sunrise with blank clipboard and sealed grain sample — origin verification context",
  },
  domainFinance: {
    src: "/images/insights/validation/domain-finance-desk.jpg",
    alt: "Trade documentation still life — documentary credit and compliance validation context",
  },
  domainCtrm: {
    src: "/images/insights/validation/domain-ctrm-cocoa.jpg",
    alt: "Raw cocoa beans in burlap — commodity trading and digital risk systems context",
  },
} as const;

export function getInsightCover(slug: string, index = 0): string {
  return BY_SLUG[slug] ?? FALLBACK[index % FALLBACK.length]!;
}
