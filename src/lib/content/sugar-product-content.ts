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

/** Category cards, heroes, and galleries — sugar crystals only, never packaging bags. */
export const SUGAR_CATEGORY_COVER_IMAGE = "/images/products/sugar/icumsa-45-white-sugar-2.png";

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
        position: "Lite cream refined sugar",
        marketUse: "Food & commercial processing",
        colour: "Lite cream",
      },
      {
        grade: "ICUMSA 150",
        position: "Brown-tone commercial sugar",
        marketUse: "Food & industrial processing",
        colour: "Light brown",
      },
      {
        grade: "ICUMSA 600",
        position: "Brown commercial sugar",
        marketUse: "Processing & industrial applications",
        colour: "Brown",
      },
      {
        grade: "ICUMSA 1200",
        position: "Red sugar — higher-colour commercial grade",
        marketUse: "Industrial & selected food applications",
        colour: "Red",
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
    heroImage: "/images/products/sugar/icumsa-45-white-sugar-2.png",
    images: [
      {
        src: "/images/products/sugar/icumsa-45-white-sugar-2.png",
        alt: "Close-up of ICUMSA 45 premium refined white sugar crystals",
      },
      {
        src: "/images/products/sugar/icumsa-45-white-sugar-3.png",
        alt: "ICUMSA 45 refined white sugar granules",
      },
      {
        src: "/images/products/sugar/icumsa-45-white-sugar.png",
        alt: "ICUMSA 45 refined white sugar product",
      },
    ],
  },
  "icumsa-100": {
    slug: "icumsa-100",
    code: "ICUMSA 100",
    subtitle: "Lite cream refined sugar for commercial applications",
    description:
      "ICUMSA 100 is a lite cream refined sugar grade suitable for a wide range of commercial food-processing and industrial applications. It provides a balance between refined quality, consistent colour and commercial versatility.",
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
      "Lite cream refined sugar",
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
      "Lite cream refined sugar for commercial food processing",
      "Controlled colour and consistent crystal structure",
      "Domestic and international supply programmes",
    ],
    heroImage: "/images/products/sugar/icumsa-100-crystal-white-sugar.png",
    images: [
      {
        src: "/images/products/sugar/icumsa-100-crystal-white-sugar.png",
        alt: "ICUMSA 100 lite cream crystal sugar grains",
      },
      {
        src: "/images/products/sugar/icumsa-45-white-sugar-2.png",
        alt: "Refined white sugar crystals — reference for lite cream grades",
      },
    ],
  },
  "icumsa-150": {
    slug: "icumsa-150",
    code: "ICUMSA 150",
    subtitle: "Brown-tone sugar for food & industrial markets",
    description:
      "ICUMSA 150 is a commercially traded sugar grade with a light brown appearance, used across food-processing, manufacturing and distribution markets. Its colour and refined characteristics make it suitable for applications where consistent sugar quality is required while allowing flexibility across different industrial uses.",
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
      "Light brown crystalline sugar",
      "Brown-tone colour profile",
      "Consistent quality",
      "High commercial versatility",
      "Suitable for bulk and packaged supply",
    ],
    packaging: ["Bulk vessel", "Bagged cargo", "PP woven bags", "Jumbo bags / FIBC"],
    note: "Final product specifications are confirmed by the supplier's technical specification and applicable Certificate of Analysis.",
    youtubeVideoId: "gADVpRPdr7E",
    highlights: [
      "Light brown commercial grade for food and industrial markets",
      "Brown-tone colour with consistent quality",
      "Bulk vessel and bagged cargo formats",
    ],
    heroImage: "/images/products/sugar/icumsa-600-brown-sugar.jpg",
    images: [
      {
        src: "/images/products/sugar/icumsa-600-brown-sugar.jpg",
        alt: "ICUMSA 150 light brown sugar crystals",
      },
      {
        src: "/images/products/sugar/icumsa-600-raw-sugar-cane.png",
        alt: "Light brown raw sugar crystals",
      },
    ],
  },
  "icumsa-600": {
    slug: "icumsa-600",
    code: "ICUMSA 600",
    subtitle: "Brown commercial refined sugar",
    description:
      "ICUMSA 600 is a commercially traded brown sugar grade with a higher colour value than lower-ICUMSA refined grades. It is suitable for food processing and industrial applications where a brown sugar specification is required.",
    applications: [
      "Food processing",
      "Bakery products",
      "Industrial food manufacturing",
      "Beverage and ingredient applications",
      "Wholesale distribution",
      "Food-service markets",
    ],
    characteristics: [
      "Brown refined sugar",
      "Higher colour specification than ICUMSA 45",
      "Suitable for a range of processing applications",
      "Competitive option for commercial users",
      "Available subject to origin and production specifications",
    ],
    packaging: ["Bulk vessel", "25 kg bags", "50 kg bags", "PP woven bags", "FIBC/Jumbo bags"],
    note: "Buyers should confirm the exact colour, polarization, moisture, ash and other parameters before contracting.",
    youtubeVideoId: "gADVpRPdr7E",
    highlights: [
      "Brown commercial refined sugar",
      "Suitable for brown-sugar processing specifications",
      "Competitive option for processing and industrial users",
    ],
    heroImage: "/images/products/sugar/icumsa-600-brown-sugar.jpg",
    images: [
      {
        src: "/images/products/sugar/icumsa-600-brown-sugar.jpg",
        alt: "ICUMSA 600 brown sugar crystals in bulk presentation",
      },
      {
        src: "/images/products/sugar/icumsa-600-raw-sugar-cane.jpg",
        alt: "ICUMSA 600 brown sugar product",
      },
      {
        src: "/images/products/sugar/icumsa-600-raw-sugar-cane.png",
        alt: "Brown sugar crystals close-up",
      },
    ],
  },
  "icumsa-1200": {
    slug: "icumsa-1200",
    code: "ICUMSA 1200",
    subtitle: "Red sugar for industrial applications",
    description:
      "ICUMSA 1200 is a red sugar grade used in selected industrial and food-processing applications where premium refined white sugar is not required. It provides a commercially attractive option for customers seeking a higher-colour red sugar specification for manufacturing and processing.",
    applications: [
      "Industrial food processing",
      "Bakery applications",
      "Ingredient manufacturing",
      "Food-service applications",
      "Wholesale distribution",
      "Selected industrial uses",
    ],
    characteristics: [
      "Red crystalline sugar",
      "Highest colour value in this range",
      "Suitable for selected processing applications",
      "Commercially competitive",
      "Available in bulk and packaged formats depending on origin",
    ],
    packaging: ["Bulk vessel", "25 kg bags", "50 kg bags", "PP woven bags", "Jumbo bags / FIBC"],
    note: "Exact quality parameters are confirmed against the applicable supplier specification and Certificate of Analysis.",
    youtubeVideoId: "gADVpRPdr7E",
    highlights: [
      "Red sugar commercial grade for industrial processing",
      "Commercially competitive for selected applications",
      "Bulk and packaged formats depending on origin",
    ],
    heroImage: "/images/products/sugar/icumsa-1200-cream-sugar-cane.jpg",
    images: [
      {
        src: "/images/products/sugar/icumsa-1200-cream-sugar-cane.jpg",
        alt: "ICUMSA 1200 red sugar crystals",
      },
      {
        src: "/images/products/sugar/icumsa-1200-cream-sugar-cane-2.png",
        alt: "Close-up of ICUMSA 1200 red sugar granules",
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
