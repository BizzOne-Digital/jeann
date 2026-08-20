import type { Metadata } from "next";
import { getHomeSectionImages } from "@/lib/content/home-images";
import { getSite } from "@/lib/content/catalog";
import { getPublishedPage, getSectionFields } from "@/lib/content/page-content";
import {
  AboutHero,
  AboutWhoWeAre,
  AboutCapabilities,
  AboutProcess,
  AboutGlobal,
  AboutCta,
} from "@/components/marketing/AboutSections";

export const metadata: Metadata = {
  title: "About Finekarts",
  description:
    "Finekarts Incorporated connects qualified buyers and suppliers in bulk agricultural commodity trade through a risk-aware, documentation-led process.",
};

export default async function AboutPage() {
  const site = getSite();
  const { home1, home2, home3 } = getHomeSectionImages();
  const cms = await getPublishedPage("about");

  return (
    <>
      <AboutHero positioning={site.positioning} cms={getSectionFields(cms, "hero")} />
      <AboutWhoWeAre home1={home1} home2={home2} cms={getSectionFields(cms, "who-we-are")} />
      <AboutCapabilities cms={getSectionFields(cms, "capabilities")} />
      <AboutProcess cms={getSectionFields(cms, "process")} />
      <AboutGlobal home3={home3} cms={getSectionFields(cms, "global")} />
      <AboutCta
        email={site.email}
        phone={site.phone}
        phoneDisplay={site.phoneDisplay}
        cms={getSectionFields(cms, "cta")}
      />
    </>
  );
}
