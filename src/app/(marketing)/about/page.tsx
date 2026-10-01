import type { Metadata } from "next";
import { AboutPageSections } from "@/components/marketing/AboutPageSections";
import { AboutHero } from "@/components/marketing/AboutSections";
import { ABOUT_HERO } from "@/lib/content/about-content";
import { getPublicSiteSettings } from "@/lib/content/site-settings-public";
import { getEffectiveSectionFields, getPublishedPage } from "@/lib/content/page-content";
import { cmsPageMetadata } from "@/lib/content/cms-page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("about", {
    title: "About Finekarts Incorporated",
    description: ABOUT_HERO.description,
  });
}

export default async function AboutPage() {
  const site = await getPublicSiteSettings();
  const cms = await getPublishedPage("about");

  return (
    <>
      <AboutHero cms={getEffectiveSectionFields(cms, "hero")} />
      <AboutPageSections
        email={site.email}
        phone={site.phone}
        phoneDisplay={site.phoneDisplay}
      />
    </>
  );
}
