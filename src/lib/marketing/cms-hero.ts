import { cmsField } from "@/lib/content/cms-field";
import {
  getPageHeroImage,
  type PageHeroImage,
  type PageHeroImageKey,
} from "@/lib/marketing/page-hero-images";

/** Hero image: CMS `heroImage` overrides the static page default. */
export function resolveMarketingHeroImage(
  cms: Record<string, string> | undefined,
  key: PageHeroImageKey,
): PageHeroImage {
  const fallback = getPageHeroImage(key);
  const override = cms?.heroImage?.trim();
  if (!override) return fallback;
  return { src: override, alt: fallback.alt };
}

export function resolveMarketingHeroYoutube(
  cms: Record<string, string> | undefined,
): string | undefined {
  const value = cmsField(cms, "youtubeVideoId", "");
  return value || undefined;
}
