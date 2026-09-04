export const RICE_IMAGE_BASE = "/products/rice";

export function riceProductImage(slug: string): string {
  return `${RICE_IMAGE_BASE}/${slug}.png`;
}

export type RiceSpec = { label: string; value: string };

export type RiceSubcategoryId = "long-grain" | "parboiled" | "basmati";

export type RiceCatalogRow = {
  slug: string;
  name: string;
  subcategory: RiceSubcategoryId;
  subtitle: string;
  specs: RiceSpec[];
  origin?: string;
};

export const RICE_SUBCATEGORIES: Record<
  RiceSubcategoryId,
  { title: string; description: string; order: number }
> = {
  "long-grain": {
    title: "Long grain & specialty rice",
    description:
      "White, fragrant, medium, broken, and specialty rice grades for retail, food-service, and manufacturing programmes.",
    order: 1,
  },
  parboiled: {
    title: "Parboiled rice",
    description:
      "Parboiled and sella programmes with firm texture, nutrient retention, and export milling grades.",
    order: 2,
  },
  basmati: {
    title: "Basmati rice",
    description:
      "Aromatic basmati and pusa basmati lines from India and Pakistan — length, chalky kernel, and origin per contract.",
    order: 3,
  },
};

/** Illustrative specs from the client catalogue — contract terms supersede website content. */
export const RICE_CATALOG: RiceCatalogRow[] = [
  // —— Long grain & specialty ——
  {
    slug: "long-grain-white-rice",
    name: "Long grain white rice",
    subcategory: "long-grain",
    subtitle: "Export long-grain white rice",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "14% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Chalky kernel", value: "7% max" },
      { label: "Average length of grain", value: "6.2 mm" },
    ],
  },
  {
    slug: "perfumed-rice",
    name: "Perfumed rice",
    subcategory: "long-grain",
    subtitle: "Fragrant long-grain perfumed rice",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "14% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Chalky kernel", value: "3% max" },
      { label: "Average length of grain", value: "6.6 mm" },
    ],
  },
  {
    slug: "jasmine-rice",
    name: "Jasmine rice",
    subcategory: "long-grain",
    subtitle: "Fragrant long-grain jasmine rice",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "14% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Chalky kernel", value: "3% max" },
      { label: "Average length of grain", value: "6.8 mm" },
    ],
  },
  {
    slug: "hom-mali-kdm-rice",
    name: "Hom Mali KDM rice",
    subcategory: "long-grain",
    subtitle: "Thai hom mali KDM fragrant rice",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "14% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Chalky kernel", value: "3% max" },
      { label: "Average length of grain", value: "7.2 mm" },
    ],
  },
  {
    slug: "st-25",
    name: "ST 25",
    subcategory: "long-grain",
    subtitle: "ST 25 long-grain white rice",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "14% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Chalky kernel", value: "3% max" },
      { label: "Average length of grain", value: "7.4 mm" },
    ],
  },
  {
    slug: "japonica-rice",
    name: "Japonica rice",
    subcategory: "long-grain",
    subtitle: "Short-grain japonica rice",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "14% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Chalky kernel", value: "3% max" },
      { label: "Average length of grain", value: "5.0 mm" },
      { label: "Average width of grain", value: "3.0 mm" },
    ],
  },
  {
    slug: "medium-rice",
    name: "Medium rice",
    subcategory: "long-grain",
    subtitle: "Medium-grain white rice",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "14% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Chalky kernel", value: "3% max" },
      { label: "Average length of grain", value: "5.5 mm" },
      { label: "Average width of grain", value: "2.8 mm" },
    ],
  },
  {
    slug: "broken-rice",
    name: "Broken rice",
    subcategory: "long-grain",
    subtitle: "100% broken white and jasmine rice",
    specs: [
      { label: "Grade", value: "White rice, jasmine rice" },
      { label: "Broken", value: "100%" },
      { label: "Moisture", value: "14% max" },
      { label: "Foreign matters", value: "0.1% max" },
    ],
  },
  {
    slug: "glutinous-rice",
    name: "Glutinous rice",
    subcategory: "long-grain",
    subtitle: "Sticky glutinous rice",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "14% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Average length of grain", value: "5.8 mm" },
    ],
  },
  {
    slug: "brown-rice",
    name: "Brown rice",
    subcategory: "long-grain",
    subtitle: "Whole-grain brown rice",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "15% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Average length of grain", value: "5.8 mm" },
    ],
  },
  {
    slug: "red-rice",
    name: "Red rice",
    subcategory: "long-grain",
    subtitle: "Red whole-grain rice",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "15% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Average length of grain", value: "7.2 mm" },
    ],
  },
  {
    slug: "black-rice",
    name: "Black rice",
    subcategory: "long-grain",
    subtitle: "Black / purple whole-grain rice",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "15% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Average length of grain", value: "7.2 mm" },
    ],
  },
  // —— Parboiled ——
  {
    slug: "white-parboiled-rice",
    name: "White parboiled rice",
    subcategory: "parboiled",
    subtitle: "Long-grain white parboiled rice",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "14% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Chalky kernel", value: "7% max" },
      { label: "Average length of grain", value: "8.2 mm" },
    ],
  },
  {
    slug: "swarna-parboiled-rice",
    name: "Swarna parboiled rice",
    subcategory: "parboiled",
    subtitle: "Swarna long-grain parboiled rice",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "14% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Chalky kernel", value: "3% max" },
      { label: "Average length of grain", value: "8.3 mm" },
    ],
  },
  {
    slug: "ir64-parboiled",
    name: "IR64 parboiled",
    subcategory: "parboiled",
    subtitle: "IR64 parboiled rice",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "14% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Chalky kernel", value: "3% max" },
      { label: "Average length of grain", value: "6.8 mm" },
    ],
  },
  {
    slug: "pr11-parboiled",
    name: "PR11 parboiled",
    subcategory: "parboiled",
    subtitle: "PR11 parboiled rice",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "14% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Chalky kernel", value: "3% max" },
      { label: "Average length of grain", value: "7.2 mm" },
    ],
  },
  {
    slug: "parboiled-pusa-sella",
    name: "Parboiled pusa sella",
    subcategory: "parboiled",
    subtitle: "Pusa sella parboiled rice",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "14% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Chalky kernel", value: "3% max" },
      { label: "Average length of grain", value: "7.4 mm" },
    ],
  },
  {
    slug: "ir36-parboiled",
    name: "IR36 parboiled",
    subcategory: "parboiled",
    subtitle: "IR36 parboiled rice",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "14% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Chalky kernel", value: "3% max" },
      { label: "Average length of grain", value: "5.0 mm" },
      { label: "Average width of grain", value: "3.0 mm" },
    ],
  },
  {
    slug: "swarna-parboiled-medium",
    name: "Swarna parboiled (medium grain)",
    subcategory: "parboiled",
    subtitle: "Medium-grain swarna parboiled rice",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "14% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Chalky kernel", value: "3% max" },
      { label: "Average length of grain", value: "5.5 mm" },
      { label: "Average width of grain", value: "2.8 mm" },
    ],
  },
  {
    slug: "panny-parboiled",
    name: "Panny parboiled",
    subcategory: "parboiled",
    subtitle: "Panny parboiled broken rice",
    specs: [
      { label: "Grade", value: "White rice, jasmine rice" },
      { label: "Broken", value: "100%" },
      { label: "Moisture", value: "14% max" },
      { label: "Foreign matters", value: "0.1% max" },
    ],
  },
  {
    slug: "premium-lg-parboiled",
    name: "Premium L G parboiled",
    subcategory: "parboiled",
    subtitle: "Premium long-grain parboiled rice",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "14% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Average length of grain", value: "5.8 mm" },
    ],
  },
  {
    slug: "irr64-parboiled",
    name: "IRR64 parboiled",
    subcategory: "parboiled",
    subtitle: "IRR64 parboiled rice",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "15% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Average length of grain", value: "5.8 mm" },
    ],
  },
  {
    slug: "thai-long-g-parboiled",
    name: "Thai long G parboiled",
    subcategory: "parboiled",
    subtitle: "Thai long-grain parboiled rice",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "15% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Average length of grain", value: "7.2 mm" },
    ],
  },
  {
    slug: "parboiled-5-broken",
    name: "5% broken parboiled",
    subcategory: "parboiled",
    subtitle: "Parboiled rice — 5% broken maximum",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "15% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Average length of grain", value: "7.2 mm" },
    ],
  },
  // —— Basmati ——
  {
    slug: "basmati-370",
    name: "Basmati 370",
    subcategory: "basmati",
    subtitle: "Basmati 370 long-grain rice",
    origin: "Pakistan",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "14% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Chalky kernel", value: "7% max" },
      { label: "Average length of grain", value: "~8.3 mm" },
    ],
  },
  {
    slug: "basmati-217",
    name: "Basmati 217",
    subcategory: "basmati",
    subtitle: "Basmati 217 long-grain rice",
    origin: "India",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "14% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Chalky kernel", value: "3% max" },
      { label: "Average length of grain", value: "8.0 mm" },
    ],
  },
  {
    slug: "basmati-386",
    name: "Basmati 386",
    subcategory: "basmati",
    subtitle: "Basmati 386 long-grain rice",
    origin: "Pakistan",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "14% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Chalky kernel", value: "3% max" },
      { label: "Average length of grain", value: "8.2 mm" },
    ],
  },
  {
    slug: "basmati-pr14-l-grain",
    name: "Basmati PR14 L grain",
    subcategory: "basmati",
    subtitle: "Basmati PR14 long-grain rice",
    origin: "India",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "14% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Chalky kernel", value: "3% max" },
      { label: "Average length of grain", value: "8.4 mm" },
    ],
  },
  {
    slug: "basmati-pr-10-sela",
    name: "Basmati PR 10 sela",
    subcategory: "basmati",
    subtitle: "Basmati PR 10 parboiled (sela) rice",
    origin: "India",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "14% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Chalky kernel", value: "3% max" },
      { label: "Average length of grain", value: "8.4 – 8.6 mm" },
    ],
  },
  {
    slug: "pusa-basmati-1509",
    name: "Pusa basmati 1509",
    subcategory: "basmati",
    subtitle: "Pusa basmati 1509 aromatic rice",
    origin: "India",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "14% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Chalky kernel", value: "3% max" },
      { label: "Average length of grain", value: "5.0 mm" },
      { label: "Average width of grain", value: "8.2 mm" },
    ],
  },
  {
    slug: "pusa-basmati-1401",
    name: "Pusa basmati 1401",
    subcategory: "basmati",
    subtitle: "Pusa basmati 1401 aromatic rice",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "14% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Chalky kernel", value: "3% max" },
      { label: "Average length of grain", value: "5.5 mm" },
      { label: "Average width of grain", value: "8.3 mm" },
    ],
  },
  {
    slug: "pusa-basmati-1718",
    name: "Pusa basmati 1718",
    subcategory: "basmati",
    subtitle: "Pusa basmati 1718 broken rice",
    origin: "India",
    specs: [
      { label: "Grade", value: "White rice, jasmine rice" },
      { label: "Broken", value: "100%" },
      { label: "Moisture", value: "14% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Average length", value: "8.2 mm" },
    ],
  },
  {
    slug: "golden-pusa-basmati",
    name: "Golden pusa basmati",
    subcategory: "basmati",
    subtitle: "Golden pusa basmati parboiled rice",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "14% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Average length of grain", value: "8.3 mm" },
    ],
  },
  {
    slug: "premium-golden-basmati",
    name: "Premium golden basmati",
    subcategory: "basmati",
    subtitle: "Premium golden basmati rice",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "15% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Average length of grain", value: "8.2 mm" },
    ],
  },
  {
    slug: "steam-sela-basmati",
    name: "Steam sela basmati",
    subcategory: "basmati",
    subtitle: "Steam parboiled (sela) basmati rice",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "15% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Average length of grain", value: "7.2 mm" },
    ],
  },
  {
    slug: "brown-1211-basmati",
    name: "Brown 1211 basmati",
    subcategory: "basmati",
    subtitle: "Brown 1211 basmati whole-grain rice",
    specs: [
      { label: "Broken", value: "5% max" },
      { label: "Moisture", value: "15% max" },
      { label: "Foreign matters", value: "0.1% max" },
      { label: "Average length of grain", value: "7.2 mm" },
    ],
  },
];

export function getRiceCatalogRow(slug: string): RiceCatalogRow | undefined {
  return RICE_CATALOG.find((row) => row.slug === slug);
}

export function getRiceSlugsBySubcategory(subcategory: RiceSubcategoryId): string[] {
  return RICE_CATALOG.filter((row) => row.subcategory === subcategory).map((row) => row.slug);
}

export function specsToCharacteristics(specs: RiceSpec[], origin?: string): string[] {
  const lines = specs.map((s) => `${s.label}: ${s.value}`);
  if (origin) lines.push(`Origin: ${origin}`);
  return lines;
}
