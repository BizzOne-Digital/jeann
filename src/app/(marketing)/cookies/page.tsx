import type { Metadata } from "next";
import { LegalReviewBanner } from "@/components/marketing/LegalReviewBanner";
import { PageHero } from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  title: "Cookie policy",
  description: "Draft cookie policy for the Finekarts website — pending legal review.",
};

export default function CookiesPage() {
  return (
    <>
      <PageHero
        title="Cookie policy"
        description="Draft explanation of how Finekarts may use cookies and similar technologies — pending legal review."
      />
      <article className="bg-[#f3f1ec] py-14 lg:py-20">
        <div className="container-narrow">
          <LegalReviewBanner version="0.1-draft · 2026-08-09" />
          <div className="prose-trade mt-8 space-y-4 text-sm">
            <p>
              This draft explains how Finekarts may use cookies and similar technologies on the
              marketing site and authenticated portals.
            </p>
            <h2 className="display text-xl text-navy">Essential cookies</h2>
            <p>
              Session and security cookies may be used to maintain sign-in state, CSRF protection,
              and basic site functionality.
            </p>
            <h2 className="display text-xl text-navy">Analytics</h2>
            <p>
              Analytics cookies, if enabled after review, would help understand aggregate site usage.
              Details will be updated before any non-essential tracking is activated.
            </p>
            <h2 className="display text-xl text-navy">Managing preferences</h2>
            <p>
              Browser settings can limit cookies. Restricting essential cookies may affect portal
              functionality.
            </p>
          </div>
        </div>
      </article>
    </>
  );
}
