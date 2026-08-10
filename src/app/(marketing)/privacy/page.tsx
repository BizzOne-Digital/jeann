import type { Metadata } from "next";
import { LegalReviewBanner } from "@/components/marketing/LegalReviewBanner";
import { PageHero } from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "Draft privacy policy for Finekarts marketing and enquiry forms — pending legal review.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title="Privacy policy"
        description="Draft description of how Finekarts may collect and use personal data from forms and portals — pending legal review."
      />
      <article className="bg-[#f3f1ec] py-14 lg:py-20">
        <div className="container-narrow">
          <LegalReviewBanner version="0.1-draft · 2026-08-09" />
          <div className="prose-trade mt-8 space-y-4 text-sm">
            <p>
              This draft describes how Finekarts Incorporated may collect and use personal data
              submitted through enquiry forms, booking requests, and account registration when
              enabled.
            </p>
            <h2 className="display text-xl text-navy">Data we may collect</h2>
            <p>
              Contact details, company information, enquiry content, and technical logs (such as
              hashed IP addresses for abuse prevention) when you submit forms or use authenticated
              portals.
            </p>
            <h2 className="display text-xl text-navy">Purposes</h2>
            <p>
              Responding to enquiries, operating trade workflows, compliance screening where
              applicable, improving services, and meeting legal obligations.
            </p>
            <h2 className="display text-xl text-navy">Retention & rights</h2>
            <p>
              Retention periods and data subject rights will be specified in the legally reviewed
              version. Contact Info@finekarts.com for privacy enquiries.
            </p>
          </div>
        </div>
      </article>
    </>
  );
}
