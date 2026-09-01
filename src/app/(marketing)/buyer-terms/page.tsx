import type { Metadata } from "next";
import { LegalDocumentsPanel } from "@/components/marketing/LegalDocumentsPanel";
import { LegalPageBody } from "@/components/marketing/LegalPageBody";
import { LegalReviewBanner } from "@/components/marketing/LegalReviewBanner";
import { PageHero } from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  title: "Buyer terms",
  description: "Draft buyer submission terms for RFQs and portal use — pending legal review.",
};

export default function BuyerTermsPage() {
  return (
    <>
      <PageHero
        title="Buyer terms"
        description="Draft terms for purchase requests and buyer portal use — pending legal review and admin versioning."
      />
      <article className="bg-[#f3f1ec] py-14 lg:py-20">
        <div className="container-narrow">
          <LegalPageBody
            banner={<LegalReviewBanner version="0.1-draft · 2026-08-09" />}
            footer={<LegalDocumentsPanel category="buyer" title="Download buyer terms (PDF)" />}
          >
            <p>
              These draft terms apply when buyers submit purchase requests or use buyer portal
              features when available. Final terms require legal review and may be versioned in
              admin.
            </p>
            <div>
              <h2 className="display text-xl text-navy">Non-binding enquiries</h2>
              <p>
                Submitting an RFQ or purchase request does not guarantee acceptance, pricing, supply,
                financing, inspection outcomes, or shipment.
              </p>
            </div>
            <div>
              <h2 className="display text-xl text-navy">Representations</h2>
              <p>
                Buyers represent that enquiry information is provided in good faith and that they have
                authority to conduct trade discussions for their organization.
              </p>
            </div>
            <div>
              <h2 className="display text-xl text-navy">Confidentiality</h2>
              <p>
                Mutual confidentiality for non-public deal terms may be addressed in separate NDAs or
                contract documents where appropriate.
              </p>
            </div>
          </LegalPageBody>
        </div>
      </article>
    </>
  );
}
