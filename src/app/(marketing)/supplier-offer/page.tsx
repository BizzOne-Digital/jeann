import type { Metadata } from "next";
import { CmsPageHero } from "@/components/marketing/CmsPageHero";
import { Reveal } from "@/components/motion/Reveal";
import { TradeOfferForm } from "@/components/marketing/TradeOfferForm";

export const metadata: Metadata = {
  title: "Supplier Trade Offer",
  description:
    "Supplier access to Finekarts is invitation-only after verification. Initial enquiries may be submitted for staff review.",
};

export default function SupplierOfferPage() {
  return (
    <>
      <CmsPageHero
        pageSlug="supplier-offer"
        tone="dark"
        defaults={{
          title: "Supplier trade offer",
          description:
            "Finekarts supplier onboarding is invitation-only. Verified suppliers manage procurement transactions through the supplier portal after admin approval.",
          primaryCta: { href: "/contact", label: "Contact trade desk →" },
          secondaryCta: { href: "/login", label: "Sign in" },
        }}
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page max-w-3xl space-y-8">
          <Reveal>
            <h2 className="text-2xl font-semibold text-[var(--navy)]">Invitation-only suppliers</h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--stone)]">
              Suppliers cannot self-register for full portal access. Finekarts issues a secure,
              expiring invitation after initial diligence. If you received an invitation, open the
              link in the email to complete verification and CIS/KYB.
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="rounded-lg border border-[var(--line)] bg-white p-6">
              <h3 className="font-semibold text-[var(--navy)]">Submit initial enquiry</h3>
              <p className="mt-2 text-sm text-[var(--stone)]">
                Public submissions create a lead for staff review. They do not grant portal access or
                approve your organization.
              </p>
              <div className="mt-6">
                <TradeOfferForm />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-sm text-[var(--stone)]">
              Do not upload real banking instruments or signed contracts to staging unless using
              clearly marked test documents.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
