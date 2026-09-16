import { cmsField } from "@/lib/content/cms-field";
import { resolveImageSrc } from "@/lib/media/resolve-image-src";
import {
  getPageHeroImage,
  PAGE_HERO_IMAGES,
  type PageHeroImage,
  type PageHeroImageKey,
} from "@/lib/marketing/page-hero-images";

const PAGE_SLUG_TO_HERO_KEY: Record<string, PageHeroImageKey> = {
  "buyer-request": "buyerRequest",
  "supplier-offer": "supplierOffer",
  "buyer-terms": "buyerTerms",
  privacy: "careers",
  terms: "careers",
};

/** Map CMS page slug to the static hero image registry key. */
export function pageSlugToHeroImageKey(pageSlug: string): PageHeroImageKey {
  if (pageSlug in PAGE_HERO_IMAGES) {
    return pageSlug as PageHeroImageKey;
  }
  return PAGE_SLUG_TO_HERO_KEY[pageSlug] ?? "home";
}

/** Hero image: CMS `heroImage` overrides the static page default. */
export function resolveMarketingHeroImage(
  cms: Record<string, string> | undefined,
  key: PageHeroImageKey,
): PageHeroImage {
  const fallback = getPageHeroImage(key);
  const override = cms?.heroImage?.trim();
  if (!override) return fallback;
  return { src: resolveImageSrc(override), alt: fallback.alt };
}

export function resolveMarketingHeroYoutube(
  cms: Record<string, string> | undefined,
): string | undefined {
  const value = cmsField(cms, "youtubeVideoId", "");
  return value || undefined;
}
