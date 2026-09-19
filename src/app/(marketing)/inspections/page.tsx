import type { Metadata } from "next";
import { CmsPageHero } from "@/components/marketing/CmsPageHero";
import { InspectionPageSections } from "@/components/marketing/InspectionSections";
import { collectCmsSections } from "@/lib/content/cms-collect";
import { cmsPageMetadata } from "@/lib/content/cms-page-metadata";
import { INSPECTIONS_HERO } from "@/lib/content/inspections-content";
import { getPublishedPage } from "@/lib/content/page-content";
import { INSPECTION_CMS_SECTION_IDS } from "@/lib/marketing/inspection-cms";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("inspections", {
    title: "Independent Commodity Inspection Services",
    description:
      "Finekarts coordinates independent inspection, testing, and verification at origin and destination — supplier verification, quality, quantity, loading supervision, and laboratory analysis.",
  });
}

export default async function InspectionsPage() {
  const cmsPage = await getPublishedPage("inspections");
  const cms = collectCmsSections(cmsPage, [...INSPECTION_CMS_SECTION_IDS]);

  return (
    <>
      <CmsPageHero
        pageSlug="inspections"
        defaults={{
          title: INSPECTIONS_HERO.title,
          description: INSPECTIONS_HERO.description,
          primaryCta: INSPECTIONS_HERO.primaryCta,
          secondaryCta: INSPECTIONS_HERO.secondaryCta,
        }}
      />
      <InspectionPageSections cms={cms} />
    </>
  );
}
