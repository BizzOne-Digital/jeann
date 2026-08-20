import { getCategories, SEED_INSIGHTS } from "@/lib/content/catalog";
import { getPartners } from "@/lib/content/partners-catalog";
import { getHomeSectionImages } from "@/lib/content/home-images";
import { PartnersHomeTeaser } from "@/components/marketing/PartnerSections";
import {
  HomeHero,
  ConnectionSection,
  CommoditiesWeTrade,
  SourcedResponsibly,
  ProcessTimeline,
  ShippingTerms,
  PackagingSection,
  ReadyCtaBanner,
  InsightsAndNotes,
} from "@/components/marketing/HomeSections";

export default function HomePage() {
  const categories = getCategories();
  const posts = SEED_INSIGHTS.slice(0, 3);
  const { home1, home2, home3 } = getHomeSectionImages();

  return (
    <>
      <HomeHero />
      <ConnectionSection home1={home1} home2={home2} />
      <CommoditiesWeTrade categories={categories} />
      <SourcedResponsibly home3={home3} />
      <ProcessTimeline />
      <ShippingTerms />
      <PartnersHomeTeaser partners={getPartners()} />
      <PackagingSection />
      <ReadyCtaBanner />
      <InsightsAndNotes posts={posts} />
    </>
  );
}
