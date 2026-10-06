/** Quality & regulatory narrative — ~60% emphasis on products/resources/insights hubs. */

export const PRODUCT_QUALITY_COMPLIANCE = {
  eyebrow: "Quality & regulatory alignment",
  title: "Specifications that stand up to import and food-safety rules",
  lead:
    "Roughly two-thirds of how we structure programmes is about the cargo itself: grade, moisture, polarization, FFA, pesticide MRLs, packaging integrity, and documentary proof. Programmes are built so specifications map to applicable government food-safety, phytosanitary, and customs rules in origin and destination markets — confirmed in your signed PSA, not on this marketing site.",
  bullets: [
    "Origin and destination regulatory frameworks (FDA, CFIA, EU, GCC, and corridor-specific import rules) inform default specification bands.",
    "Independent inspection and laboratory testing when the contract requires Certificate of Analysis, weight, and loading evidence.",
    "Traceability, labeling, and transport documentation aligned to how qualified buyers present cargo to banks and customs.",
  ],
} as const;

export type ProductSpotlight = {
  name: string;
  href: string;
  blurb: string;
};

/** `/products` — oils, sugar, coffee (not duplicated on resources/insights bands). */
export const PRODUCTS_PAGE_SPOTLIGHTS: ProductSpotlight[] = [
  {
    name: "Refined sugar",
    href: "/products/sugar",
    blurb:
      "ICUMSA-graded white and raw cane programmes with polarization, colour, and moisture bands suited to food and industrial buyers.",
  },
  {
    name: "Arabica & robusta coffee",
    href: "/products/coffee",
    blurb:
      "Green coffee by origin and screen size — moisture, defect count, and cup profile agreed before booking against SCA-style references.",
  },
  {
    name: "Edible oils",
    href: "/products/edible-oils",
    blurb:
      "Sunflower, soybean, palm, and related refined oils with FFA, iodine value, and packaging matched to food-grade import rules.",
  },
];

/** `/resources` — rice, pulses, spices. */
export const RESOURCES_PAGE_SPOTLIGHTS: ProductSpotlight[] = [
  {
    name: "Rice & grains",
    href: "/products/rice-and-grains",
    blurb:
      "Long-grain and parboiled rice with broken percentage, moisture, and milling quality tied to buyer-grade specifications.",
  },
  {
    name: "Beans & pulses",
    href: "/products/beans-and-pulses",
    blurb:
      "Chickpeas, kidney beans, soybeans, and specialty pulses with foreign matter and moisture limits for food programmes.",
  },
  {
    name: "Spices & tree nuts",
    href: "/products/spices",
    blurb:
      "Pepper, cinnamon, cashews, and related lines with aflatoxin and pesticide documentation where corridors require it.",
  },
];

/** `/insights` — cross-links without repeating the same three categories as products/resources. */
export const INSIGHTS_PAGE_SPOTLIGHTS: ProductSpotlight[] = [
  {
    name: "Sugar quality (ICUMSA)",
    href: "/products/sugar",
    blurb: "How colour, polarization, and ash limits interact with LC wording and destination food law.",
  },
  {
    name: "Oil quality (FFA & refining)",
    href: "/products/edible-oils",
    blurb: "Refining indicators, tank hygiene, and CoA presentation for edible oil import programmes.",
  },
  {
    name: "Coffee & cocoa grading",
    href: "/products/coffee",
    blurb: "Screen, defect, and moisture discipline for green coffee moving through multi-leg corridors.",
  },
];
