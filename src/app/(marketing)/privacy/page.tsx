import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { CareerPageSections } from "@/components/marketing/CareerPageSections";
import { getCareerFormPrefill } from "@/lib/auth/career-prefill";
import { getSession } from "@/lib/auth/session";
import { cmsField } from "@/lib/content/cms-field";
import { CAREERS_PAGE_HERO } from "@/lib/content/careers-page-content";
import { getEffectiveSectionFields, getPublishedPage } from "@/lib/content/page-content";
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
  const cms = await getPublishedPage("privacy");
  const heroFields = getEffectiveSectionFields(cms, "hero");
  const hero = resolveMarketingHeroImage(heroFields, "careers");

  return (
    <>
      <PageHero
        title={cmsField(heroFields, "title", CAREERS_PAGE_HERO.title)}
        brand={cmsField(heroFields, "eyebrow", CAREERS_PAGE_HERO.eyebrow)}
        description={cmsField(heroFields, "description", CAREERS_PAGE_HERO.description)}
        imageSrc={hero.src}
        imageAlt={hero.alt}
        youtubeVideoId={resolveMarketingHeroYoutube(heroFields)}
        primaryCta={{
          href: cmsField(heroFields, "primaryCtaHref", CAREERS_PAGE_HERO.primaryCta.href),
          label: cmsField(heroFields, "primaryCtaLabel", CAREERS_PAGE_HERO.primaryCta.label),
        }}
        secondaryCta={{
          href: cmsField(heroFields, "secondaryCtaHref", CAREERS_PAGE_HERO.secondaryCta.href),
          label: cmsField(heroFields, "secondaryCtaLabel", CAREERS_PAGE_HERO.secondaryCta.label),
        }}
      />
      <CareerPageSections signedIn={Boolean(session)} prefill={prefill} />
    </>
  );
}
