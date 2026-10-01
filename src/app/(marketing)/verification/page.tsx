import type { Metadata } from "next";
import { CmsPageHero } from "@/components/marketing/CmsPageHero";
import { DueDiligencePageSections } from "@/components/marketing/DueDiligencePageSections";
import { cmsPageMetadata } from "@/lib/content/cms-page-metadata";
import { DUE_DILIGENCE_HERO } from "@/lib/content/due-diligence-page-content";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("verification", {
    title: "Due diligence profile & verification",
    description: DUE_DILIGENCE_HERO.description,
  });
}

export default async function VerificationPage() {
  return (
    <>
      <CmsPageHero
        pageSlug="verification"
        defaults={{
          brand: DUE_DILIGENCE_HERO.eyebrow,
          title: DUE_DILIGENCE_HERO.title,
          description: DUE_DILIGENCE_HERO.description,
          primaryCta: DUE_DILIGENCE_HERO.primaryCta,
          secondaryCta: DUE_DILIGENCE_HERO.secondaryCta,
        }}
      />
      <DueDiligencePageSections />
    </>
  );
}
