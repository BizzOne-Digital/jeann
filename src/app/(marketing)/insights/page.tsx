import type { Metadata } from "next";
import { CmsPageHero } from "@/components/marketing/CmsPageHero";
import { ProductQualitySpotlight } from "@/components/marketing/ProductQualitySpotlight";
import { InsightsOperationalPage } from "@/components/marketing/InsightsOperationalPage";
import { collectCmsSections } from "@/lib/content/cms-collect";
import { getPublishedPage } from "@/lib/content/page-content";
import { buildInsightsContent, INSIGHTS_CMS_SECTION_IDS } from "@/lib/marketing/insights-cms";
import { cmsPageMetadata } from "@/lib/content/cms-page-metadata";
import { INSIGHTS_HERO } from "@/lib/content/operational-insights-content";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("insights", {
    title: "Global commodity trade & quality assurance",
    description: INSIGHTS_HERO.description,
  });
}

export default async function InsightsPage() {
  const cmsPage = await getPublishedPage("insights");
  const cms = collectCmsSections(cmsPage, [...INSIGHTS_CMS_SECTION_IDS]);
  const content = buildInsightsContent(cms);
  return (
    <>
      <CmsPageHero
        pageSlug="insights"
        size="compact"
        defaults={{
          brand: INSIGHTS_HERO.eyebrow,
          title: INSIGHTS_HERO.title,
          description: INSIGHTS_HERO.description,
          primaryCta: INSIGHTS_HERO.primaryCta,
          secondaryCta: INSIGHTS_HERO.secondaryCta,
        }}
      />
      <div className="insights-page-density">
        <ProductQualitySpotlight
          spotlights={content.qualityBand.spotlights}
          content={{ ...content.qualityBand, cards: content.qualityBand.spotlights }}
          variant="navy"
          compact
        />
        <InsightsOperationalPage content={content} />
      </div>
    </>
  );
}
