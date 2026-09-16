import { PageHero, type PageHeroCta } from "@/components/marketing/PageHero";
import { cmsField } from "@/lib/content/cms-field";
import { getPublishedPage, getSectionFields } from "@/lib/content/page-content";
import {
  pageSlugToHeroImageKey,
  resolveMarketingHeroImage,
  resolveMarketingHeroYoutube,
} from "@/lib/marketing/cms-hero";
import { resolveImageSrc } from "@/lib/media/resolve-image-src";

type Props = {
  pageSlug: string;
  sectionId?: string;
  tone?: "dark" | "light";
  defaults: {
    title: string;
    description: string;
    primaryCta?: PageHeroCta;
    secondaryCta?: PageHeroCta;
  };
};

export async function CmsPageHero({
  pageSlug,
  sectionId = "hero",
  tone = "dark",
  defaults,
}: Props) {
  const page = await getPublishedPage(pageSlug);
  const fields = getSectionFields(page, sectionId);

  const primaryCta = defaults.primaryCta
    ? {
        label: cmsField(fields, "primaryCtaLabel", defaults.primaryCta.label),
        href: cmsField(fields, "primaryCtaHref", defaults.primaryCta.href),
      }
    : undefined;

  const secondaryCta = defaults.secondaryCta
    ? {
        label: cmsField(fields, "secondaryCtaLabel", defaults.secondaryCta.label),
        href: cmsField(fields, "secondaryCtaHref", defaults.secondaryCta.href),
      }
    : undefined;

  const heroKey = pageSlugToHeroImageKey(pageSlug);
  const heroImage = resolveMarketingHeroImage(fields, heroKey);
  const imageSrc = resolveImageSrc(heroImage.src);

  return (
    <PageHero
      tone={tone}
      title={cmsField(fields, "title", defaults.title)}
      description={cmsField(fields, "description", defaults.description)}
      imageSrc={imageSrc}
      imageAlt={heroImage.alt}
      youtubeVideoId={resolveMarketingHeroYoutube(fields)}
      primaryCta={primaryCta}
      secondaryCta={secondaryCta}
    />
  );
}
