import type { MarketingContentBox } from "@/components/marketing/MarketingStorySection";
import type { ProductMarketingExtras } from "@/lib/content/sugar-product-content";
import {
  RICE_CATALOG,
  RICE_SUBCATEGORIES,
  riceProductImage,
  specsToCharacteristics,
  type RiceCatalogRow,
  type RiceSubcategoryId,
} from "@/lib/content/rice-catalog";

export type RiceProductDetail = {
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
  subcategory: RiceSubcategoryId;
  specs: { label: string; value: string }[];
  origin?: string;
};

const PILLARS: MarketingContentBox[] = [
  {
    title: "Quality",
    body: "Broken percentage, moisture, foreign matter, and milling grade are agreed in writing before shipment. Independent inspection and laboratory certificates can be appointed to match your contract.",
  },
  {
    title: "Safety",
    body: "Food-grade handling, sealed bags and liners, and documented chain of custody reduce contamination risk. Phytosanitary and weight certificates are prepared for the agreed destination.",
  },
  {
    title: "Punctuality",
    body: "Loading windows, container nominations, and document presentation dates are coordinated with your banking and logistics teams so cargo and paperwork arrive on schedule.",
  },
];

const DEFAULT_PACKAGING = ["Multi-wall sacks", "FIBCs/jumbo bags", "Container liners", "25 kg and 50 kg bags"];

const SUBCATEGORY_APPLICATIONS: Record<RiceSubcategoryId, string[]> = {
  "long-grain": [
    "Retail and wholesale distribution",
    "Food-service and catering supply",
    "Food manufacturing and blending",
    "Private-label packaging programmes",
  ],
  parboiled: [
    "Food manufacturing",
    "Wholesale and institutional supply",
    "Retail private-label programmes",
    "Export container programmes",
  ],
  basmati: [
    "Ethnic and specialty food retail",
    "Premium grocery and wholesale",
    "Restaurant and food-service supply",
    "Export and re-export programmes",
  ],
};

function buildRiceProduct(row: RiceCatalogRow): RiceProductDetail {
  const image = riceProductImage(row.slug);
  const characteristics = specsToCharacteristics(row.specs, row.origin);

  return {
    slug: row.slug,
    grade: row.name,
    subtitle: row.subtitle,
    description: `${row.name} for qualified international buyers. Illustrative milling parameters are shown below — broken percentage, moisture, foreign matter, and grain dimensions are confirmed per contract and Certificate of Analysis.`,
    applications: SUBCATEGORY_APPLICATIONS[row.subcategory],
    characteristics,
    packaging: DEFAULT_PACKAGING,
    note: "Specifications on this page are illustrative. Contract terms, origin, and certifications supersede website content.",
    highlights: [
      row.subtitle,
      ...row.specs.slice(0, 2).map((s) => `${s.label}: ${s.value}`),
      row.origin ? `Origin: ${row.origin}` : "Origin confirmed per enquiry",
    ],
    heroImage: image,
    images: [{ src: image, alt: `${row.name} — product reference` }],
    subcategory: row.subcategory,
    specs: row.specs,
    origin: row.origin,
  };
}

const RICE_PRODUCTS: Record<string, RiceProductDetail> = Object.fromEntries(
  RICE_CATALOG.map((row) => [row.slug, buildRiceProduct(row)]),
);

export const RICE_CATEGORY = {
  eyebrow: "Rice & grains",
  title: "Long-grain, parboiled, and basmati rice programmes",
  lead: "Finekarts supplies long-grain white, jasmine, parboiled, and basmati lines for importers, distributors, and food manufacturers. Browse by grade below — broken percentage, moisture, and packing are confirmed per enquiry and contract.",
  products: Object.values(RICE_SUBCATEGORIES).map((s) => s.title),
  disclaimer:
    "Specifications, availability, origin, and certifications are subject to the individual supply contract and destination-market requirements.",
};

export { RICE_SUBCATEGORIES };

export function getRiceProductDetail(slug: string): RiceProductDetail | null {
  return RICE_PRODUCTS[slug] ?? null;
}

export function getRiceProductMarketing(slug: string): ProductMarketingExtras | null {
  const product = RICE_PRODUCTS[slug];
  if (!product) return null;
  return {
    description: product.description,
    contentBoxes: PILLARS,
    highlights: product.highlights,
  };
}

export function isRiceCategory(slug: string): boolean {
  return slug === "rice-and-grains";
}

export function getAllRiceProducts(): RiceProductDetail[] {
  return RICE_CATALOG.map((row) => RICE_PRODUCTS[row.slug]).filter(Boolean);
}
