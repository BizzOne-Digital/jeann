/** Published bulk minimum order quantities (metric tonnes). */

export const CATEGORY_BULK_MINIMUM_MT: Record<string, number> = {
  "edible-oils": 500,
  sugar: 5000,
  "beans-and-pulses": 300,
  "rice-and-grains": 500,
  spices: 300,
};

/** Product-level overrides (e.g. nuts, cashews, black pepper within spices). */
export const PRODUCT_BULK_MINIMUM_MT: Record<string, number> = {
  cashews: 300,
  "black-pepper": 300,
  nutmeg: 300,
};

export function getBulkMinimumMt(categorySlug: string, productSlug?: string): number | null {
  if (productSlug && productSlug in PRODUCT_BULK_MINIMUM_MT) {
    return PRODUCT_BULK_MINIMUM_MT[productSlug];
  }
  return CATEGORY_BULK_MINIMUM_MT[categorySlug] ?? null;
}

export function getBulkMinOrderText(categorySlug: string, productSlug?: string): string {
  const mt = getBulkMinimumMt(categorySlug, productSlug);
  if (!mt) {
    return "Bulk supply only. Minimum volumes are discussed per enquiry with the trade desk.";
  }
  return `Bulk supply only. ${mt.toLocaleString("en-US")} MT minimum order.`;
}

export function getBulkOnlyNotice(): string {
  return "Finekarts supplies commodities in bulk volumes only. Retail and partial-lot enquiries cannot be processed.";
}
