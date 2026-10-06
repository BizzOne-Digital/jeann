import type { Metadata } from "next";
import { CmsPageHero } from "@/components/marketing/CmsPageHero";
import { ProductQualitySpotlight } from "@/components/marketing/ProductQualitySpotlight";
import { InsightsOperationalPage } from "@/components/marketing/InsightsOperationalPage";
import { INSIGHTS_PAGE_SPOTLIGHTS } from "@/lib/content/product-quality-spotlights";
import { cmsPageMetadata } from "@/lib/content/cms-page-metadata";
import { INSIGHTS_HERO } from "@/lib/content/operational-insights-content";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("insights", {
    title: "Global commodity trade & quality assurance",
    description: INSIGHTS_HERO.description,
  });
}

export default async function InsightsPage() {
  return (
    <>
      <CmsPageHero
        pageSlug="insights"
        defaults={{
          brand: INSIGHTS_HERO.eyebrow,
          title: INSIGHTS_HERO.title,
          description: INSIGHTS_HERO.description,
          primaryCta: INSIGHTS_HERO.primaryCta,
          secondaryCta: INSIGHTS_HERO.secondaryCta,
        }}
      />
      <ProductQualitySpotlight spotlights={INSIGHTS_PAGE_SPOTLIGHTS} variant="navy" />
      <InsightsOperationalPage />
    </>
  );
}
