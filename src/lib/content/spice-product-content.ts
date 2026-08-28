import type { MarketingContentBox } from "@/components/marketing/MarketingStorySection";
import type { ProductMarketingExtras } from "@/lib/content/sugar-product-content";

export type SpiceProductDetail = {
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
    body: "Grade, moisture, foreign matter, and purity parameters are agreed in writing before shipment. Independent inspection and laboratory certificates can be appointed to match your contract.",
  },
  {
    title: "Safety",
    body: "Food-grade handling, sealed bags and cartons, and documented chain of custody reduce contamination risk. Phytosanitary and health certificates are prepared for the agreed destination.",
  },
  {
    title: "Punctuality",
    body: "Loading windows, container nominations, and document presentation dates are coordinated with your banking and logistics teams so cargo and paperwork arrive on schedule.",
  },
];

export const SPICES_CATEGORY = {
  eyebrow: "Coffee, nuts & spices",
  title: "Coffee, cashews, cinnamon, pepper and specialty spices",
  lead: "Finekarts supplies green coffee, cashew kernels, cinnamon sticks, black pepper and other spices for qualified wholesalers, distributors, and food manufacturers. Grades, origins, and certifications are confirmed per enquiry and contract.",
  products: [
    "Coffee beans",
    "Cashews",
    "Cinnamon sticks",
    "Black pepper",
    "Turmeric",
    "Cloves",
    "Cardamom",
    "Nutmeg",
  ],
  disclaimer:
    "Specifications, availability, origin, and organic or fair-trade claims are subject to the individual supply contract and destination-market requirements.",
};

