import type { Metadata } from "next";
import { getHomeSectionImages } from "@/lib/content/home-images";
import { getSite } from "@/lib/content/catalog";
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

export default function AboutPage() {
  const site = getSite();
  const { home1, home2, home3 } = getHomeSectionImages();

  return (
    <>
      <AboutHero positioning={site.positioning} />
      <AboutWhoWeAre home1={home1} home2={home2} />
      <AboutCapabilities />
      <AboutProcess />
      <AboutGlobal home3={home3} />
      <AboutCta email={site.email} phone={site.phone} phoneDisplay={site.phoneDisplay} />
    </>
  );
}
