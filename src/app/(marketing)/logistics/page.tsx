import type { Metadata } from "next";
import { CmsPageHero } from "@/components/marketing/CmsPageHero";
import { LogisticsPageSections } from "@/components/marketing/LogisticsPageSections";
import { collectCmsSections } from "@/lib/content/cms-collect";
import { cmsPageMetadata } from "@/lib/content/cms-page-metadata";
import { LOGISTICS_HERO } from "@/lib/content/logistics-content";
import { getPublishedPage } from "@/lib/content/page-content";
import { buildLogisticsContent, LOGISTICS_CMS_SECTION_IDS } from "@/lib/marketing/logistics-cms";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("logistics", {
    title: "Trade logistics coordination",
    description:
      "Finekarts is a bulk commodity trader that coordinates FOB and CIF shipping, documentation, and tracking with carriers and forwarders — not a freight operator.",
  });
}

export default async function LogisticsPage() {
  const cmsPage = await getPublishedPage("logistics");
  const cms = collectCmsSections(cmsPage, [...LOGISTICS_CMS_SECTION_IDS]);
  const content = buildLogisticsContent(cms);

  return (
    <>
      <CmsPageHero
        pageSlug="logistics"
        defaults={{
          title: LOGISTICS_HERO.title,
          description: LOGISTICS_HERO.description,
          primaryCta: LOGISTICS_HERO.primaryCta,
          secondaryCta: LOGISTICS_HERO.secondaryCta,
        }}
      />
      <LogisticsPageSections content={content} />
    </>
  );
}
