import type { Metadata } from "next";
import { CmsPageHero } from "@/components/marketing/CmsPageHero";
import { PartnersPageSections } from "@/components/marketing/PartnersPageSections";
import { cmsField } from "@/lib/content/cms-field";
import { cmsPageMetadata } from "@/lib/content/cms-page-metadata";
import { getEffectiveSectionFields, getPublishedPage } from "@/lib/content/page-content";
import { PRODUCER_PARTNERS_HERO } from "@/lib/content/producer-partners-content";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("partners", {
    title: "Producer & manufacturer partnerships",
    description:
      "Partner with Finekarts on bulk commodity export programmes — scale, quality, and regulatory discipline for international buyers.",
  });
}

export default async function PartnersPage() {
  const cms = await getPublishedPage("partners");
  const intro = getEffectiveSectionFields(cms, "intro");

  return (
    <>
      <CmsPageHero
        pageSlug="partners"
        tone="dark"
        defaults={{
          title: PRODUCER_PARTNERS_HERO.title,
          description: PRODUCER_PARTNERS_HERO.lead,
          primaryCta: { href: "#partner-programmes", label: "Explore programmes →" },
          secondaryCta: { href: "/supplier-offer", label: "Supplier enquiry" },
        }}
      />
      <PartnersPageSections
        introNote={cmsField(intro, "note", PRODUCER_PARTNERS_HERO.note)}
      />
    </>
  );
}
