import { getPublishedInsights } from "@/lib/content/insights-catalog";
import { getPublicCategories } from "@/lib/content/catalog-server";
import { getPartners } from "@/lib/content/partners-catalog";
import { getEffectiveSectionFields, getPublishedPage } from "@/lib/content/page-content";
import { getPublishedTestimonials } from "@/lib/content/testimonials-catalog";
import { FoodSafetyAgencyMarquee } from "@/components/marketing/FoodSafetyAgencyMarquee";
import { HomeLogisticsImageBand } from "@/components/marketing/HomeLogisticsImageBand";
import { PartnersHomeTeaser } from "@/components/marketing/PartnerSections";
import type { Metadata } from "next";
import { cmsPageMetadata } from "@/lib/content/cms-page-metadata";
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

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("home", {
    title: "Finekarts — Bulk agricultural commodities",
    description:
      "Finekarts supplies bulk agricultural commodities to qualified buyers with verification, logistics, and bankable trade terms.",
  });
}

export default async function HomePage() {
  const categories = await getPublicCategories();
  const posts = (await getPublishedInsights()).slice(0, 3);
  const cms = await getPublishedPage("home");
  const connection = getEffectiveSectionFields(cms, "connection");
  const sourced = getEffectiveSectionFields(cms, "sourced");
  const home1 = connection.image1 || "/images/home-1.png";
  const home2 = connection.image2 || "/images/home-2.png";
  const home3 = sourced.image || "/images/home-3.png";
  const testimonials = await getPublishedTestimonials();
  const featuredTestimonial = testimonials[0] ?? null;

  return (
    <>
      <HomeHero cms={getEffectiveSectionFields(cms, "hero")} />
      <ConnectionSection
        home1={home1}
        home2={home2}
        cms={connection}
      />
      <CommoditiesWeTrade categories={categories} />
      <SourcedResponsibly home3={home3} />
      <HomeLogisticsImageBand />
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
