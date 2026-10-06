import { AGRICULTURE_IMAGES } from "@/lib/content/agriculture-images";
import { LOGISTICS_IMAGES } from "@/lib/content/logistics-images";
import { OFFICE_HERO_IMAGES } from "@/lib/content/office-hero-images";
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
  | "careers"
  | "testimonials"
  | "booking"
  | "partners"
  | "inspections"
  | "verification"
  | "logistics"
  | "packaging"
  | "buyerTerms"
  | "cookies"
  | "buyerRequest"
  | "supplierOffer"
  | "disputeResolution";

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
  about: OFFICE_HERO_IMAGES.about,
  products: AGRICULTURE_IMAGES.greenGrainField,
  resources: AGRICULTURE_IMAGES.resourcesHero,
  contact: {
    src: "/images/hero-reference.png",
    alt: "Finekarts trade desk and buyer enquiry support",
  },
  insights: {
    src: "/images/insights/market-insights-hero.jpg",
    alt: "Trade professionals reviewing global market data and commodity insights in a boardroom",
  },
  faq: OFFICE_HERO_IMAGES.faq,
  team: OFFICE_HERO_IMAGES.team,
  careers: OFFICE_HERO_IMAGES.careers,
  testimonials: OFFICE_HERO_IMAGES.testimonials,
  booking: {
    src: "/images/packaging/bags-50kg.png",
    alt: "Packaged commodity units for structured booking enquiries",
  },
  partners: {
    src: "/images/partners/hero-verification-partners.jpg",
    alt: "Grain train beside export silos at a river terminal — verification partners and bulk trade corridors",
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
  buyerTerms: {
    src: "/images/packaging/bulk-railcar.jpg",
    alt: "Covered hopper railcars for dry bulk export programmes",
  },
  cookies: {
    src: "/images/packaging/pp-woven-bags.png",
    alt: "Polypropylene woven sacks for export commodity packaging",
  },
  buyerRequest: {
    src: "/images/products/sugar/icumsa-45-50kg-bags.png",
    alt: "Fifty-kilogram export sugar bags for bulk purchase requests",
  },
  supplierOffer: {
    src: "/images/packaging/bulk-truck-field.png",
    alt: "Bulk truck loading at an agricultural elevator for supplier programmes",
  },
  disputeResolution: {
    src: "/images/packaging/tanker-vessel.png",
    alt: "Rail bulk corridor documentation for trade dispute review",
  },
};

export function getPageHeroImage(key: PageHeroImageKey): PageHeroImage {
  return PAGE_HERO_IMAGES[key];
}
