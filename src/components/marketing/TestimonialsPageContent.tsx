import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";
import {
  TestimonialsGrid,
  TestimonialsSummaryBar,
  TrustpilotPlaceholder,
} from "@/components/marketing/TestimonialSections";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import {
  resolveMarketingHeroImage,
  resolveMarketingHeroYoutube,
} from "@/lib/marketing/cms-hero";
import { cmsField } from "@/lib/content/cms-field";
import {
  getPublishedTestimonials,
  getTestimonialSummary,
} from "@/lib/content/testimonials-catalog";
import { getEffectiveSectionFields, getPublishedPage } from "@/lib/content/page-content";

export async function TestimonialsPageContent() {
  const [testimonials, cms] = await Promise.all([
    getPublishedTestimonials(),
    getPublishedPage("testimonials"),
  ]);
  const heroFields = getEffectiveSectionFields(cms, "hero");
  const heroImage = resolveMarketingHeroImage(heroFields, "testimonials");
  const summary = getTestimonialSummary(testimonials);

  return (
    <>
      <PageHero
        title={cmsField(heroFields, "title", "What counterparties say")}
        description={cmsField(
          heroFields,
          "description",
          "Verified buyers and trade partners share their experience working with Finekarts — company, role, photo and review in one place.",
        )}
        imageSrc={heroImage.src}
        imageAlt={heroImage.alt}
        youtubeVideoId={resolveMarketingHeroYoutube(heroFields)}
        primaryCta={{
          href: cmsField(heroFields, "primaryCtaHref", "/contact"),
          label: cmsField(heroFields, "primaryCtaLabel", "Start a conversation →"),
        }}
        secondaryCta={{
          href: cmsField(heroFields, "secondaryCtaHref", "/resources"),
          label: cmsField(heroFields, "secondaryCtaLabel", "Trade resources"),
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
            <>
              <TrustpilotPlaceholder />
              <AnimatedSection className="mt-10 text-center text-sm text-[#666666]" delay={0.12}>
                Interested in working with Finekarts?{" "}
                <Link href="/contact" className="font-semibold text-[#c88e4a] underline">
                  Contact the trade desk
                </Link>
              </AnimatedSection>
            </>
          ) : null}
        </div>
      </section>
    </>
  );
}
