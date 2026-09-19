import type { Metadata } from "next";
import { CmsPageHero } from "@/components/marketing/CmsPageHero";
import { DisputeResolutionSections } from "@/components/marketing/DisputeResolutionSections";
import { collectCmsSections } from "@/lib/content/cms-collect";
import { cmsPageMetadata } from "@/lib/content/cms-page-metadata";
import { DISPUTE_HERO } from "@/lib/content/dispute-resolution-content";
import { getPublishedPage } from "@/lib/content/page-content";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("dispute-resolution", {
    title: "Dispute resolution & trade assurance",
    description:
      "How Finekarts approaches fairness, ICC-aligned dispute resolution, seller and buyer responsibilities, CIF trade insurance, documentation, and payment flexibility for bulk commodity buyers.",
  });
}

const DISPUTE_SECTION_IDS = [
  "fairness",
  "process-step-1",
  "process-step-2",
  "process-step-3",
  "responsibilities",
  "quality-safety",
  "documentation",
  "partners",
  "payments",
  "cta",
  "disclaimer",
];

export default async function DisputeResolutionPage() {
  const cmsPage = await getPublishedPage("dispute-resolution");
  const cms = collectCmsSections(cmsPage, DISPUTE_SECTION_IDS);

  return (
    <>
      <CmsPageHero
        pageSlug="dispute-resolution"
        defaults={{
          title: DISPUTE_HERO.title,
          description: DISPUTE_HERO.description,
          primaryCta: DISPUTE_HERO.primaryCta,
          secondaryCta: DISPUTE_HERO.secondaryCta,
        }}
      />
      <DisputeResolutionSections cms={cms} />
    </>
  );
}
