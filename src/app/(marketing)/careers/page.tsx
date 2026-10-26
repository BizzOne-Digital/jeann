import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { CareerPageSections } from "@/components/marketing/CareerPageSections";
import { getCareerFormPrefill } from "@/lib/auth/career-prefill";
import { getSession } from "@/lib/auth/session";
import { collectCmsSections } from "@/lib/content/cms-collect";
import { getPublishedCareersPage } from "@/lib/content/page-content";
import { buildCareersContent, CAREERS_CMS_SECTION_IDS } from "@/lib/marketing/careers-cms";
import { cmsMerged, CAREERS_HERO_DEFAULTS } from "@/lib/marketing/simple-pages-cms";
import {
  resolveMarketingHeroImage,
  resolveMarketingHeroYoutube,
} from "@/lib/marketing/cms-hero";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Finekarts Incorporated. Create a career portal account and submit the full application, HR questionnaire, and candidate dossier.",
};

export default async function CareersPage() {
  const session = await getSession();
  const prefill = session ? await getCareerFormPrefill(session) : undefined;
  const cms = await getPublishedCareersPage();
  const sections = collectCmsSections(cms, [...CAREERS_CMS_SECTION_IDS]);
  const heroFields = sections.hero;
  const heroText = cmsMerged(sections, "hero", CAREERS_HERO_DEFAULTS);
  const content = buildCareersContent(sections);
  const hero = resolveMarketingHeroImage(heroFields, "careers");

  return (
    <>
      <PageHero
        title={heroText.title}
        brand={heroText.eyebrow}
        description={heroText.description}
        imageSrc={hero.src}
        imageAlt={hero.alt}
        youtubeVideoId={resolveMarketingHeroYoutube(heroFields)}
        primaryCta={{
          href: heroText.primaryCtaHref,
          label: heroText.primaryCtaLabel,
        }}
        secondaryCta={{
          href: heroText.secondaryCtaHref,
          label: heroText.secondaryCtaLabel,
        }}
      />
      <CareerPageSections signedIn={Boolean(session)} prefill={prefill} content={content} />
    </>
  );
}
