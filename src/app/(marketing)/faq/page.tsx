import type { Metadata } from "next";
import Link from "next/link";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { PageHero } from "@/components/marketing/PageHero";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { buyerQuoteHref } from "@/lib/marketing/cta-links";
import { cmsField } from "@/lib/content/cms-field";
import { getPublishedFaqs } from "@/lib/content/faqs-catalog";
import { getPublishedPage, getSectionFields } from "@/lib/content/page-content";
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
  const heroFields = getSectionFields(cms, "hero");
  const hero = resolveMarketingHeroImage(heroFields, "faq");

  return (
    <>
      <PageHero
        title={cmsField(heroFields, "title", "Common questions")}
        description={cmsField(
          heroFields,
          "description",
          "Straight answers about how we trade. For deal-specific advice, contact the trade desk.",
        )}
        imageSrc={hero.src}
        imageAlt={hero.alt}
        youtubeVideoId={resolveMarketingHeroYoutube(heroFields)}
        primaryCta={{
          href: cmsField(heroFields, "primaryCtaHref", buyerQuoteHref()),
          label: cmsField(heroFields, "primaryCtaLabel", "Request a Quote →"),
        }}
        secondaryCta={{
          href: cmsField(heroFields, "secondaryCtaHref", "/contact"),
          label: cmsField(heroFields, "secondaryCtaLabel", "Contact us"),
        }}
      />

      <section className="bg-[#f3f1ec] py-16 lg:py-24">
        <div className="container-narrow">
          <FaqAccordion items={faqs} />
          <AnimatedSection className="mt-12 flex flex-wrap gap-3" delay={0.1}>
            <Link
              href={buyerQuoteHref()}
              className="focus-ring inline-flex items-center gap-2 marketing-btn-primary px-6 py-3.5 text-sm font-semibold"
            >
              Request a Quote <span aria-hidden>→</span>
            </Link>
            <Link
              href="/contact"
              className="focus-ring inline-flex items-center gap-2 rounded-md border border-[#001a3d]/25 px-6 py-3.5 text-sm font-semibold text-[#001a3d] transition hover:border-[#001a3d]"
            >
              Contact us
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
