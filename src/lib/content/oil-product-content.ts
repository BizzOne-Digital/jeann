import type { MarketingContentBox } from "@/components/marketing/MarketingStorySection";
import type { ProductMarketingExtras } from "@/lib/content/sugar-product-content";

export type OilProductDetail = {
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
    body: "Free fatty acid, moisture, colour, and peroxide values are agreed in writing before shipment. Independent inspection and laboratory certificates can be appointed to match your contract.",
  },
  {
    title: "Safety",
    body: "Food-grade handling, sealed tanks and containers, and documented chain of custody reduce contamination risk. Certificates of analysis and origin are prepared for the agreed destination.",
  },
  {
    title: "Punctuality",
    body: "Loading windows, vessel or container nominations, and document presentation dates are coordinated with your banking and logistics teams so cargo and paperwork arrive on schedule.",
  },
];

export const OIL_CATEGORY = {
  eyebrow: "Edible oils",
  title: "Crude and refined edible oils for global commodity trade",
  lead: "Finekarts structures bulk edible oil programmes for refiners, distributors, and industrial buyers. Crude and refined grades — sunflower, soybean, palm, rapeseed, corn, and blended vegetable oils — are confirmed per enquiry against specification, packaging, and delivery terms.",
  oils: [
    "Sunflower oil",
    "Soybean oil",
    "Palm oil",
    "Rapeseed oil",
    "Corn oil",
    "Coconut oil",
    "Vegetable oil",
  ],
  disclaimer:
    "Specifications, availability, origin, and sustainability claims are subject to the individual supply contract and destination-market requirements.",
};

