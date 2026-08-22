export const EDIBLE_OIL_GRADES = ["Refined", "Crude", "Extra"] as const;
export type EdibleOilGrade = (typeof EDIBLE_OIL_GRADES)[number];

export type EdibleOilProduct = {
  slug: string;
  name: string;
};

export const EDIBLE_OIL_PRODUCTS: EdibleOilProduct[] = [
  { slug: "sunflower-oil", name: "Sunflower oil" },
  { slug: "palm-oil", name: "Palm oil" },
  { slug: "soybean-oil", name: "Soybean oil" },
  { slug: "rapeseed-oil", name: "Rapeseed oil" },
  { slug: "canola-oil", name: "Canola oil" },
  { slug: "corn-oil", name: "Corn oil" },
  { slug: "coconut-oil", name: "Coconut oil" },
  { slug: "olive-oil", name: "Olive oil" },
];

export const SHIPPING_INCOTERMS = ["FOB", "CIF", "CFR", "FCA", "Other / to discuss"] as const;

export const CONTRACT_YEAR_OPTIONS = [
  { value: 1, deliveries: 12, label: "1 year (12 monthly deliveries)" },
  { value: 2, deliveries: 24, label: "2 years (24 monthly deliveries)" },
] as const;

export function deliveriesForContractYears(years: 1 | 2) {
  return years === 2 ? 24 : 12;
}

export function formatProductLabel(productSlug: string, grade: EdibleOilGrade) {
  const product = EDIBLE_OIL_PRODUCTS.find((p) => p.slug === productSlug);
  return `${grade} ${product?.name ?? productSlug}`;
}
