import type { Metadata } from "next";
import { CmsPageHero } from "@/components/marketing/CmsPageHero";
import { PartnersPageSections } from "@/components/marketing/PartnersPageSections";
import { cmsField } from "@/lib/content/cms-field";
import { cmsPageMetadata } from "@/lib/content/cms-page-metadata";
import { getEffectiveSectionFields, getPublishedPage } from "@/lib/content/page-content";
import { getPartners, PARTNERS_PAGE_INTRO } from "@/lib/content/partners-catalog";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("partners", {
    title: "Independent inspection & certification firms",
    description:
      "Firms Finekarts may appoint on bulk commodity programmes — Finekarts is the trader, not the inspection company.",
  });
}

export default async function PartnersPage() {
  const partners = getPartners();
  const cms = await getPublishedPage("partners");
  const intro = getEffectiveSectionFields(cms, "intro");

  return (
    <>
      <CmsPageHero
        pageSlug="partners"
        tone="dark"
        defaults={{
          title: PARTNERS_PAGE_INTRO.title,
          description: PARTNERS_PAGE_INTRO.lead,
          primaryCta: { href: "#partners-list", label: "Browse partners →" },
          secondaryCta: { href: "/verification", label: "Due diligence overview" },
        }}
      />
      <PartnersPageSections
        partners={partners}
        introNote={cmsField(intro, "note", PARTNERS_PAGE_INTRO.note)}
        introBody={cmsField(
          intro,
          "body",
          "Profiles highlight inspection, testing, and certification relationships we coordinate on bulk commodity programmes — supporting buyer confidence alongside your contractual inspection scope.",
        )}
      />
    </>
  );
}
