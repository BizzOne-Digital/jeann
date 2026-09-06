import { AGRICULTURE_IMAGES } from "@/lib/content/agriculture-images";
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

/** Distinct hero photography per marketing page — agriculture pages use client-supplied field imagery. */
export const PAGE_HERO_IMAGES: Record<PageHeroImageKey, PageHeroImage> = {
  home: {
    src: "/images/hero-home.jpg",
    alt: "Agricultural commodities, port logistics, and refining infrastructure",
  },
  about: AGRICULTURE_IMAGES.riceTerraces,
  products: AGRICULTURE_IMAGES.greenGrainField,
  resources: {
    src: "/images/packaging/containerized-cargo-loading.png",
    alt: "Containerized commodity exports and trade documentation",
  },
  contact: {
    src: "/images/inspections/port-sampling.png",
    alt: "Trade desk support at the port",
  },
  insights: AGRICULTURE_IMAGES.teaPlantation,
  faq: AGRICULTURE_IMAGES.greenGrainField,
  team: AGRICULTURE_IMAGES.teaPlantation,
  testimonials: AGRICULTURE_IMAGES.grainSilos,
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
  logistics: PACKAGING_IMAGES.bulkVessel,
  packaging: PACKAGING_IMAGES.bulkVessel,
  buyerTerms: AGRICULTURE_IMAGES.greenGrainField,
  cookies: {
    src: "/images/packaging/palletized-bags.png",
    alt: "Palletized commodity bags in warehouse storage",
  },
  accessibility: AGRICULTURE_IMAGES.riceTerraces,
  buyerRequest: AGRICULTURE_IMAGES.grainSilos,
  supplierOffer: AGRICULTURE_IMAGES.tractorPlowing,
};

export function getPageHeroImage(key: PageHeroImageKey): PageHeroImage {
  return PAGE_HERO_IMAGES[key];
}
