import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";
import { getPageHeroImage } from "@/lib/marketing/page-hero-images";
import { TestimonialsGrid } from "@/components/marketing/TestimonialSections";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { getPublishedTestimonials } from "@/lib/content/testimonials-catalog";
import { getPublishedPage, getSectionFields } from "@/lib/content/page-content";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Client testimonials from verified counterparties working with Finekarts on global commodity trade.",
};

export default async function TestimonialsPage() {
  const [testimonials, cms] = await Promise.all([
    getPublishedTestimonials(),
    getPublishedPage("testimonials"),
  ]);
  const heroFields = getSectionFields(cms, "hero");
  const heroImage = getPageHeroImage("testimonials");

  return (
    <>
      <PageHero
        title={heroFields.title || "What counterparties say"}
        description={
          heroFields.description ||
          "Verified buyers and trade partners share their experience working with Finekarts."
        }
        imageSrc={heroImage.src}
        imageAlt={heroImage.alt}
        primaryCta={{ href: "/contact", label: "Start a conversation →" }}
        secondaryCta={{ href: "/resources", label: "Trade resources" }}
      />

      <section className="bg-[#f3f1ec] py-16 lg:py-24">
        <div className="container-page">
          <TestimonialsGrid testimonials={testimonials} />
          {testimonials.length > 0 ? (
            <AnimatedSection className="mt-10 text-center text-sm text-[#666666]" delay={0.12}>
              Interested in working with Finekarts?{" "}
              <Link href="/contact" className="font-semibold text-[#c88e4a] underline">
                Contact the trade desk
              </Link>
            </AnimatedSection>
          ) : null}
        </div>
      </section>
    </>
  );
}