const SPICE_PRODUCTS: Record<string, SpiceProductDetail> = {
  "coffee-beans": {
    slug: "coffee-beans",
    grade: "Coffee beans",
    subtitle: "Fresh harvest and green coffee beans",
    description:
      "Green coffee bean programmes for roasters, traders, and distributors. From cherry harvest through dried green bean supply, origin, screen size, and defect counts are confirmed per contract.",
    applications: [
      "Roasting and specialty coffee",
      "Commercial blending",
      "Wholesale green coffee trade",
      "Export and import programmes",
    ],
    characteristics: [
      "Arabica and Robusta grades subject to contract",
      "Screen size and defect count per specification",
      "Crop year and origin traceability",
      "Bagged and bulk container programmes",
    ],
    packaging: ["Multi-wall sacks", "FIBCs/jumbo bags", "GrainPro or similar liners where agreed"],
    note: "Origin, grade, and cupping scores are only stated when verified for the specific supply contract.",
    highlights: [
      "Green coffee from harvest to export",
      "Screen size and defect count per contract",
      "Origin traceability when verified",
    ],
    heroImage: "/images/products/coffee/fresh-coffee-harvest.png",
    images: [
      {
        src: "/images/products/coffee/fresh-coffee-harvest.png",
        alt: "Fresh coffee cherries harvested at the farm",
      },
      {
        src: "/images/products/coffee/fresh-coffee-branch.png",
        alt: "Ripe yellow coffee cherries on the branch",
      },
      {
        src: "/images/products/coffee/green-coffee-beans.png",
        alt: "Green coffee beans — dried, unroasted product",
      },
    ],
  },
  cashews: {
    slug: "cashews",
    grade: "Cashews",
    subtitle: "Raw and processed cashew kernels",
    description:
      "Cashew kernel programmes for distributors, roasters, and food manufacturers. Count, moisture, broken percentage, and grade (W180, W240, W320, etc.) are confirmed per contract and Certificate of Analysis.",
    applications: [
      "Snack and retail distribution",
      "Food manufacturing",
      "Confectionery and bakery",
      "Wholesale and food-service supply",
    ],
    characteristics: [
      "Whole and broken grades per specification",
      "Roasted or raw subject to contract",
      "Vacuum flexi or cartons for export",
      "Low moisture and foreign matter",
    ],
    packaging: ["Cartons", "Vacuum flexi bags", "Multi-wall sacks", "FIBCs/jumbo bags"],
    highlights: [
      "Cashew kernels for food and snack channels",
      "Count and grade per contract",
      "Health and phytosanitary documentation available",
    ],
    heroImage: "/images/products/product-5.png",
    images: [
      {
        src: "/images/products/product-5.png",
        alt: "Cashews and nuts commodity reference",
      },
    ],
  },
  "cinnamon-sticks": {
    slug: "cinnamon-sticks",
    grade: "Cinnamon sticks",
    subtitle: "Whole cinnamon quills and sticks",
    description:
      "Cinnamon stick programmes for spice traders, food manufacturers, and distributors. Length, diameter, oil content, and moisture are confirmed per contract. Ceylon and cassia grades subject to origin and buyer specification.",
    applications: [
      "Spice blending and grinding",
      "Food manufacturing",
      "Beverage and flavour industries",
      "Wholesale spice distribution",
    ],
    characteristics: [
      "Whole quills and cut sticks",
      "Ceylon or cassia grades per contract",
      "Moisture and oil content per specification",
      "Export cartons and gunny bags",
    ],
    packaging: ["Cartons", "Multi-wall sacks", "Gunny bags"],
    highlights: [
      "Whole cinnamon sticks for spice trade",
      "Grade and origin confirmed per RFQ",
      "Phytosanitary documentation available",
    ],
    heroImage: "/images/products/product-5.png",
    images: [
      {
        src: "/images/products/product-5.png",
        alt: "Cinnamon sticks and spices commodity reference",
      },
    ],
  },
  "black-pepper": {
    slug: "black-pepper",
    grade: "Black pepper",
    subtitle: "Whole black peppercorns",
    description:
      "Black pepper programmes for spice traders, food manufacturers, and distributors. Density, moisture, foreign matter, and piperine content are confirmed per contract where laboratory testing is agreed.",
    applications: [
      "Spice grinding and blending",
      "Food manufacturing",
      "Meat processing and seasoning",
      "Wholesale spice distribution",
    ],
    characteristics: [
      "Whole black peppercorns",
      "FAQ and higher grades subject to contract",
      "Low moisture and foreign matter",
      "Bulk bags and cartons for export",
    ],
    packaging: ["Multi-wall sacks", "Cartons", "FIBCs/jumbo bags"],
    highlights: [
      "Whole black pepper for spice channels",
      "Density and moisture per contract",
      "Independent inspection available",
    ],
    heroImage: "/images/products/product-5.png",
    images: [
      {
        src: "/images/products/product-5.png",
        alt: "Black pepper and spices commodity reference",
      },
    ],
  },
  turmeric: {
    slug: "turmeric",
    grade: "Turmeric",
    subtitle: "Dry turmeric fingers and powder grades",
    description:
      "Turmeric programmes for spice traders and food manufacturers. Curcumin content, colour, moisture, and foreign matter are confirmed per contract when laboratory testing is agreed.",
    applications: [
      "Spice grinding and blending",
      "Food colouring and flavour",
      "Pharmaceutical and nutraceutical where contractually agreed",
      "Wholesale distribution",
    ],
    characteristics: [
      "Whole fingers or ground subject to contract",
      "Curcumin specification where tested",
      "Sorted export grades",
      "Bulk sack and carton programmes",
    ],
    packaging: ["Multi-wall sacks", "Cartons", "FIBCs/jumbo bags"],
    highlights: [
      "Turmeric for spice and food channels",
      "Grade and curcumin per contract",
      "Container programmes common",
    ],
    heroImage: "/images/products/product-5.png",
    images: [
      {
        src: "/images/products/product-5.png",
        alt: "Turmeric and spices commodity reference",
      },
    ],
  },
  cloves: {
    slug: "cloves",
    grade: "Cloves",
    subtitle: "Whole dried cloves",
    description:
      "Clove programmes for spice traders and food manufacturers. Oil content, moisture, stem percentage, and foreign matter are confirmed per contract.",
    applications: [
      "Spice blending",
      "Food and beverage flavouring",
      "Cigarette and industrial uses where contractually agreed",
      "Wholesale distribution",
    ],
    characteristics: [
      "Whole dried flower buds",
      "Sorted export grades",
      "Low moisture",
      "Carton and sack export programmes",
    ],
    packaging: ["Cartons", "Multi-wall sacks"],
    highlights: [
      "Whole cloves for spice trade",
      "Oil content per specification",
      "Phytosanitary documentation available",
    ],
    heroImage: "/images/products/product-5.png",
    images: [
      {
        src: "/images/products/product-5.png",
        alt: "Cloves and spices commodity reference",
      },
    ],
  },
  cardamom: {
    slug: "cardamom",
    grade: "Cardamom",
    subtitle: "Green cardamom pods",
    description:
      "Green cardamom programmes for spice traders and food manufacturers. Size, colour, moisture, and foreign matter are confirmed per contract.",
    applications: [
      "Spice blending and grinding",
      "Food and beverage flavouring",
      "Confectionery",
      "Wholesale spice distribution",
    ],
    characteristics: [
      "Whole green pods",
      "Bold and extra-bold grades subject to contract",
      "Low moisture",
      "Carton export programmes",
    ],
    packaging: ["Cartons", "Multi-wall sacks"],
    highlights: [
      "Green cardamom for spice channels",
      "Size grade per contract",
      "Independent inspection available",
    ],
    heroImage: "/images/products/product-5.png",
    images: [
      {
        src: "/images/products/product-5.png",
        alt: "Cardamom and spices commodity reference",
      },
    ],
  },
  nutmeg: {
    slug: "nutmeg",
    grade: "Nutmeg",
    subtitle: "Whole nutmeg and mace",
    description:
      "Nutmeg and mace programmes for spice traders and food manufacturers. Oil content, moisture, and foreign matter are confirmed per contract.",
    applications: [
      "Spice grinding and blending",
      "Food and beverage flavouring",
      "Bakery and confectionery",
      "Wholesale distribution",
    ],
    characteristics: [
      "Whole nutmeg seeds",
      "Mace blades where contractually agreed",
      "Sorted export grades",
      "Carton and sack programmes",
    ],
    packaging: ["Cartons", "Multi-wall sacks"],
    highlights: [
      "Nutmeg for spice and food channels",
      "Oil content per specification",
      "Phytosanitary documentation available",
    ],
    heroImage: "/images/products/product-5.png",
    images: [
      {
        src: "/images/products/product-5.png",
        alt: "Nutmeg and spices commodity reference",
      },
    ],
  },
};

export function getSpiceProductDetail(slug: string): SpiceProductDetail | null {
  return SPICE_PRODUCTS[slug] ?? null;
}

export function getSpiceProductMarketing(slug: string): ProductMarketingExtras | null {
  const product = SPICE_PRODUCTS[slug];
  if (!product) return null;
  return {
    description: product.description,
    contentBoxes: PILLARS,
    highlights: product.highlights,
  };
}

export function isSpicesCategory(slug: string): boolean {
  return slug === "other-commodities";
}
