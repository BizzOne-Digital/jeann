import type { MarketingContentBox } from "@/components/marketing/MarketingStorySection";
import { getCoffeeProductMarketing } from "@/lib/content/coffee-product-content";
import { getOilProductMarketing } from "@/lib/content/oil-product-content";
import { getPulseProductMarketing } from "@/lib/content/pulse-product-content";
import { getRiceProductMarketing } from "@/lib/content/rice-product-content";
import { getSpiceProductMarketing } from "@/lib/content/spice-product-content";
import { getDefaultProductMarketing, getSugarProductMarketing } from "@/lib/content/sugar-product-content";

/**
 * The sections shown at the bottom of a public product page when no admin text is set.
 * The order matches the public product page, so the admin sees exactly what is live.
 */
export function getBuiltInContentBoxes(
  slug: string,
  productName: string,
  categoryName: string,
): MarketingContentBox[] {
  return (
    getSugarProductMarketing(slug)?.contentBoxes ??
    getOilProductMarketing(slug)?.contentBoxes ??
    getPulseProductMarketing(slug)?.contentBoxes ??
    getRiceProductMarketing(slug)?.contentBoxes ??
    getSpiceProductMarketing(slug)?.contentBoxes ??
    getCoffeeProductMarketing(slug)?.contentBoxes ??
    getDefaultProductMarketing(productName, categoryName).contentBoxes
  );
}
