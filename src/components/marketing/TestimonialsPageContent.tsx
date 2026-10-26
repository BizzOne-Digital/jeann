import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";
import {
  TestimonialsGrid,
  TestimonialsSummaryBar,
} from "@/components/marketing/TestimonialSections";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import {
  resolveMarketingHeroImage,
  resolveMarketingHeroYoutube,
} from "@/lib/marketing/cms-hero";
import { collectCmsSections } from "@/lib/content/cms-collect";
import {
  cmsMerged,
  TESTIMONIALS_CTA_DEFAULTS,
  TESTIMONIALS_HERO_DEFAULTS,
} from "@/lib/marketing/simple-pages-cms";
import {
  getPublishedTestimonials,
  getTestimonialSummary,
} from "@/lib/content/testimonials-catalog";
import { getPublishedPage } from "@/lib/content/page-content";

export async function TestimonialsPageContent() {
  const [testimonials, cms] = await Promise.all([
    getPublishedTestimonials(),
    getPublishedPage("testimonials"),
  ]);
  const sections = collectCmsSections(cms, ["hero", "cta"]);
  const heroFields = sections.hero;
  const heroText = cmsMerged(sections, "hero", TESTIMONIALS_HERO_DEFAULTS);
  const ctaText = cmsMerged(sections, "cta", TESTIMONIALS_CTA_DEFAULTS);
  const heroImage = resolveMarketingHeroImage(heroFields, "testimonials");
  const summary = getTestimonialSummary(testimonials);

  return (
    <>
      <PageHero
        title={heroText.title}
        description={heroText.description}
        imageSrc={heroImage.src}
        imageAlt={heroImage.alt}
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
        <div className="container-page">
          <TestimonialsSummaryBar
            count={summary.count}
            averageRating={summary.averageRating}
          />
          <TestimonialsGrid testimonials={testimonials} />
          {testimonials.length > 0 ? (
            <AnimatedSection className="mt-10 text-center text-sm text-[#666666]" delay={0.12}>
              {ctaText.prompt}{" "}
              <Link href={ctaText.linkHref} className="font-semibold text-[#c88e4a] underline">
                {ctaText.linkLabel}
              </Link>
            </AnimatedSection>
          ) : null}
        </div>
      </section>
    </>
  );
}