const OIL_PRODUCTS: Record<string, OilProductDetail> = {
  "sunflower-oil": {
    slug: "sunflower-oil",
    grade: "Sunflower oil",
    subtitle: "Crude and refined sunflower oil",
    description:
      "Sunflower oil is traded in both crude and refined forms for food manufacturing, bottling, and industrial channels. Refined grades offer a light colour and neutral flavour; crude sunflower oil is supplied for further refining or industrial processing programmes.",
    applications: [
      "Food manufacturing and bottling",
      "Margarine and spreads",
      "Salad dressings and sauces",
      "Industrial frying applications",
      "Further refining programmes",
    ],
    characteristics: [
      "High oleic and standard grades available subject to contract",
      "Crude and refined supply options",
      "Light golden colour when refined",
      "Bulk tank, flexitank, and drum programmes",
    ],
    packaging: ["Flexitanks", "IBC totes", "Drums/barrels", "ISO tank containers"],
    note: "Refining level, FFA, and colour limits are confirmed through the Certificate of Analysis and sales contract.",
    highlights: [
      "Crude and refined programmes for qualified buyers",
      "Bulk flexitank and ISO tank options",
      "Independent inspection aligned to contract",
    ],
    heroImage: "/images/products/oils/refined-sunflower-product.png",
    images: [
      {
        src: "/images/products/oils/crude-sunflower-oil.png",
        alt: "Crude sunflower oil sampled with sunflower seeds and blooms",
      },
      {
        src: "/images/products/oils/refined-sunflower-oil.png",
        alt: "Refined sunflower oil — clear golden product sample",
      },
      {
        src: "/images/products/oils/refined-sunflower-product.png",
        alt: "Refined sunflower oil product presentation",
      },
      {
        src: "/images/products/product-1.png",
        alt: "Edible oils commodity trade reference",
      },
    ],
  },
  "soybean-oil": {
    slug: "soybean-oil",
    grade: "Soybean oil",
    subtitle: "Crude and refined soybean oil",
    description:
      "Soybean oil is one of the most widely traded vegetable oils globally. Finekarts offers crude soybean oil for refining programmes and refined soybean oil for food and industrial buyers, with specifications confirmed per contract.",
    applications: [
      "Food manufacturing",
      "Bottling and retail supply chains",
      "Margarine and shortening",
      "Industrial and biofuel channels where contractually agreed",
      "Further refining",
    ],
    characteristics: [
      "Crude and refined supply options",
      "Consistent bulk tank and flexitank programmes",
      "FFA, colour, and moisture per agreed specification",
      "Suitable for large-scale international trade",
    ],
    packaging: ["Flexitanks", "ISO tank containers", "Drums/barrels"],
    highlights: [
      "Refined soybean oil for food and bottling channels",
      "Bulk ISO tank and flexitank programmes",
      "Certificate of analysis per shipment",
    ],
    heroImage: "/images/products/oils/refined-soybean-product.png",
    images: [
      {
        src: "/images/products/oils/refined-soybean-product.png",
        alt: "Refined soybean oil — product sample on production line",
      },
      {
        src: "/images/products/oils/refined-soybean-carboys.png",
        alt: "Refined soybean oil filled into bulk carboys at production",
      },
      {
        src: "/images/products/oils/refined-vegetable-bottling.png",
        alt: "Automated bottling line for refined edible oil",
      },
    ],
  },
  "palm-oil": {
    slug: "palm-oil",
    grade: "Palm oil",
    subtitle: "RBD and crude palm oil programmes",
    description:
      "Palm oil is supplied for qualified industrial and refining buyers in crude form or as RBD (refined, bleached, and deodorized) finished product. Sustainability and certification claims are only stated when admin-verified for the specific supply contract.",
    applications: [
      "Food manufacturing",
      "Oleochemical and industrial processing",
      "Margarine and bakery fats",
      "Further refining",
      "Bulk distribution",
    ],
    characteristics: [
      "Crude palm oil (CPO) and RBD palm oil options",
      "Bulk flexitank and ISO tank supply",
      "IV, FFA, and colour per contract specification",
      "Production-scale bottling and bulk filling capability",
    ],
    packaging: ["Flexitanks", "ISO tank containers"],
    highlights: [
      "RBD palm oil finished-product programmes",
      "Crude palm oil for refinery buyers",
      "Bulk tank and flexitank logistics",
    ],
    heroImage: "/images/products/oils/refined-palm-rbd-bottling.png",
    images: [
      {
        src: "/images/products/oils/refined-palm-rbd-bottling.png",
        alt: "Automated RBD palm oil bottling line with quality control at production",
      },
      {
        src: "/images/products/oils/refined-soybean-carboys.png",
        alt: "Bulk refined palm oil filling into carboys at production",
      },
      {
        src: "/images/products/oils/refined-palm-process.png",
        alt: "Palm oil refining process — degumming through deodorization to RBD",
      },
    ],
  },
  "rapeseed-oil": {
    slug: "rapeseed-oil",
    grade: "Rapeseed oil",
    subtitle: "Refined rapeseed (canola) oil",
    description:
      "Rapeseed oil — also traded as canola in some markets — is offered in refined form for food manufacturing, bottling, and distribution. Light colour and neutral flavour make it suitable for a wide range of applications.",
    applications: [
      "Food manufacturing",
      "Bottling and retail programmes",
      "Salad oils and dressings",
      "Industrial food processing",
      "Wholesale distribution",
    ],
    characteristics: [
      "Refined, deodorized grades",
      "Light golden colour",
      "Bulk and bottled supply chains",
      "Low erucic acid grades subject to contract",
    ],
    packaging: ["Flexitanks", "IBC totes", "Drums/barrels"],
    highlights: [
      "Refined rapeseed oil for food and bottling",
      "Production and bottling-scale supply",
      "Independent inspection available",
    ],
    heroImage: "/images/products/oils/rapeseed-oil.png",
    images: [
      {
        src: "/images/products/oils/rapeseed-oil.png",
        alt: "Rapeseed oil bottle held in a blooming rapeseed field",
      },
      {
        src: "/images/products/oils/refined-rapeseed-bottling.png",
        alt: "Refined rapeseed oil bottling on automated production line",
      },
      {
        src: "/images/products/rapeseed-oil-reference.png",
        alt: "Rapeseed oil commodity reference",
      },
    ],
  },
  "canola-oil": {
    slug: "canola-oil",
    grade: "Canola oil",
    subtitle: "Refined canola oil",
    description:
      "Canola oil programmes for distributors and processors. Specifications, packaging, and Incoterms are negotiated per transaction. Canola is a low-erucic acid rapeseed oil grade widely used in North American and international food markets.",
    applications: [
      "Food manufacturing",
      "Bottling and retail",
      "Frying and cooking applications",
      "Wholesale distribution",
    ],
    characteristics: [
      "Refined, low-erucic acid grades",
      "Light colour and neutral flavour",
      "Bulk flexitank and container programmes",
    ],
    packaging: ["Flexitanks", "IBC totes", "ISO tank containers"],
    highlights: [
      "Refined canola oil for food channels",
      "Flexible packaging and Incoterm options",
      "Specifications confirmed per RFQ",
    ],
    heroImage: "/images/products/oils/canola-oil.png",
    images: [
      {
        src: "/images/products/oils/canola-oil.png",
        alt: "Refined canola oil poured into a bowl with rapeseed flowers",
      },
      {
        src: "/images/products/rapeseed-oil-reference.png",
        alt: "Canola oil commodity reference",
      },
    ],
  },
  "coconut-oil": {
    slug: "coconut-oil",
    grade: "Coconut oil",
    subtitle: "Crude and refined coconut oil",
    description:
      "Coconut oil programmes for food manufacturing, cosmetic, and industrial buyers. Refined, virgin, and crude grades are confirmed per enquiry and supply contract.",
    applications: [
      "Food manufacturing",
      "Cosmetic and personal care",
      "Industrial processing",
      "Further refining programmes",
    ],
    characteristics: [
      "Refined and crude supply options",
      "Characteristic coconut aroma when unrefined",
      "Bulk flexitank and drum programmes",
      "IV and FFA per contract specification",
    ],
    packaging: ["Flexitanks", "Drums/barrels", "IBC totes"],
    highlights: [
      "Coconut oil for food and industrial channels",
      "Refined and crude grades per contract",
      "Bulk container programmes",
    ],
    heroImage: "/images/products/oils/coconut-oil.png",
    images: [
      {
        src: "/images/products/oils/coconut-oil.png",
        alt: "Coconut oil in glass vessels with fresh coconut — product reference",
      },
      {
        src: "/images/products/oils/refined-vegetable-bottling.png",
        alt: "Refined coconut oil — bottling line reference",
      },
      {
        src: "/images/products/oils/refined-soybean-carboys.png",
        alt: "Bulk edible oil carboys",
      },
    ],
  },
  "olive-oil": {
    slug: "olive-oil",
    grade: "Olive oil",
    subtitle: "Extra virgin and refined olive oil",
    description:
      "Olive oil programmes for qualified buyers. Grades, origins, and certifications are confirmed per enquiry and supply contract — not stated publicly without admin verification.",
    applications: [
      "Food manufacturing",
      "Bottling and private-label programmes",
      "Retail and food-service supply",
      "Mediterranean export programmes",
    ],
    characteristics: [
      "Extra virgin and refined grades",
      "Origin and acidity per contract",
      "Drum and flexitank programmes",
      "Certificate of analysis per shipment",
    ],
    packaging: ["Drums/barrels", "IBC totes", "Flexitanks"],
    highlights: [
      "Olive oil for qualified food channels",
      "Grades confirmed per RFQ",
      "Export documentation coordinated",
    ],
    heroImage: "/images/products/oils/refined-rapeseed-bottling.png",
    images: [
      {
        src: "/images/products/oils/refined-rapeseed-bottling.png",
        alt: "Refined olive oil bottling line reference",
      },
      {
        src: "/images/products/oils/refined-sunflower-oil.png",
        alt: "Refined edible oil product sample",
      },
    ],
  },
  "corn-oil": {
    slug: "corn-oil",
    grade: "Corn oil",
    subtitle: "Crude corn (maize) oil",
    description:
      "Corn oil is supplied for food manufacturing and distribution channels, typically in crude form for further refining or in refined grades subject to supplier programme. Details are confirmed after RFQ review.",
    applications: [
      "Food manufacturing",
      "Further refining",
      "Industrial frying",
      "Margarine and spreads",
    ],
    characteristics: [
      "Crude corn oil supply",
      "Refined grades subject to enquiry",
      "Golden colour characteristic of maize oil",
      "Bulk tank and drum programmes",
    ],
    packaging: ["Flexitanks", "Drums/barrels"],
    highlights: [
      "Crude corn oil for refinery and food channels",
      "Bulk flexitank programmes",
      "Certificate of analysis per contract",
    ],
    heroImage: "/images/products/oils/crude-corn-oil.png",
    images: [
      {
        src: "/images/products/oils/crude-corn-oil.png",
        alt: "Crude corn oil with fresh maize — product reference",
      },
      {
        src: "/images/products/product-1.png",
        alt: "Edible oils commodity trade reference",
      },
    ],
  },
  "vegetable-oil": {
    slug: "vegetable-oil",
    grade: "Vegetable oil",
    subtitle: "Refined blended vegetable oil",
    description:
      "Blended or specified vegetable oil offerings for buyers requiring a defined fatty-acid profile or price-competitive cooking oil grade. Composition and refining level are confirmed per enquiry and supply contract.",
    applications: [
      "Food manufacturing",
      "Bottling and private-label programmes",
      "Industrial frying",
      "Wholesale and food-service supply",
    ],
    characteristics: [
      "Refined blended grades",
      "Custom blend ratios subject to supplier capability",
      "Bulk bottling and tank programmes",
      "Consistent colour and clarity when refined",
    ],
    packaging: ["Flexitanks", "IBC totes", "Drums/barrels"],
    highlights: [
      "Refined vegetable oil for bottling and food channels",
      "Flexible blend specifications",
      "Production-scale supply programmes",
    ],
    heroImage: "/images/products/oils/vegetable-oil.png",
    images: [
      {
        src: "/images/products/oils/vegetable-oil.png",
        alt: "Vegetable oil being poured into a glass — product reference",
      },
      {
        src: "/images/products/oils/refined-vegetable-bottling.png",
        alt: "Refined vegetable oil bottling on automated production line",
      },
      {
        src: "/images/products/oils/refined-rapeseed-bottling.png",
        alt: "Refined edible oil bottling line",
      },
      {
        src: "/images/products/product-1.png",
        alt: "Edible oils commodity trade reference",
      },
    ],
  },
};

export function getOilProductDetail(slug: string): OilProductDetail | null {
  return OIL_PRODUCTS[slug] ?? null;
}

export function getOilProductMarketing(slug: string): ProductMarketingExtras | null {
  const oil = OIL_PRODUCTS[slug];
  if (!oil) return null;
  return {
    description: oil.description,
    contentBoxes: PILLARS,
    highlights: oil.highlights,
  };
}

export function isEdibleOilsCategory(slug: string): boolean {
  return slug === "edible-oils";
}
