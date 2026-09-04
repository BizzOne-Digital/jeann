import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { ResourcesHub } from "@/components/marketing/ResourcesHub";
import { ResourcesEnquiryCta } from "@/components/marketing/ResourcesSections";
import { cmsField } from "@/lib/content/cms-field";
import { getPublishedPage, getSectionFields } from "@/lib/content/page-content";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Trade documents, banking clauses, payment structures, and educational resources for qualified buyers. RFQs are submitted through the buyer portal after sign-in.",
};

export default async function ResourcesPage() {
  const cms = await getPublishedPage("resources");
  const hero = getSectionFields(cms, "hero");
  const intro = getSectionFields(cms, "intro");

  const introBody = `${cmsField(
    intro,
    "body",
    "Document sets vary by product, corridor, bank, and contract. Lists below are starting points for discussion — not guarantees that every document will be issued or accepted without amendment.",
  )}`;

  return (
    <>
      <PageHero
        title={cmsField(hero, "title", "Resources")}
        brand="Trade reference"
        description={cmsField(
          hero,
          "description",
          "Educational reference for trade documents, banking terminology, and payment structures. Browse by topic below — purchase requests are submitted through the buyer portal.",
        )}
        imageSrc="/images/home-2.png"
        imageAlt="International commodity trade"
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
      <ResourcesEnquiryCta />
    </>
  );
}
