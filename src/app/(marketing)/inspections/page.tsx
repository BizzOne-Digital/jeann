import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { InspectionPageSections } from "@/components/marketing/InspectionSections";
import { getPageHeroImage } from "@/lib/marketing/page-hero-images";
import { INSPECTIONS_HERO } from "@/lib/content/inspections-content";

export const metadata: Metadata = {
  title: "Independent Commodity Inspection Services",
  description:
    "Finekarts coordinates independent inspection, testing, and verification at origin and destination — supplier verification, quality, quantity, loading supervision, and laboratory analysis.",
};

export default function InspectionsPage() {
  const heroImage = getPageHeroImage("inspections");

  return (
    <>
      <PageHero
        title={INSPECTIONS_HERO.title}
        brand={INSPECTIONS_HERO.eyebrow}
        description={INSPECTIONS_HERO.description}
        imageSrc={heroImage.src}
        imageAlt={heroImage.alt}
        primaryCta={INSPECTIONS_HERO.primaryCta}
        secondaryCta={INSPECTIONS_HERO.secondaryCta}
      />

      <InspectionPageSections />
    </>
  );
}
