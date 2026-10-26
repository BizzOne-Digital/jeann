import { cmsField, cmsLines } from "@/lib/content/cms-field";
import { AGRICULTURE_IMAGES } from "@/lib/content/agriculture-images";
import { FOOD_SAFETY_MARKETS } from "@/lib/content/food-safety-agencies";
import {
  PRODUCT_QUALITY_COMPLIANCE,
  PRODUCTS_PAGE_SPOTLIGHTS,
} from "@/lib/content/product-quality-spotlights";

/**
 * `/products` CMS defaults (also the frontend fallbacks).
 * List formats: "Country | note" (markets), "Name | href | text" (spotlight cards), one item per line.
 */
export const PRODUCTS_BULK_MINIMUMS_DEFAULT = [
  "Spices, nuts & cashews — 300 MT min",
  "Beans — 300 MT min",
  "Rice — 500 MT min",
  "Edible oils — 500 MT min",
  "Sugar — 5,000 MT min",
];

export const PRODUCTS_FOOD_SAFETY_DEFAULTS = {
  eyebrow: "Food safety & standards",
  title: "Countries we trade most — shipments aligned with destination food safety requirements",
  items: FOOD_SAFETY_MARKETS.map((m) => `${m.country}: ${m.note}`).join("\n"),
};

export const PRODUCTS_SPOTLIGHT_DEFAULTS = {
  eyebrow: PRODUCT_QUALITY_COMPLIANCE.eyebrow,
  title: PRODUCT_QUALITY_COMPLIANCE.title,
  lead: PRODUCT_QUALITY_COMPLIANCE.lead,
  bullets: PRODUCT_QUALITY_COMPLIANCE.bullets.join("\n"),
  cards: PRODUCTS_PAGE_SPOTLIGHTS.map((c) => `${c.name} | ${c.href} | ${c.blurb}`).join("\n"),
};

export const PRODUCTS_CATALOG_EXTRA_DEFAULTS = {
  bulkLabel: "Bulk supply only",
  bulkText:
    "Finekarts supplies commodities in bulk volumes only. Minimum order quantities vary by category — see each section below.",
  minimums: PRODUCTS_BULK_MINIMUMS_DEFAULT.join("\n"),
  orderLabel: "Click here to ORDER",
};

export const PRODUCTS_CTA_IMAGE_DEFAULT = AGRICULTURE_IMAGES.combineHarvest.src;

function rows(raw: string, min: number) {
  return raw
    .split("\n")
    .map((l) => l.split("|").map((c) => c.trim()))
    .filter((c) => c.length >= min && c.slice(0, min).every(Boolean));
}

function parsedRows(sec: Record<string, string> | undefined, key: string, fallback: string, min: number) {
  const parsed = rows(cmsLines(sec, key, fallback.split("\n")).join("\n"), min);
  return parsed.length ? parsed : rows(fallback, min);
}

export function resolveProductsSpotlight(sec: Record<string, string> | undefined) {
  const d = PRODUCTS_SPOTLIGHT_DEFAULTS;
  return {
    eyebrow: cmsField(sec, "eyebrow", d.eyebrow),
    title: cmsField(sec, "title", d.title),
    lead: cmsField(sec, "lead", d.lead),
    bullets: cmsLines(sec, "bullets", d.bullets.split("\n")),
    cards: parsedRows(sec, "cards", d.cards, 3).map(([name, href, blurb]) => ({ name, href, blurb })),
  };
}
