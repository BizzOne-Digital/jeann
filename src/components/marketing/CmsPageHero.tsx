import { PageHero, type PageHeroCta } from "@/components/marketing/PageHero";
import { cmsField } from "@/lib/content/cms-field";
import { getPublishedPage, getSectionFields } from "@/lib/content/page-content";

type Props = {
  pageSlug: string;
  sectionId?: string;
  tone?: "dark" | "light";
  size?: "full" | "standard";
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
  size = "standard",
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

  return (
    <PageHero
      tone={tone}
      size={size}
      title={cmsField(fields, "title", defaults.title)}
      description={cmsField(fields, "description", defaults.description)}
      primaryCta={primaryCta}
      secondaryCta={secondaryCta}
    />
  );
}
