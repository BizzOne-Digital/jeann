import type { Metadata } from "next";
import { CmsPageHero } from "@/components/marketing/CmsPageHero";
import { PackagingPageSections } from "@/components/marketing/PackagingPageSections";
import { cmsPageMetadata } from "@/lib/content/cms-page-metadata";
import { PACKAGING_PAGE_HERO } from "@/lib/content/packaging-page-content";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("packaging", {
    title: "Bulk packaging & containment",
    description: PACKAGING_PAGE_HERO.description,
  });
}

export default async function PackagingPage() {
  return (
    <>
      <CmsPageHero
        pageSlug="packaging"
        defaults={{
          brand: PACKAGING_PAGE_HERO.eyebrow,
          title: PACKAGING_PAGE_HERO.title,
          description: PACKAGING_PAGE_HERO.description,
          primaryCta: PACKAGING_PAGE_HERO.primaryCta,
          secondaryCta: PACKAGING_PAGE_HERO.secondaryCta,
        }}
      />
      <PackagingPageSections />
    </>
  );
}
