export type PageHeroImageKey =
  | "home"
  | "about"
  | "products"
  | "resources"
  | "contact"
  | "insights"
  | "faq"
  | "team"
  | "testimonials"
  | "booking"
  | "partners"
  | "inspections"
  | "verification"
  | "logistics"
  | "packaging"
  | "buyerTerms"
  | "cookies"
  | "accessibility"
  | "buyerRequest"
  | "supplierOffer";

export type PageHeroImage = {
  src: string;
  alt: string;
};

/** Distinct hero photography per marketing page — different aspects of the business. */
export const PAGE_HERO_IMAGES: Record<PageHeroImageKey, PageHeroImage> = {
  home: {
    src: "/images/hero-commodities.png",
    alt: "Agricultural commodities with port logistics and refining infrastructure",
  },
  about: {
    src: "/images/home-1.png",
    alt: "Global commodity markets and trade relationships",
  },
  products: {
    src: "/images/products/oils/refined-sunflower-product.png",
    alt: "Refined edible oils and bulk agricultural products",
  },
  resources: {
    src: "/images/packaging/containerized-cargo-loading.png",
    alt: "Containerized commodity exports and trade documentation",
  },
  contact: {
    src: "/images/inspections/port-sampling.png",
    alt: "Trade desk support at the port",
  },
  insights: {
    src: "/images/home-3.png",
    alt: "Market insights for international commodity trade",
  },
  faq: {
    src: "/images/products/rice/long-grain-pile.png",
    alt: "Bulk rice and grains traded internationally",
  },
  team: {
    src: "/images/products/coffee/fresh-coffee-harvest.png",
    alt: "Harvest and operations across commodity supply chains",
  },
  testimonials: {
    src: "/images/products/sugar/icumsa-45-white-sugar-3.png",
    alt: "Refined sugar programmes for global buyers",
  },
  booking: {
    src: "/images/inspections/liquid-sampling.png",
    alt: "Quality consultation and commodity sampling",
  },
  partners: {
    src: "/images/inspections/sampling-grain.png",
    alt: "Independent verification partners at origin",
  },
  inspections: {
    src: "/images/inspections/tank-sampling.png",
    alt: "Tank and vessel inspection on bulk shipments",
  },
  verification: {
    src: "/images/inspections/cargo-inspector-loading.png",
    alt: "Cargo loading supervision and due diligence",
  },
  logistics: {
    src: "/images/packaging/bulk-vessel-loading.png",
    alt: "Bulk vessel loading at port for international shipment",
  },
  packaging: {
    src: "/images/packaging/containerized-cargo-port.png",
    alt: "Containerized cargo at port for export",
  },
  buyerTerms: {
    src: "/images/products/beans/beans-variety-mosaic.png",
    alt: "Beans, pulses, and agricultural commodities for buyers",
  },
  cookies: {
    src: "/images/packaging/palletized-bags.png",
    alt: "Palletized commodity bags in warehouse storage",
  },
  accessibility: {
    src: "/images/home-2.png",
    alt: "Finekarts marketing and portal experience",
  },
  buyerRequest: {
    src: "/images/products/oils/refined-vegetable-bottling.png",
    alt: "Refined vegetable oil production for buyer programmes",
  },
  supplierOffer: {
    src: "/images/packaging/bulk-truck-terminal.png",
    alt: "Bulk truck loading at a commodity terminal",
  },
};

export function getPageHeroImage(key: PageHeroImageKey): PageHeroImage {
  return PAGE_HERO_IMAGES[key];
}
