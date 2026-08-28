import type { MarketingContentBox } from "@/components/marketing/MarketingStorySection";

export type SugarGradeDetail = {
  slug: string;
  code: string;
  subtitle: string;
  description: string;
  applications: string[];
  characteristics: string[];
  packaging: string[];
  note?: string;
  youtubeVideoId?: string;
  highlights: string[];
  heroImage?: string;
  images?: { src: string; alt: string }[];
};

export type ProductMarketingExtras = {
  description: string;
  contentBoxes: MarketingContentBox[];
  youtubeVideoId?: string;
  highlights: string[];
};

const PILLARS: MarketingContentBox[] = [
  {
    title: "Quality",
    body: "Polarity, colour, moisture, and granulation are agreed in writing before shipment. Independent inspection and laboratory certificates can be appointed to match your contract.",
  },
  {
    title: "Safety",
    body: "Food-grade handling, sealed packaging, and documented chain of custody reduce contamination risk. Phytosanitary and weight/quantity certificates are prepared for the agreed destination.",
  },
  {
    title: "Punctuality",
    body: "Loading windows, vessel nominations, and document presentation dates are coordinated with your banking and logistics teams so cargo and paperwork arrive on schedule.",
  },
];

export const SUGAR_CATEGORY = {
  eyebrow: "ICUMSA sugar",
  title: "Refined white sugar for global commodity markets",
  lead: "Finekarts Inc. supplies a range of ICUMSA sugar grades for international food, beverage, manufacturing, wholesale and distribution markets. Our sugar supply programmes can be structured according to grade, origin, specification, packaging, quantity, destination and delivery terms.",
  grades: ["ICUMSA 45", "ICUMSA 100", "ICUMSA 150", "ICUMSA 600", "ICUMSA 1200"],
  disclaimer:
    "Specifications, availability, origin and certifications are subject to the individual supply contract and destination-market requirements.",
  comparison: {
    title: "Compare our ICUMSA sugar grades",
    note: "ICUMSA colour classifications and commercial specifications can vary according to the applicable standard, contract and supplier. Buyers should rely on the specific product specification, Certificate of Analysis and contractual quality parameters, rather than the ICUMSA number alone.",
    rows: [
      {
        grade: "ICUMSA 45",
        position: "Premium refined white sugar",
        marketUse: "Food, beverage, confectionery",
        colour: "Very low",
      },
      {
        grade: "ICUMSA 100",
        position: "Refined white sugar",
        marketUse: "Food & commercial processing",
        colour: "Low",
      },
      {
        grade: "ICUMSA 150",
        position: "Refined commercial sugar",
        marketUse: "Food & industrial processing",
        colour: "Controlled",
      },
      {
        grade: "ICUMSA 600",
        position: "Commercial refined sugar",
        marketUse: "Processing & industrial applications",
        colour: "Higher",
      },
      {
        grade: "ICUMSA 1200",
        position: "Higher-colour commercial sugar",
        marketUse: "Industrial & selected food applications",
        colour: "Higher",
      },
    ],
  },
  globalSupply: {
    title: "Global sugar supply",
    flow: "Origin → Grade → Quantity → Packaging → Inspection → Port → Shipping → Destination",
    packaging: [
      "Bulk vessel",
      "Containerized cargo",
      "25 kg bags",
      "50 kg bags",
      "PP woven bags",
      "FIBC/Jumbo bags",
      "Other packaging subject to supplier capability",
    ],
    tradeTerms:
      "FOB and CIF are currently Finekarts' primary commercial delivery terms, subject to contract. Independent inspection, quality testing and quantity verification can be arranged where required.",
  },
  qualityVerification: {
    title: "Quality & verification",
    lead: "For large international transactions, Finekarts can coordinate independent third-party services for:",
    items: [
      "Supplier verification",
      "Product sampling",
      "Quality inspection",
      "Quantity verification",
      "Laboratory analysis",
      "Loading supervision",
      "Certificate of quality",
      "Certificate of analysis",
    ],
    note: "Inspection requirements are established according to the commodity, origin, destination and sales contract.",
  },
  cta: {
    title: "Choose the right sugar grade",
    lead: "Whether you require premium ICUMSA 45 for food and beverage production or a higher-colour commercial grade for industrial processing, Finekarts can help identify a suitable supply specification based on your requirements.",
    fields: ["Grade", "Quantity", "Origin", "Destination", "Delivery term"],
    tagline: "ICUMSA 45 • 100 • 150 • 600 • 1200",
    badges: [
      "Global supply",
      "Independent inspection",
      "International shipping",
      "Reliable trade execution",
    ],
  },
};

