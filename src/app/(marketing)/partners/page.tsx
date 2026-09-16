import type { Metadata } from "next";
import { CmsPageHero } from "@/components/marketing/CmsPageHero";
import { MarketingStorySection } from "@/components/marketing/MarketingStorySection";
import { PartnerProfileCard } from "@/components/marketing/PartnerSections";
import { Reveal } from "@/components/motion/Reveal";
import { cmsField } from "@/lib/content/cms-field";
import { getPublishedPage, getSectionFields } from "@/lib/content/page-content";
import { getPartners, PARTNERS_PAGE_INTRO } from "@/lib/content/partners-catalog";
import { PARTNERS_STORY } from "@/lib/content/marketing-pages";

export const metadata: Metadata = {
  title: "Verification partners",
  description:
    "Independent inspection, certification, and verification partners supporting transparent international commodity trade.",
};

export default async function PartnersPage() {
  const partners = getPartners();
  const cms = await getPublishedPage("partners");
  const intro = getSectionFields(cms, "intro");

  return (
    <>
      <CmsPageHero
        pageSlug="partners"
        tone="dark"
        defaults={{
          title: PARTNERS_PAGE_INTRO.title,
          description: PARTNERS_PAGE_INTRO.lead,
          primaryCta: { href: "#partners-list", label: "Browse partners →" },
          secondaryCta: { href: "/verification", label: "Due diligence overview" },
        }}
      />

      <MarketingStorySection
        eyebrow={PARTNERS_STORY.eyebrow}
        title={PARTNERS_STORY.title}
        lead={PARTNERS_STORY.lead}
        boxes={PARTNERS_STORY.boxes}
        imageSrc={PARTNERS_STORY.imageSrc}
        imageAlt={PARTNERS_STORY.imageAlt}
        youtubeUrl={PARTNERS_STORY.youtubeUrl}
        videoTitle="Verification partners overview"
        variant="reversed"
        background="cream"
      />

      <section className="bg-white marketing-section">
        <div className="container-page">
          <Reveal>
            <p className="max-w-3xl text-base leading-relaxed text-[var(--stone)]">
              {cmsField(intro, "note", PARTNERS_PAGE_INTRO.note)}
            </p>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--stone)]">
              {cmsField(
                intro,
                "body",
                "Each profile below uses the partner name, a short intro, a photo, and descriptive text content. Send updated copy and images to your administrator when ready.",
              )}
            </p>
          </Reveal>

          <div id="partners-list" className="mt-12 space-y-10 scroll-mt-28">
            {partners.map((partner) => (
              <PartnerProfileCard key={partner.slug} partner={partner} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
