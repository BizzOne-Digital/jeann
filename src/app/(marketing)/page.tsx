import { getCategories, SEED_INSIGHTS } from "@/lib/content/catalog";
import { getPartners } from "@/lib/content/partners-catalog";
import { getPublishedPage, getSectionFields } from "@/lib/content/page-content";
import { getPublishedTestimonials } from "@/lib/content/testimonials-catalog";
import { getHomeSectionImages } from "@/lib/content/home-images";
import { FoodSafetyAgencyMarquee } from "@/components/marketing/FoodSafetyAgencyMarquee";
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
  const categories = getCategories();
  const posts = SEED_INSIGHTS.slice(0, 3);
  const { home1, home2, home3 } = getHomeSectionImages();
  const cms = await getPublishedPage("home");
  const testimonials = await getPublishedTestimonials();
  const featuredTestimonial = testimonials[0] ?? null;

  return (
    <>
      <HomeHero cms={getSectionFields(cms, "hero")} />
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
