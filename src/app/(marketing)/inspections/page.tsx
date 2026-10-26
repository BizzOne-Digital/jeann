import type { Metadata } from "next";
import { CmsPageHero } from "@/components/marketing/CmsPageHero";
import { InspectionPageSections } from "@/components/marketing/InspectionSections";
import { cmsPageMetadata } from "@/lib/content/cms-page-metadata";
import { collectCmsSections } from "@/lib/content/cms-collect";
import { getPublishedPage } from "@/lib/content/page-content";
import {
  buildInspectionContent,
  INSPECTION_CMS_SECTION_IDS,
} from "@/lib/marketing/inspection-cms";
import { INSPECTIONS_HERO } from "@/lib/content/inspections-operational-content";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("inspections", {
    title: "Inspections overview",
    description: INSPECTIONS_HERO.description,
  });
}

export default async function InspectionsPage() {
  const cmsPage = await getPublishedPage("inspections");
  const cms = collectCmsSections(cmsPage, [...INSPECTION_CMS_SECTION_IDS]);
  const content = buildInspectionContent(cms);
  return (
    <>
      <CmsPageHero
        pageSlug="inspections"
        overlayPreset="inspections"
        defaults={{
          brand: INSPECTIONS_HERO.eyebrow,
          title: INSPECTIONS_HERO.title,
          description: INSPECTIONS_HERO.description,
          primaryCta: INSPECTIONS_HERO.primaryCta,
          secondaryCta: INSPECTIONS_HERO.secondaryCta,
        }}
      />
      <InspectionPageSections content={content} />
    </>
  );
}
