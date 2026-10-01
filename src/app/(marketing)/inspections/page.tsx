import type { Metadata } from "next";
import { CmsPageHero } from "@/components/marketing/CmsPageHero";
import { InspectionPageSections } from "@/components/marketing/InspectionSections";
import { cmsPageMetadata } from "@/lib/content/cms-page-metadata";
import { INSPECTIONS_HERO } from "@/lib/content/inspections-operational-content";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("inspections", {
    title: "Inspections overview",
    description: INSPECTIONS_HERO.description,
  });
}

export default async function InspectionsPage() {
  return (
    <>
      <CmsPageHero
        pageSlug="inspections"
        defaults={{
          brand: INSPECTIONS_HERO.eyebrow,
          title: INSPECTIONS_HERO.title,
          description: INSPECTIONS_HERO.description,
          primaryCta: INSPECTIONS_HERO.primaryCta,
          secondaryCta: INSPECTIONS_HERO.secondaryCta,
        }}
      />
      <InspectionPageSections />
    </>
  );
}
