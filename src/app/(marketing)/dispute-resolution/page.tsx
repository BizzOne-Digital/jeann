import type { Metadata } from "next";
import { DisputeResolutionSections } from "@/components/marketing/DisputeResolutionSections";
import { PageHero } from "@/components/marketing/PageHero";
import { DISPUTE_HERO } from "@/lib/content/dispute-resolution-content";
import { getPageHeroImage } from "@/lib/marketing/page-hero-images";

export const metadata: Metadata = {
  title: "Dispute resolution & trade assurance",
  description:
    "How Finekarts approaches fairness, ICC-aligned dispute resolution, seller and buyer responsibilities, CIF trade insurance, documentation, and payment flexibility for bulk commodity buyers.",
};

export default function DisputeResolutionPage() {
  const heroImage = getPageHeroImage("disputeResolution");

  return (
    <>
      <PageHero
        title={DISPUTE_HERO.title}
        brand={DISPUTE_HERO.eyebrow}
        description={DISPUTE_HERO.description}
        imageSrc={heroImage.src}
        imageAlt={heroImage.alt}
        primaryCta={DISPUTE_HERO.primaryCta}
        secondaryCta={DISPUTE_HERO.secondaryCta}
      />
      <DisputeResolutionSections />
    </>
  );
}
