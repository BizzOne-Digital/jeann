import { AGRICULTURE_IMAGES } from "@/lib/content/agriculture-images";
import { LOGISTICS_IMAGES } from "@/lib/content/logistics-images";
import { PACKAGING_IMAGES } from "@/lib/content/packaging-images";

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

/** One distinct hero photograph per marketing page — no shared paths across keys. */
export const PAGE_HERO_IMAGES: Record<PageHeroImageKey, PageHeroImage> = {
  home: {
    src: "/images/hero-home.jpg",
    alt: "Agricultural commodities, port logistics, and refining infrastructure",
  },
  about: AGRICULTURE_IMAGES.riceTerraces,
  products: AGRICULTURE_IMAGES.greenGrainField,
  resources: AGRICULTURE_IMAGES.resourcesHero,
  contact: {
    src: "/images/inspections/port-sampling.png",
    alt: "Trade desk support at the port",
  },
  insights: {
    src: "/images/insights/market-insights-hero.jpg",
    alt: "Trade professionals reviewing global market data and commodity insights in a boardroom",
  },
  faq: AGRICULTURE_IMAGES.combineHarvest,
  team: AGRICULTURE_IMAGES.grainSilos,
  testimonials: AGRICULTURE_IMAGES.tractorPlowing,
  booking: {
    src: "/images/inspections/liquid-sampling.png",
    alt: "Quality consultation and commodity sampling",
  },
  partners: {
    src: "/images/inspections/sampling-grain.png",
    alt: "Independent verification partners at origin",
  },
  inspections: {
    src: "/images/inspections/port-cargo-inspection-hero.png",
    alt: "Independent cargo inspection at port — vessel loading supervision with third-party inspector",
  },
  verification: {
    src: "/images/inspections/cargo-inspector-loading.png",
    alt: "Cargo loading supervision and due diligence",
  },
  logistics: LOGISTICS_IMAGES.hero,
  packaging: PACKAGING_IMAGES.tankerVessel,
  buyerTerms: PACKAGING_IMAGES.containerizedCargoPort,
  cookies: PACKAGING_IMAGES.palletizedBags,
  accessibility: PACKAGING_IMAGES.bulkRailcar,
  buyerRequest: {
    src: "/images/inspections/sugar-bags-hold.png",
    alt: "Bagged sugar quantity verification in a vessel hold",
  },
  supplierOffer: PACKAGING_IMAGES.bulkTruck,
};

export function getPageHeroImage(key: PageHeroImageKey): PageHeroImage {
  return PAGE_HERO_IMAGES[key];
}