const SUGAR_GRADES: Record<string, SugarGradeDetail> = {
  "icumsa-45": {
    slug: "icumsa-45",
    code: "ICUMSA 45",
    subtitle: "Premium refined white sugar",
    description:
      "ICUMSA 45 is a highly refined white sugar commonly traded in international food and beverage markets. Its very low colour value and high degree of refinement make it suitable for applications where a clean, bright appearance and consistent quality are required.",
    applications: [
      "Food manufacturing",
      "Beverage production",
      "Confectionery",
      "Bakery products",
      "Dairy products",
      "Pharmaceutical applications where the required specification is met",
      "Retail and wholesale distribution",
      "Industrial food processing",
    ],
    characteristics: [
      "Very low colour value",
      "High purity",
      "Refined white crystalline appearance",
      "Consistent granulation",
      "Suitable for bulk international trade",
      "Available in bulk and packaged formats",
    ],
    packaging: ["Bulk vessel", "25 kg bags", "50 kg bags", "PP woven bags", "Jumbo bags / FIBC"],
    note: "ICUMSA 45 specifications should always be confirmed through the applicable Certificate of Analysis and sales contract.",
    youtubeVideoId: "gADVpRPdr7E",
    highlights: [
      "Premium refined white sugar for food and beverage markets",
      "Very low colour value and high purity",
      "Bulk vessel and bagged formats available",
    ],
    heroImage: "/images/products/sugar/icumsa-45-white-sugar-3.png",
    images: [
      {
        src: "/images/products/sugar/icumsa-45-white-sugar.png",
        alt: "ICUMSA 45 refined white sugar sampled from a commercial sack",
      },
      {
        src: "/images/products/sugar/icumsa-45-white-sugar-2.png",
        alt: "Close-up of ICUMSA 45 premium refined white sugar crystals",
      },
      {
        src: "/images/products/sugar/icumsa-45-50kg-bags.png",
        alt: "ICUMSA 45 refined white sugar in 50 kg export sacks",
      },
      {
        src: "/images/products/sugar/icumsa-45-white-sugar-3.png",
        alt: "Palletized ICUMSA 45 sugar bags in an export warehouse",
      },
    ],
  },
  "icumsa-100": {
    slug: "icumsa-100",
    code: "ICUMSA 100",
    subtitle: "Refined white sugar for commercial applications",
    description:
      "ICUMSA 100 represents a refined white sugar grade suitable for a wide range of commercial food-processing and industrial applications. It provides a balance between refined quality, consistent colour and commercial versatility.",
    applications: [
      "Food processing",
      "Beverage manufacturing",
      "Bakeries",
      "Confectionery",
      "Wholesale distribution",
      "Food-service supply",
      "Industrial applications",
    ],
    characteristics: [
      "Refined white sugar",
      "Controlled colour specification",
      "High purity",
      "Consistent crystal structure",
      "Suitable for commercial food applications",
      "Available for domestic and international supply",
    ],
    packaging: ["Bulk", "25 kg bags", "50 kg bags", "PP woven bags", "FIBC/Jumbo bags"],
    note: "Exact specifications depend on the producer, origin and agreed contract specification.",
    youtubeVideoId: "gADVpRPdr7E",
    highlights: [
      "Refined white sugar for commercial food processing",
      "Controlled colour and consistent crystal structure",
      "Domestic and international supply programmes",
    ],
    heroImage: "/images/products/sugar/icumsa-100-crystal-white-sugar-2.png",
    images: [
      {
        src: "/images/products/sugar/icumsa-100-crystal-white-sugar.png",
        alt: "ICUMSA 100 crystal white sugar grains in hand",
      },
      {
        src: "/images/products/sugar/icumsa-100-crystal-white-sugar-2.png",
        alt: "50 kg bag of ICUMSA 100 white crystal sugar",
      },
    ],
  },
  "icumsa-150": {
    slug: "icumsa-150",
    code: "ICUMSA 150",
    subtitle: "Refined white sugar for food & industrial markets",
    description:
      "ICUMSA 150 is a commercially traded refined white sugar grade used across food-processing, manufacturing and distribution markets. Its controlled colour and refined characteristics make it suitable for applications where consistent sugar quality is required while allowing flexibility across different industrial uses.",
    applications: [
      "Food manufacturing",
      "Beverage production",
      "Bakery",
      "Confectionery",
      "Food-service distribution",
      "Wholesale markets",
      "Industrial processing",
    ],
    characteristics: [
      "Refined crystalline sugar",
      "Controlled colour",
      "Consistent quality",
      "High commercial versatility",
      "Suitable for bulk and packaged supply",
    ],
    packaging: ["Bulk vessel", "Bagged cargo", "PP woven bags", "Jumbo bags / FIBC"],
    note: "Final product specifications are confirmed by the supplier's technical specification and applicable Certificate of Analysis.",
    youtubeVideoId: "gADVpRPdr7E",
    highlights: [
      "Refined commercial grade for food and industrial markets",
      "Controlled colour with consistent quality",
      "Bulk vessel and bagged cargo formats",
    ],
    heroImage: "/images/products/sugar/icumsa-150-raw-sugar-cane.png",
    images: [
      {
        src: "/images/products/sugar/icumsa-150-raw-sugar-cane.png",
        alt: "ICUMSA 150 raw cane sugar in FIBC jumbo bags on pallet",
      },
    ],
  },
  "icumsa-600": {
    slug: "icumsa-600",
    code: "ICUMSA 600",
    subtitle: "Commercial refined sugar",
    description:
      "ICUMSA 600 is a commercially traded sugar grade with a higher colour value than lower-ICUMSA refined white sugar grades. It can be suitable for food processing and industrial applications where ultra-low colour is not a primary requirement.",
    applications: [
      "Food processing",
      "Bakery products",
      "Industrial food manufacturing",
      "Beverage and ingredient applications",
      "Wholesale distribution",
      "Food-service markets",
    ],
    characteristics: [
      "Refined sugar",
      "Higher colour specification than ICUMSA 45",
      "Suitable for a range of processing applications",
      "Competitive option for commercial users",
      "Available subject to origin and production specifications",
    ],
    packaging: ["Bulk vessel", "25 kg bags", "50 kg bags", "PP woven bags", "FIBC/Jumbo bags"],
    note: "Buyers should confirm the exact colour, polarization, moisture, ash and other parameters before contracting.",
    youtubeVideoId: "gADVpRPdr7E",
    highlights: [
      "Commercial refined sugar with higher colour specification",
      "Suitable where ultra-low colour is not required",
      "Competitive option for processing and industrial users",
    ],
    heroImage: "/images/products/sugar/icumsa-600-raw-sugar-cane.png",
    images: [
      {
        src: "/images/products/sugar/icumsa-600-raw-sugar-cane.png",
        alt: "ICUMSA 600 raw sugar cane crystals in bulk presentation",
      },
    ],
  },
  "icumsa-1200": {
    slug: "icumsa-1200",
    code: "ICUMSA 1200",
    subtitle: "Commercial sugar for industrial applications",
    description:
      "ICUMSA 1200 is a higher-colour sugar grade used in selected industrial and food-processing applications where the very bright appearance associated with premium refined sugar is not required. It can provide a commercially attractive option for customers seeking suitable sugar specifications for manufacturing and processing.",
    applications: [
      "Industrial food processing",
      "Bakery applications",
      "Ingredient manufacturing",
      "Food-service applications",
      "Wholesale distribution",
      "Selected industrial uses",
    ],
    characteristics: [
      "Crystalline sugar",
      "Higher colour value",
      "Suitable for selected processing applications",
      "Commercially competitive",
      "Available in bulk and packaged formats depending on origin",
    ],
    packaging: ["Bulk vessel", "25 kg bags", "50 kg bags", "PP woven bags", "Jumbo bags / FIBC"],
    note: "Exact quality parameters are confirmed against the applicable supplier specification and Certificate of Analysis.",
    youtubeVideoId: "gADVpRPdr7E",
    highlights: [
      "Higher-colour commercial grade for industrial processing",
      "Commercially competitive for selected applications",
      "Bulk and packaged formats depending on origin",
    ],
    heroImage: "/images/products/sugar/icumsa-1200-cream-sugar-cane.png",
    images: [
      {
        src: "/images/products/sugar/icumsa-1200-cream-sugar-cane.png",
        alt: "ICUMSA 1200 cream sugar cane crystals in a wooden bowl",
      },
      {
        src: "/images/products/sugar/icumsa-1200-cream-sugar-cane-2.png",
        alt: "Close-up of ICUMSA 1200 cream sugar cane granules",
      },
    ],
  },
};

export function getSugarGradeDetail(slug: string): SugarGradeDetail | null {
  return SUGAR_GRADES[slug] ?? null;
}

export function getSugarProductMarketing(slug: string): ProductMarketingExtras | null {
  const grade = SUGAR_GRADES[slug];
  if (!grade) return null;
  return {
    description: grade.description,
    contentBoxes: PILLARS,
    youtubeVideoId: grade.youtubeVideoId,
    highlights: grade.highlights,
  };
}

export function getDefaultProductMarketing(
  productName: string,
  categoryName: string,
): ProductMarketingExtras {
  return {
    description: `${productName} programmes for qualified international buyers. Finekarts confirms specifications, inspection scope, and shipment timing before contract — so quality, safety, and delivery discipline are clear from enquiry to discharge.`,
    contentBoxes: PILLARS,
    highlights: [
      `Sourced and structured for ${categoryName.toLowerCase()} trade lanes`,
      "Independent inspection and certificates aligned to contract",
      "FOB and CIF options with documented responsibilities",
    ],
  };
}

export function isSugarCategory(slug: string): boolean {
  return slug === "sugar";
}
