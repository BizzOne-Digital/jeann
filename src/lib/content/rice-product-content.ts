import type { MarketingContentBox } from "@/components/marketing/MarketingStorySection";
import type { ProductMarketingExtras } from "@/lib/content/sugar-product-content";

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

export const RICE_CATEGORY = {
  eyebrow: "Rice & grains",
  title: "Long-grain and specialty rice for global importers",
  lead: "Finekarts supplies basmati, parboiled, jasmine and other rice programmes for importers, distributors, and food manufacturers. Broken percentage, moisture, and packing are confirmed per enquiry and contract.",
  products: ["Basmati rice", "Parboiled rice", "Jasmine rice"],
  disclaimer:
    "Specifications, availability, origin, and certifications are subject to the individual supply contract and destination-market requirements.",
};

const RICE_BASE = "/images/products/rice";

const RICE_PRODUCTS: Record<string, RiceProductDetail> = {
  "basmati-rice": {
    slug: "basmati-rice",
    grade: "Basmati rice",
    subtitle: "Premium long-grain basmati",
    description:
      "Premium long-grain basmati rice for importers, distributors, and retail supply chains. Aromatic, slender grains with low broken percentage — specifications confirmed per contract and Certificate of Analysis.",
    applications: [
      "Retail and wholesale distribution",
      "Food-service supply",
      "Ethnic and specialty food channels",
      "Private-label packaging programmes",
    ],
    characteristics: [
      "Long, slender grains",
      "Characteristic basmati aroma",
      "Low broken percentage per contract",
      "Sorted and milled to agreed grade",
    ],
    packaging: ["Multi-wall sacks", "FIBCs/jumbo bags", "Container liners", "25 kg and 50 kg bags"],
    highlights: [
      "Premium long-grain basmati for export",
      "Broken percentage and moisture per contract",
      "Container programmes common",
    ],
    heroImage: `${RICE_BASE}/long-grain-bag.png`,
    images: [
      {
        src: `${RICE_BASE}/long-grain-bag.png`,
        alt: "Long-grain white rice spilling from an export bag",
      },
      {
        src: `${RICE_BASE}/long-grain-pile.png`,
        alt: "Premium long-grain white rice — close-up product reference",
      },
      {
        src: `${RICE_BASE}/long-grain-scattered.png`,
        alt: "Long-grain white rice grains on dark surface",
      },
      {
        src: "/images/products/product-3.png",
        alt: "Rice and grains commodity reference",
      },
    ],
  },
  "parboiled-rice": {
    slug: "parboiled-rice",
    grade: "Parboiled rice",
    subtitle: "Parboiled long-grain rice",
    description:
      "Parboiled rice programmes for importers and food manufacturers. Partially boiled in the husk before milling, parboiled rice retains nutrients and offers firm, separate grains when cooked. Specifications confirmed per contract.",
    applications: [
      "Food manufacturing",
      "Wholesale distribution",
      "Food-service and catering",
      "Retail private-label programmes",
    ],
    characteristics: [
      "Amber to golden grain colour",
      "Firm texture when cooked",
      "Higher nutrient retention than white rice",
      "Low broken percentage per specification",
    ],
    packaging: ["Multi-wall sacks", "FIBCs/jumbo bags", "Container liners"],
    highlights: [
      "Parboiled long-grain rice for food channels",
      "Broken percentage per contract",
      "Phytosanitary documentation available",
    ],
    heroImage: `${RICE_BASE}/long-grain-pile.png`,
    images: [
      {
        src: `${RICE_BASE}/long-grain-pile.png`,
        alt: "Long-grain white rice — product reference",
      },
      {
        src: `${RICE_BASE}/long-grain-scattered.png`,
        alt: "Long-grain rice grains close-up",
      },
      {
        src: "/images/products/product-3.png",
        alt: "Rice and grains commodity reference",
      },
    ],
  },
  "jasmine-rice": {
    slug: "jasmine-rice",
    grade: "Jasmine rice",
    subtitle: "Fragrant long-grain jasmine rice",
    description:
      "Fragrant jasmine rice for importers and distributors in Asian and international food markets. Soft, slightly sticky texture and floral aroma when cooked. Broken percentage and moisture confirmed per shipment.",
    applications: [
      "Asian food retail and wholesale",
      "Restaurant and food-service supply",
      "Ethnic food distribution",
      "Private-label packaging",
    ],
    characteristics: [
      "Long-grain with floral aroma",
      "Soft texture when cooked",
      "White polished appearance",
      "Sorted milling grade per contract",
    ],
    packaging: ["Multi-wall sacks", "FIBCs/jumbo bags", "Container liners", "25 kg and 50 kg bags"],
    highlights: [
      "Fragrant jasmine rice for Asian food channels",
      "Broken percentage per contract",
      "Container-based supply programmes",
    ],
    heroImage: `${RICE_BASE}/jasmine-rice.jpg`,
    images: [
      {
        src: `${RICE_BASE}/jasmine-rice.jpg`,
        alt: "Long-grain jasmine rice grains — close-up on black background",
      },
      {
        src: `${RICE_BASE}/long-grain-scattered.png`,
        alt: "Long-grain jasmine rice grains — close-up",
      },
      {
        src: `${RICE_BASE}/long-grain-bag.png`,
        alt: "Long-grain rice in export packaging",
      },
      {
        src: `${RICE_BASE}/long-grain-pile.png`,
        alt: "Premium long-grain white rice pile",
      },
    ],
  },
};

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
