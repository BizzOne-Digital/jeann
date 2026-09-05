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
  title: "Green, dry, and roasted Arabica coffee programmes",
  lead: "Finekarts supplies green coffee, dried Arabica beans, and roasted Arabica coffee for qualified roasters, traders, and distributors. Origin, screen size, defect count, and cup characteristics are confirmed per enquiry and contract.",
  products: ["Green coffee beans", "Dry coffee beans", "Roasted Arabica coffee beans"],
  disclaimer:
    "Crop year, origin, organic or fair-trade claims, and cupping scores are stated only when verified for the specific supply contract.",
};

const COFFEE_PRODUCTS: Record<string, CoffeeProductDetail> = {
  "green-coffee-beans": {
    slug: "green-coffee-beans",
    grade: "Green coffee beans",
    subtitle: "Unroasted green Arabica and related grades",
    description:
      "Green coffee bean programmes for roasters, traders, and distributors. Origin, screen size, defect count, and moisture are confirmed per contract. From harvest through export-ready green bean supply.",
    applications: [
      "Roasting and specialty coffee",
      "Commercial blending",
      "Wholesale green coffee trade",
      "Export and import programmes",
    ],
    characteristics: [
      "Arabica grades subject to contract",
      "Screen size and defect count per specification",
      "Crop year and origin traceability when verified",
      "Bagged and bulk container programmes",
    ],
    packaging: ["Multi-wall sacks", "FIBCs/jumbo bags", "GrainPro or similar liners where agreed"],
    note: "Origin, grade, and cupping scores are only stated when verified for the specific supply contract.",
    highlights: [
      "Green coffee for roasters and traders",
      "Screen size and defect count per contract",
      "Origin traceability when verified",
    ],
    heroImage: "/images/products/coffee/green-coffee-beans.png",
    images: [
      {
        src: "/images/products/coffee/green-coffee-beans.png",
        alt: "Green unroasted coffee beans close-up",
      },
      {
        src: "/images/products/coffee/fresh-coffee-harvest.png",
        alt: "Fresh coffee cherries harvested at the farm",
      },
      {
        src: "/images/products/coffee/fresh-coffee-branch.png",
        alt: "Ripe coffee cherries on the branch",
      },
    ],
  },
  "dry-coffee-beans": {
    slug: "dry-coffee-beans",
    grade: "Dry coffee beans",
    subtitle: "Dried Arabica coffee beans for export",
    description:
      "Dried coffee bean programmes for traders and roasters sourcing export-ready Arabica. Drying level, moisture, screen size, and defect counts are confirmed per contract and Certificate of Analysis where agreed.",
    applications: [
      "Roasting programmes",
      "Green coffee trading",
      "Blending and export",
      "Wholesale distribution",
    ],
    characteristics: [
      "Dried, export-ready beans",
      "Moisture and screen size per specification",
      "Arabica-focused grades subject to contract",
      "Sack and container export programmes",
    ],
    packaging: ["Multi-wall sacks", "FIBCs/jumbo bags", "GrainPro or similar liners where agreed"],
    highlights: [
      "Dried Arabica for qualified buyers",
      "Moisture and screen size per contract",
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
    grade: "Roasted Arabica coffee beans",
    subtitle: "Roasted Arabica coffee for food and beverage channels",
    description:
      "Roasted Arabica coffee programmes for distributors, roasters, and food manufacturers. Roast level, origin, grind or whole bean format, and packaging are confirmed per contract.",
    applications: [
      "Retail and food-service distribution",
      "Private-label roasting programmes",
      "Beverage and café supply",
      "Wholesale roasted coffee trade",
    ],
    characteristics: [
      "Arabica-focused roast profiles subject to contract",
      "Whole bean or ground formats",
      "Vacuum and nitrogen-flushed packaging options",
      "Shelf-life and moisture per specification",
    ],
    packaging: ["Cartons", "Vacuum bags", "Multi-wall sacks", "Retail-ready packs where agreed"],
    note: "Roast profile, origin, and organic claims are only stated when verified for the specific supply contract.",
    highlights: [
      "Roasted Arabica for distribution channels",
      "Roast level and format per contract",
      "Export carton programmes available",
    ],
    heroImage: "/images/products/coffee/roasted-arabica-coffee-beans.png",
    images: [
      {
        src: "/images/products/coffee/roasted-arabica-coffee-beans.png",
        alt: "Roasted Arabica coffee beans over a coffee plantation",
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
