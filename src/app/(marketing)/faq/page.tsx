import type { Metadata } from "next";
import Link from "next/link";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { PageHero } from "@/components/marketing/PageHero";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { collectCmsSections } from "@/lib/content/cms-collect";
import { cmsMerged, FAQ_CTA_DEFAULTS, FAQ_HERO_DEFAULTS } from "@/lib/marketing/simple-pages-cms";
import { getPublishedFaqs } from "@/lib/content/faqs-catalog";
import { getPublishedPage } from "@/lib/content/page-content";
import {
  resolveMarketingHeroImage,
  resolveMarketingHeroYoutube,
} from "@/lib/marketing/cms-hero";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Finekarts RFQs, Incoterms, pricing, and buyer access.",
};

export default async function FaqPage() {
  const [faqs, cms] = await Promise.all([getPublishedFaqs(), getPublishedPage("faq")]);
  const sections = collectCmsSections(cms, ["hero", "cta"]);
  const heroFields = sections.hero;
  const heroText = cmsMerged(sections, "hero", FAQ_HERO_DEFAULTS);
  const ctaText = cmsMerged(sections, "cta", FAQ_CTA_DEFAULTS);
  const hero = resolveMarketingHeroImage(heroFields, "faq");

  return (
    <>
      <PageHero
        title={heroText.title}
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

      <section className="bg-[#f3f1ec] py-16 lg:py-24">
        <div className="container-narrow">
          <FaqAccordion items={faqs} />
          <AnimatedSection className="mt-12 flex flex-wrap gap-3" delay={0.1}>
            <Link
              href={ctaText.primaryHref}
              className="focus-ring inline-flex items-center gap-2 marketing-btn-primary px-6 py-3.5 text-sm font-semibold"
            >
              {ctaText.primaryLabel} <span aria-hidden>→</span>
            </Link>
            <Link
              href={ctaText.secondaryHref}
              className="focus-ring inline-flex items-center gap-2 rounded-md border border-[#001a3d]/25 px-6 py-3.5 text-sm font-semibold text-[#001a3d] transition hover:border-[#001a3d]"
            >
              {ctaText.secondaryLabel}
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
