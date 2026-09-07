import type { MarketingContentBox } from "@/components/marketing/MarketingStorySection";
import type { ProductMarketingExtras } from "@/lib/content/sugar-product-content";

export type CoffeeProductDetail = {
  slug: string;
  grade: string;
  subtitle: string;
  description: string;
  applications: string[];
  characteristics: string[];
  packaging: string[];
  note?: string;
  highlights: string[];
  heroImage?: string;
  images?: { src: string; alt: string }[];
};

const COFFEE_VARIETIES = ["Arabica", "Robusta", "Liberica", "Excelsa"] as const;

const PILLARS: MarketingContentBox[] = [
  {
    title: "Quality",
    body: "Screen size, defect count, moisture, and cup profile parameters are agreed in writing before shipment. Independent inspection and pre-shipment sampling can be appointed to match your contract.",
  },
  {
    title: "Safety",
    body: "Food-grade handling, sealed bags and liners, and documented chain of custody reduce contamination risk. Phytosanitary and origin certificates are prepared for the agreed destination.",
  },
  {
    title: "Punctuality",
    body: "Loading windows, container nominations, and document presentation dates are coordinated with your banking and logistics teams so cargo and paperwork arrive on schedule.",
  },
];

export const COFFEE_CATEGORY = {
  eyebrow: "Coffee",
  title: "Green and roasted dry coffee programmes",
  lead:
    "Finekarts supplies green coffee and roasted dry coffee for qualified roasters, traders, and distributors. Programmes can be structured across Arabica, Robusta, Liberica, and Excelsa — with origin, screen size, defect count, and cup characteristics confirmed per enquiry and contract.",
  varieties: [...COFFEE_VARIETIES],
  products: ["Green coffee", "Dry coffee", "Roasted dry coffee"],
  disclaimer:
    "Crop year, origin, organic or fair-trade claims, and cupping scores are stated only when verified for the specific supply contract.",
};

const COFFEE_PRODUCTS: Record<string, CoffeeProductDetail> = {
  "green-coffee-beans": {
    slug: "green-coffee-beans",
    grade: "Green coffee",
    subtitle: "Unroasted green coffee — Arabica, Robusta, Liberica, and Excelsa",
    description:
      "Green coffee programmes for roasters, traders, and distributors. Arabica, Robusta, Liberica, and Excelsa grades can be quoted subject to origin and availability. Screen size, defect count, and moisture are confirmed per contract.",
    applications: [
      "Roasting and specialty coffee",
      "Commercial blending",
      "Wholesale green coffee trade",
      "Export and import programmes",
    ],
    characteristics: [
      "Arabica, Robusta, Liberica, and Excelsa subject to contract",
      "Screen size and defect count per specification",
      "Crop year and origin traceability when verified",
      "Bagged and bulk container programmes",
    ],
    packaging: ["Multi-wall sacks", "FIBCs/jumbo bags", "GrainPro or similar liners where agreed"],
    note: "Origin, species, grade, and cupping scores are only stated when verified for the specific supply contract.",
    highlights: [
      "Green coffee across major species",
      "Screen size and defect count per contract",
      "Origin traceability when verified",
    ],
    heroImage: "/images/products/coffee/green-coffee-cherries.png",
    images: [
      {
        src: "/images/products/coffee/green-coffee-cherries.png",
        alt: "Coffee cherries on the branch — green, Arabica, Robusta, Liberica, and Excelsa subject to contract",
      },
      {
        src: "/images/products/coffee/green-coffee-beans.png",
        alt: "Green unroasted coffee beans close-up",
      },
      {
        src: "/images/products/coffee/fresh-coffee-harvest.png",
        alt: "Fresh coffee cherries harvested at the farm",
      },
    ],
  },
  "dry-coffee-beans": {
    slug: "dry-coffee-beans",
    grade: "Dry coffee",
    subtitle: "Dried coffee beans for export — Arabica, Robusta, Liberica, and Excelsa",
    description:
      "Dry coffee programmes for traders and roasters sourcing export-ready beans. Arabica, Robusta, Liberica, and Excelsa can be quoted subject to origin. Drying level, moisture, screen size, and defect counts are confirmed per contract and Certificate of Analysis where agreed.",
    applications: [
      "Roasting programmes",
      "Green coffee trading",
      "Blending and export",
      "Wholesale distribution",
    ],
    characteristics: [
      "Dried, export-ready beans",
      "Arabica, Robusta, Liberica, and Excelsa subject to contract",
      "Moisture and screen size per specification",
      "Sack and container export programmes",
    ],
    packaging: ["Multi-wall sacks", "FIBCs/jumbo bags", "GrainPro or similar liners where agreed"],
    highlights: [
      "Dry coffee for qualified buyers",
      "Multiple species subject to contract",
      "Container programmes common",
    ],
    heroImage: "/images/products/coffee/dry-coffee-beans.png",
    images: [
      {
        src: "/images/products/coffee/dry-coffee-beans.png",
        alt: "Dry coffee cherries in a woven tray after sun drying",
      },
    ],
  },
  "roasted-arabica-coffee-beans": {
    slug: "roasted-arabica-coffee-beans",
    grade: "Roasted dry coffee",
    subtitle: "Roasted dry coffee — Arabica, Robusta, Liberica, and Excelsa",
    description:
      "Roasted dry coffee programmes for distributors, roasters, and food manufacturers. Arabica, Robusta, Liberica, and Excelsa roast profiles can be quoted subject to origin and specification. Roast level, whole bean or ground format, and packaging are confirmed per contract.",
    applications: [
      "Retail and food-service distribution",
      "Private-label roasting programmes",
      "Beverage and café supply",
      "Wholesale roasted coffee trade",
    ],
    characteristics: [
      "Arabica, Robusta, Liberica, and Excelsa roast profiles subject to contract",
      "Whole bean or ground formats",
      "Vacuum and nitrogen-flushed packaging options",
      "Shelf-life and moisture per specification",
    ],
    packaging: ["Cartons", "Vacuum bags", "Multi-wall sacks", "Retail-ready packs where agreed"],
    note: "Roast profile, species, origin, and organic claims are only stated when verified for the specific supply contract.",
    highlights: [
      "Roasted dry coffee for distribution channels",
      "Roast level and format per contract",
      "Export carton programmes available",
    ],
    heroImage: "/images/products/coffee/roasted-robusta-coffee-beans.png",
    images: [
      {
        src: "/images/products/coffee/roasted-robusta-coffee-beans.png",
        alt: "Roasted Robusta coffee beans in a tin",
      },
      {
        src: "/images/products/coffee/roasted-arabica-coffee-beans.png",
        alt: "Roasted dry coffee beans close-up",
      },
    ],
  },
};

export function getCoffeeProductDetail(slug: string): CoffeeProductDetail | null {
  return COFFEE_PRODUCTS[slug] ?? null;
}

export function getCoffeeProductMarketing(slug: string): ProductMarketingExtras | null {
  const product = COFFEE_PRODUCTS[slug];
  if (!product) return null;
  return {
    description: product.description,
    contentBoxes: PILLARS,
    highlights: product.highlights,
  };
}

export function isCoffeeCategory(slug: string): boolean {
  return slug === "coffee";
}
