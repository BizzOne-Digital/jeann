import type { Metadata } from "next";
import { getAboutSectionImages } from "@/lib/content/about-images";
import { getHomeSectionImages } from "@/lib/content/home-images";
import { getSite } from "@/lib/content/catalog";
import { getEffectiveSectionFields, getPublishedPage } from "@/lib/content/page-content";
import { AboutHub } from "@/components/marketing/AboutHub";
import { FoodSafetyAgencyMarquee } from "@/components/marketing/FoodSafetyAgencyMarquee";
import { AboutHero } from "@/components/marketing/AboutSections";

export const metadata: Metadata = {
  title: "About Finekarts",
  description:
    "Finekarts Incorporated supplies bulk agricultural commodities for sale to qualified buyers — verification, inspection, logistics, trade insurance, and bankable ICC-aligned transactions.",
};

export default async function AboutPage() {
  const site = getSite();
  const { home3 } = getHomeSectionImages();
  const { teamStrategy, teamCollaboration } = getAboutSectionImages();
  const cms = await getPublishedPage("about");

  return (
    <>
      <AboutHero positioning={site.positioning} cms={getEffectiveSectionFields(cms, "hero")} />
      <AboutHub
        teamStrategy={teamStrategy}
        teamCollaboration={teamCollaboration}
        home3={home3}
        cms={{
          whoWeAre: getEffectiveSectionFields(cms, "who-we-are"),
          capabilities: getEffectiveSectionFields(cms, "capabilities"),
          process: getEffectiveSectionFields(cms, "process"),
          global: getEffectiveSectionFields(cms, "global"),
        }}
      />
      <FoodSafetyAgencyMarquee />
    </>
  );
}
