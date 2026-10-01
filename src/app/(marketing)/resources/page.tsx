import type { Metadata } from "next";
import { CmsPageHero } from "@/components/marketing/CmsPageHero";
import { ResourcesPageSections } from "@/components/marketing/ResourcesPageSections";
import { cmsField } from "@/lib/content/cms-field";
import { cmsPageMetadata } from "@/lib/content/cms-page-metadata";
import { getEffectiveSectionFields, getPublishedPage } from "@/lib/content/page-content";
import { RESOURCES_PAGE_HERO } from "@/lib/content/resources-page-content";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("resources", {
    title: "Resources",
    description:
      "Trade documents, banking clauses, payment structures, and educational resources for qualified buyers. RFQs are submitted through the buyer portal after sign-in.",
  });
}

export default async function ResourcesPage() {
  const cms = await getPublishedPage("resources");
  const hero = getEffectiveSectionFields(cms, "hero");
  const intro = getEffectiveSectionFields(cms, "intro");

  const introBody = `${cmsField(
    intro,
    "body",
    "Document sets vary by product, corridor, bank, and contract. Lists below are starting points for discussion — not guarantees that every document will be issued or accepted without amendment.",
  )}`;

  return (
    <>
      <CmsPageHero
        pageSlug="resources"
        defaults={{
          brand: RESOURCES_PAGE_HERO.eyebrow,
          title: cmsField(hero, "title", RESOURCES_PAGE_HERO.title),
          description: cmsField(hero, "description", RESOURCES_PAGE_HERO.description),
          primaryCta: {
            href: cmsField(hero, "primaryCtaHref", RESOURCES_PAGE_HERO.primaryCta.href),
            label: cmsField(hero, "primaryCtaLabel", RESOURCES_PAGE_HERO.primaryCta.label),
          },
          secondaryCta: {
            href: cmsField(hero, "secondaryCtaHref", RESOURCES_PAGE_HERO.secondaryCta.href),
            label: cmsField(hero, "secondaryCtaLabel", RESOURCES_PAGE_HERO.secondaryCta.label),
          },
        }}
      />
      <ResourcesPageSections introBody={introBody} />
    </>
  );
}
