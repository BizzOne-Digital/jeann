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

const RICE_BASE = "/images/products/rice";

const DEFAULT_PACKAGING = ["Multi-wall sacks", "FIBCs/jumbo bags", "Container liners", "25 kg and 50 kg bags"];

const DEFAULT_APPLICATIONS = [
  "Wholesale and retail distribution",
  "Food-service and restaurant supply",
  "International importers and distributors",
  "Bulk commercial programmes",
];

function riceImages(hero: string, alt: string): { src: string; alt: string }[] {
  return [
    { src: hero, alt },
    { src: `${RICE_BASE}/long-grain-pile.png`, alt: "Long-grain rice — product reference" },
    { src: `${RICE_BASE}/long-grain-scattered.png`, alt: "Long-grain rice grains close-up" },
  ];
}

/** Set when the client-approved rice overview video is published on YouTube. */
export const RICE_YOUTUBE_VIDEO_ID: string | undefined = undefined;

export const RICE_VIDEO_INTRO =
  "In this video, we showcase our range of premium rice products available for wholesale, bulk, import, export, foodservice, distributors, wholesalers, and commercial buyers worldwide.";

export const RICE_OVERVIEW_IMAGE = {
  src: `${RICE_BASE}/jasmine-rice.jpg`,
  alt: "Premium long-grain jasmine rice — reference for international wholesale supply",
};

export const RICE_CATEGORY = {
  eyebrow: "Rice & grains",
  heroBrand: "Finekarts Incorporated",
  title: "Premium rice products",
  lead:
    "Welcome to Finekarts Incorporated, your trusted partner for sourcing and international supply of quality rice and agricultural commodities.",
  products: [
    "Basmati rice",
    "1121 Basmati rice",
    "1121 Sella / Parboiled Basmati rice",
    "Long grain white rice",
    "Jasmine rice",
    "Parboiled rice",
    "Japonica rice",
  ],
  disclaimer:
    "Specifications, availability, origin, and certifications are subject to the individual supply contract and destination-market requirements.",
};

export const RICE_BULK_SUPPLY = {
  title: "Bulk & international supply",
  lead:
    "Finekarts Incorporated works with suppliers and commercial partners to provide rice for bulk and wholesale requirements, with supply options tailored to destination, quantity, packaging, specifications, and delivery terms.",
  incoterms:
    "Available commercial terms may include FOB, CFR, CIF, DAP, and other mutually agreed Incoterms® 2020 terms.",
};

export const RICE_PACKAGING = {
  title: "Packaging options",
  lead:
    "Bulk bags, woven polypropylene bags, consumer-size packaging, and other packaging formats subject to product and buyer requirements.",
};

export const RICE_SPECIFICATIONS = {
  title: "Specifications",
  lead:
    "Rice specifications can be provided according to the required grade, grain length, broken percentage, moisture, foreign matter, milling quality, crop year, origin, and applicable destination-market requirements.",
};

export const RICE_MARKETS = [
  "North America",
  "Caribbean",
  "South America",
  "Europe",
  "Middle East",
  "Africa",
  "Asia",
] as const;

export const RICE_BUYER_NOTE =
  "Whether you are a rice importer, wholesaler, distributor, food manufacturer, restaurant supplier, supermarket, or institutional buyer, Finekarts Incorporated can assist with sourcing and commercial supply requirements.";

export const RICE_CONTACT = {
  title: "Contact Finekarts Incorporated for rice supply & bulk inquiries",
  tagline: "International trading · Agricultural commodities · Food products · Global sourcing",
};

export const RICE_QUALITY_PILLARS = PILLARS;

export const RICE_SPOTLIGHT_SLUGS = [
  "basmati-rice",
  "1121-basmati-rice",
  "1121-sella-parboiled-basmati-rice",
  "long-grain-white-rice",
  "jasmine-rice",
  "parboiled-rice",
  "japonica-rice",
] as const;

