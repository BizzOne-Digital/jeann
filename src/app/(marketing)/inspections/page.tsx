import type { Metadata } from "next";
import { CmsPageHero } from "@/components/marketing/CmsPageHero";
import { InspectionPageSections } from "@/components/marketing/InspectionSections";
import { TraderRoleNotice } from "@/components/marketing/TraderRoleNotice";
import { collectCmsSections } from "@/lib/content/cms-collect";
import { cmsPageMetadata } from "@/lib/content/cms-page-metadata";
import { INSPECTIONS_HERO } from "@/lib/content/inspections-content";
import { getPublishedPage } from "@/lib/content/page-content";
import { INSPECTION_CMS_SECTION_IDS } from "@/lib/marketing/inspection-cms";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("inspections", {
    title: "Inspection in bulk commodity trade",
    description:
      "Finekarts sells bulk commodities and coordinates independent inspection firms when the PSA requires — quality, quantity, loading supervision, and laboratory analysis at origin or destination.",
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
      <section className="bg-white marketing-section pt-0">
        <div className="container-page -mt-4">
          <TraderRoleNotice />
        </div>
      </section>
      <InspectionPageSections cms={cms} />
    </>
  );
}
