import { SEED_INSIGHTS } from "@/lib/content/catalog";
import { getPublicCategories } from "@/lib/content/catalog-server";
import { getPartners } from "@/lib/content/partners-catalog";
import { getPublishedPage, getSectionFields } from "@/lib/content/page-content";
import { getPublishedTestimonials } from "@/lib/content/testimonials-catalog";
import { FoodSafetyAgencyMarquee } from "@/components/marketing/FoodSafetyAgencyMarquee";
import { TradeAlertStrip } from "@/components/marketing/TradeAlertStrip";
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

export default async function HomePage() {
  const categories = await getPublicCategories();
  const posts = SEED_INSIGHTS.slice(0, 3);
  const cms = await getPublishedPage("home");
  const connection = getSectionFields(cms, "connection");
  const sourced = getSectionFields(cms, "sourced");
  const home1 = connection.image1 || "/images/home-1.png";
  const home2 = connection.image2 || "/images/home-2.png";
  const home3 = sourced.image || "/images/home-3.png";
  const testimonials = await getPublishedTestimonials();
  const featuredTestimonial = testimonials[0] ?? null;

  return (
    <>
      <HomeHero cms={getSectionFields(cms, "hero")} />
      <TradeAlertStrip />
      <ConnectionSection home1={home1} home2={home2} />
      <CommoditiesWeTrade categories={categories} />
      <SourcedResponsibly home3={home3} />
      <FoodSafetyAgencyMarquee />
      <ProcessTimeline />
      <ShippingTerms />
      <PartnersHomeTeaser partners={getPartners()} />
      <PackagingSection />
      <ReadyCtaBanner />
      <InsightsAndNotes posts={posts} featuredTestimonial={featuredTestimonial} />
    </>
  );
}