const RICE_PRODUCTS: Record<string, RiceProductDetail> = {
  "basmati-rice": {
    slug: "basmati-rice",
    grade: "Basmati rice",
    subtitle: "Premium long-grain Basmati",
    description:
      "Premium long-grain Basmati rice known for its distinctive aroma, delicate flavor, long grains, and excellent cooking characteristics. Available in different grades and specifications for qualified international buyers.",
    applications: DEFAULT_APPLICATIONS,
    characteristics: [
      "Distinctive Basmati aroma",
      "Long, slender grains",
      "Delicate flavor profile",
      "Grades and specifications per contract",
    ],
    packaging: DEFAULT_PACKAGING,
    highlights: [
      "Premium Basmati for export programmes",
      "Multiple grades subject to contract",
      "Broken percentage and moisture per specification",
    ],
    heroImage: `${RICE_BASE}/long-grain-bag.png`,
    images: riceImages(`${RICE_BASE}/long-grain-bag.png`, "Premium Basmati rice in export packaging"),
  },
  "1121-basmati-rice": {
    slug: "1121-basmati-rice",
    grade: "1121 Basmati rice",
    subtitle: "Extra-long grain Basmati",
    description:
      "Extra-long grain Basmati rice suitable for premium food markets, restaurants, wholesalers, distributors, and international buyers. Grain length, aroma, and milling grade are confirmed per contract.",
    applications: [
      "Premium retail and wholesale channels",
      "Restaurant and food-service supply",
      "International distributors",
      "High-end ethnic food markets",
    ],
    characteristics: [
      "Extra-long grain length",
      "Characteristic Basmati aroma",
      "Premium milling grades",
      "Export sorting per specification",
    ],
    packaging: DEFAULT_PACKAGING,
    highlights: [
      "1121 Basmati for premium markets",
      "Extra-long grain programmes",
      "Container supply available",
    ],
    heroImage: `${RICE_BASE}/long-grain-pile.png`,
    images: riceImages(`${RICE_BASE}/long-grain-pile.png`, "1121 Basmati rice — extra-long grain reference"),
  },
  "1121-sella-parboiled-basmati-rice": {
    slug: "1121-sella-parboiled-basmati-rice",
    grade: "1121 Sella / Parboiled Basmati rice",
    subtitle: "Parboiled Basmati with grain integrity",
    description:
      "Parboiled Basmati rice processed to help maintain grain integrity, producing long, separate grains after cooking. Suitable for premium foodservice, wholesale, and international distribution channels.",
    applications: [
      "Premium food-service supply",
      "Wholesale and distributor programmes",
      "Restaurant and catering channels",
      "International bulk buyers",
    ],
    characteristics: [
      "Parboiled (Sella) processing",
      "Long, separate grains when cooked",
      "Firm grain integrity",
      "Amber to golden appearance",
    ],
    packaging: DEFAULT_PACKAGING,
    highlights: [
      "1121 Sella Basmati programmes",
      "Parboiled grain integrity",
      "Specifications per contract",
    ],
    heroImage: `${RICE_BASE}/long-grain-scattered.png`,
    images: riceImages(
      `${RICE_BASE}/long-grain-scattered.png`,
      "1121 Sella parboiled Basmati rice grains",
    ),
  },
  "long-grain-white-rice": {
    slug: "long-grain-white-rice",
    grade: "Long grain white rice",
    subtitle: "High-quality long-grain white rice",
    description:
      "High-quality long-grain white rice suitable for retail, foodservice, restaurants, wholesalers, and institutional buyers. Milling grade, broken percentage, and moisture are confirmed per shipment.",
    applications: [
      "Retail and supermarket supply",
      "Food-service and institutional catering",
      "Wholesale distribution",
      "Private-label packaging programmes",
    ],
    characteristics: [
      "Polished long-grain appearance",
      "Consistent milling grade",
      "Low broken percentage per contract",
      "Suitable for diverse cooking applications",
    ],
    packaging: DEFAULT_PACKAGING,
    highlights: [
      "Long-grain white rice for broad food channels",
      "Retail and foodservice programmes",
      "Container-based supply",
    ],
    heroImage: `${RICE_BASE}/long-grain-bag.png`,
    images: riceImages(`${RICE_BASE}/long-grain-bag.png`, "Long grain white rice in export bags"),
  },
  "jasmine-rice": {
    slug: "jasmine-rice",
    grade: "Jasmine rice",
    subtitle: "Fragrant long-grain jasmine rice",
    description:
      "Fragrant long-grain rice with a naturally aromatic character and soft texture when cooked. Available for international wholesale supply to qualified importers and distributors.",
    applications: [
      "Asian food retail and wholesale",
      "Restaurant and food-service supply",
      "Ethnic food distribution",
      "International wholesale programmes",
    ],
    characteristics: [
      "Natural floral aroma",
      "Soft texture when cooked",
      "Long-grain polished appearance",
      "Sorted milling grade per contract",
    ],
    packaging: DEFAULT_PACKAGING,
    highlights: [
      "Fragrant jasmine rice for Asian food channels",
      "International wholesale supply",
      "Broken percentage per contract",
    ],
    heroImage: `${RICE_BASE}/jasmine-rice.jpg`,
    images: [
      {
        src: `${RICE_BASE}/jasmine-rice.jpg`,
        alt: "Long-grain jasmine rice grains — close-up",
      },
      {
        src: `${RICE_BASE}/long-grain-scattered.png`,
        alt: "Jasmine rice grains close-up",
      },
      {
        src: `${RICE_BASE}/long-grain-bag.png`,
        alt: "Long-grain rice in export packaging",
      },
    ],
  },
  "parboiled-rice": {
    slug: "parboiled-rice",
    grade: "Parboiled rice",
    subtitle: "Firm-grain parboiled rice",
    description:
      "Parboiled rice offering firm grains and excellent cooking performance, suitable for foodservice, distributors, and bulk commercial applications. Specifications confirmed per contract and Certificate of Analysis where agreed.",
    applications: [
      "Food manufacturing",
      "Wholesale distribution",
      "Food-service and catering",
      "Bulk commercial programmes",
    ],
    characteristics: [
      "Firm texture when cooked",
      "Amber to golden grain colour",
      "Higher nutrient retention than white rice",
      "Low broken percentage per specification",
    ],
    packaging: DEFAULT_PACKAGING,
    highlights: [
      "Parboiled rice for food channels",
      "Bulk commercial applications",
      "Phytosanitary documentation available",
    ],
    heroImage: `${RICE_BASE}/long-grain-pile.png`,
    images: riceImages(`${RICE_BASE}/long-grain-pile.png`, "Parboiled long-grain rice reference"),
  },
  "japonica-rice": {
    slug: "japonica-rice",
    grade: "Japonica rice",
    subtitle: "Short- to medium-grain Japonica rice",
    description:
      "Short- to medium-grain rice with a softer, more cohesive texture, suitable for specific culinary applications and international markets. Milling grade and moisture are confirmed per contract.",
    applications: [
      "Asian cuisine and specialty food channels",
      "Restaurant and food-service supply",
      "Wholesale distribution",
      "International market programmes",
    ],
    characteristics: [
      "Short- to medium-grain profile",
      "Softer, more cohesive cooked texture",
      "Polished white appearance",
      "Grade and origin per contract",
    ],
    packaging: DEFAULT_PACKAGING,
    highlights: [
      "Japonica rice for specialty applications",
      "International supply programmes",
      "Specifications per enquiry",
    ],
    heroImage: `${RICE_BASE}/long-grain-pile.png`,
    images: riceImages(`${RICE_BASE}/long-grain-pile.png`, "Japonica rice — short to medium grain reference"),
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
    youtubeVideoId: RICE_YOUTUBE_VIDEO_ID,
  };
}

export function isRiceCategory(slug: string): boolean {
  return slug === "rice-and-grains";
}
