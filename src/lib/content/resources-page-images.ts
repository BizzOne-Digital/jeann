/** Each image used at most once on `/resources` (hero is CMS `resourcesHero`). */
export const RESOURCES_PAGE_IMAGES = {
  banking: {
    src: "/images/resources/spa-banking-handshake.png",
    alt: "Business handshake — commodity sale and purchase agreement context",
  },
  introAbstract: {
    src: "/images/resources/intro-abstract-background.jpg",
    alt: "",
  },
  payments: {
    src: "/images/resources/payments-programme-finance.png",
    alt: "Trade finance and structured payment programme planning",
  },
  documents: {
    src: "/images/resources/documents-trade-audit.jpg",
    alt: "Trade audit and documentary compliance review",
  },
  downloads: {
    src: "/images/agriculture/grain-silos.png",
    alt: "Grain silos and export storage for trade document downloads",
  },
} as const;
