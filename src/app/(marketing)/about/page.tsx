import type { Metadata } from "next";
import { AboutPageSections } from "@/components/marketing/AboutPageSections";
import { AboutHero } from "@/components/marketing/AboutSections";
import { ABOUT_HERO } from "@/lib/content/about-content";
import { getPublicSiteSettings } from "@/lib/content/site-settings-public";
import { getEffectiveSectionFields, getPublishedPage } from "@/lib/content/page-content";
import { collectCmsSections } from "@/lib/content/cms-collect";
import { resolveAboutSections } from "@/lib/marketing/about-cms";
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

  const content = resolveAboutSections(
    collectCmsSections(cms, [
      "intro",
      "highlights",
      "what-we-do",
      "supply-chain",
      "why-partner",
      "contact-band",
    ]),
  );

  return (
    <>
      <AboutHero cms={getEffectiveSectionFields(cms, "hero")} />
      <AboutPageSections
        email={site.email}
        phone={site.phone}
        phoneDisplay={site.phoneDisplay}
        content={content}
      />
    </>
  );
}
