import type { Metadata } from "next";
import { LegalPageBody } from "@/components/marketing/LegalPageBody";
import { LegalReviewBanner } from "@/components/marketing/LegalReviewBanner";
import { PageHero } from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Finekarts accessibility statement — draft pending legal and compliance review.",
};

export default function AccessibilityPage() {
  return (
    <>
      <PageHero
        title="Accessibility statement"
        description="Draft commitment to making Finekarts marketing pages and portals usable for people with diverse abilities."
        primaryCta={{ href: "mailto:Info@finekarts.com?subject=Accessibility", label: "Report an issue →" }}
        secondaryCta={{ href: "/contact", label: "Contact us" }}
      />
      <article className="bg-[#f3f1ec] py-14 lg:py-20">
        <div className="container-narrow">
          <LegalPageBody banner={<LegalReviewBanner version="0.1-draft · 2026-08-09" />}>
            <p>
              Finekarts aims to make its marketing website and portals usable for people with diverse
              abilities. This statement is a draft and will be updated following accessibility review.
            </p>
            <div>
              <h2 className="display text-xl text-navy">Measures</h2>
              <p>
                We strive for semantic HTML, keyboard focus visibility, reduced-motion support where
                animations are used, and sufficient color contrast aligned with design tokens.
              </p>
            </div>
            <div>
              <h2 className="display text-xl text-navy">Known limitations</h2>
              <p>
                Some interactive visuals may have limited alternatives. We welcome feedback on barriers
                encountered.
              </p>
            </div>
            <div>
              <h2 className="display text-xl text-navy">Feedback</h2>
              <p>
                Email Info@finekarts.com with subject &quot;Accessibility&quot; to report issues or
                request assistance.
              </p>
            </div>
          </LegalPageBody>
        </div>
      </article>
    </>
  );
}
