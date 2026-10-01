import { AGRICULTURE_IMAGES } from "@/lib/content/agriculture-images";
import { LOGISTICS_IMAGES } from "@/lib/content/logistics-images";
import { OFFICE_HERO_IMAGES } from "@/lib/content/office-hero-images";
import { PACKAGING_IMAGES } from "@/lib/content/packaging-images";

/** Each `src` is used at most once on the home page (excluding hero, connection pair, commodity grid, insights cards, ready CTA). */

export const HOME_OVERVIEW_TRADE_IMAGES = {
  resources: AGRICULTURE_IMAGES.combineHarvest,
  packaging: PACKAGING_IMAGES.bulkVesselLoading,
  logistics: LOGISTICS_IMAGES.railInternationalContainers,
  partners: {
    src: "/images/inspections/sgs-laboratory-grain-sampling.png",
    alt: "Independent laboratory sampling for partner inspection programmes",
  },
  verification: {
    src: "/images/inspections/cargo-inspector-loading.png",
    alt: "Loading supervision supporting due diligence and counterparty review",
  },
  inspections: {
    src: "/images/inspections/port-cargo-inspection-hero.png",
    alt: "Independent cargo inspection at the load port",
  },
} as const;

export const HOME_OVERVIEW_COMPANY_IMAGES = {
  team: OFFICE_HERO_IMAGES.team,
  faq: OFFICE_HERO_IMAGES.faq,
  careers: OFFICE_HERO_IMAGES.careers,
  contact: {
    src: "/images/inspections/warehouse-sack-sampling.png",
    alt: "Trade desk sampling and quality coordination at origin",
  },
} as const;
