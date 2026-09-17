import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { resolveMarketingHeroImage } from "@/lib/marketing/cms-hero";
import { resolveImageSrc } from "@/lib/media/resolve-image-src";
import { ResourcesHub } from "@/components/marketing/ResourcesHub";
import { cmsField } from "@/lib/content/cms-field";
import { getEffectiveSectionFields, getPublishedPage } from "@/lib/content/page-content";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Trade documents, banking clauses, payment structures, and educational resources for qualified buyers. RFQs are submitted through the buyer portal after sign-in.",
};

export default async function ResourcesPage() {
  const cms = await getPublishedPage("resources");
  const hero = getEffectiveSectionFields(cms, "hero");
  const intro = getEffectiveSectionFields(cms, "intro");

  const introBody = `${cmsField(
    intro,
    "body",
    "Document sets vary by product, corridor, bank, and contract. Lists below are starting points for discussion — not guarantees that every document will be issued or accepted without amendment.",
  )}`;

  const heroImage = resolveMarketingHeroImage(hero, "resources");

  return (
    <>
      <PageHero
        title={cmsField(hero, "title", "Resources")}
        brand="Trade reference"
        description={cmsField(
          hero,
          "description",
          "CIF trade insurance, PSA banking clauses, and payment structures come first — then document checklists. Purchase requests are submitted through the buyer portal.",
        )}
        imageSrc={resolveImageSrc(heroImage.src)}
        imageAlt={heroImage.alt}
        primaryCta={{
          href: "#resources-hub",
          label: "Browse topics →",
        }}
        secondaryCta={{
          href: cmsField(hero, "secondaryCtaHref", "/register/buyer"),
          label: cmsField(hero, "secondaryCtaLabel", "Register as buyer"),
        }}
      />

      <ResourcesHub introBody={introBody} />
    </>
  );
}
