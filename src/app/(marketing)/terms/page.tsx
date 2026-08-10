import type { Metadata } from "next";
import { LegalReviewBanner } from "@/components/marketing/LegalReviewBanner";
import { PageHero } from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "Draft terms of use for the Finekarts marketing website — pending legal review.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        title="Terms of use"
        description="Draft terms governing access to the Finekarts marketing website — pending final legal approval."
      />
      <article className="bg-[#f3f1ec] py-14 lg:py-20">
        <div className="container-narrow">
          <LegalReviewBanner version="0.1-draft · 2026-08-09" />
          <div className="prose-trade mt-8 space-y-4 text-sm">
            <p>
              These draft terms govern access to the Finekarts Incorporated marketing website. By
              using this site you agree to these terms as published from time to time, subject to
              final legal approval.
            </p>
            <h2 className="display text-xl text-navy">No offer</h2>
            <p>
              Website content, product overviews, and forms do not constitute an offer to sell or buy
              commodities. Binding terms arise only from agreed contracts and instruments between
              parties.
            </p>
            <h2 className="display text-xl text-navy">Accuracy</h2>
            <p>
              Specifications and availability statements may be draft or pending verification.
              Finekarts may update content without notice.
            </p>
            <h2 className="display text-xl text-navy">Limitation</h2>
            <p>
              To the extent permitted by law, Finekarts excludes liability for reliance on marketing
              content. See also our Privacy Policy and Buyer Terms.
            </p>
          </div>
        </div>
      </article>
    </>
  );
}
