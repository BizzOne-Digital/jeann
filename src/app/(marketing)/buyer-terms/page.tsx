import type { Metadata } from "next";
import { LegalDocumentsPanel } from "@/components/marketing/LegalDocumentsPanel";
import { LegalPageBody } from "@/components/marketing/LegalPageBody";
import { LegalReviewBanner } from "@/components/marketing/LegalReviewBanner";
import { PageHero } from "@/components/marketing/PageHero";
import { getPageHeroImage } from "@/lib/marketing/page-hero-images";

export const metadata: Metadata = {
  title: "Buyer terms",
  description: "Terms for purchase requests and buyer portal use on the Finekarts website.",
};

export default function BuyerTermsPage() {
  const hero = getPageHeroImage("buyerTerms");

  return (
    <>
      <PageHero
        title="Buyer terms"
        description="Terms that apply when qualified buyers submit purchase requests or use buyer portal features."
        imageSrc={hero.src}
        imageAlt={hero.alt}
      />
      <article className="bg-[#f3f1ec] marketing-section">
        <div className="container-narrow">
          <LegalPageBody
            banner={<LegalReviewBanner version="2026" />}
            footer={<LegalDocumentsPanel category="buyer" title="Download buyer terms (PDF)" />}
          >
            <p>
              These terms apply when buyers submit purchase requests or use buyer portal features.
              Binding trade terms appear in the signed PSA/SPA and banking instruments — not in this
              summary alone.
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
