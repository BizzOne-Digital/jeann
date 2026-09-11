import type { Metadata } from "next";
import { getAboutSectionImages } from "@/lib/content/about-images";
import { getHomeSectionImages } from "@/lib/content/home-images";
import { getSite } from "@/lib/content/catalog";
import { getPublishedPage, getSectionFields } from "@/lib/content/page-content";
import { AboutHub } from "@/components/marketing/AboutHub";
import { FoodSafetyAgencyMarquee } from "@/components/marketing/FoodSafetyAgencyMarquee";
import { AboutHero } from "@/components/marketing/AboutSections";

export const metadata: Metadata = {
  title: "About Finekarts",
  description:
    "Finekarts Incorporated connects qualified buyers and suppliers in bulk agricultural commodity trade through a risk-aware, documentation-led process.",
};

export default async function AboutPage() {
  const site = getSite();
  const { home3 } = getHomeSectionImages();
  const { teamStrategy, teamCollaboration } = getAboutSectionImages();
  const cms = await getPublishedPage("about");

  return (
    <>
      <AboutHero positioning={site.positioning} cms={getSectionFields(cms, "hero")} />
      <AboutHub
        teamStrategy={teamStrategy}
        teamCollaboration={teamCollaboration}
        home3={home3}
        cms={{
          whoWeAre: getSectionFields(cms, "who-we-are"),
          capabilities: getSectionFields(cms, "capabilities"),
          process: getSectionFields(cms, "process"),
          global: getSectionFields(cms, "global"),
        }}
      />
      <FoodSafetyAgencyMarquee />
    </>
  );
}
