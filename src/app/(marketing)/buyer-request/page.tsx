import type { Metadata } from "next";
import Link from "next/link";
import { CmsPageHero } from "@/components/marketing/CmsPageHero";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Buyer Purchase Request",
  description:
    "Submit a structured purchase request for bulk agricultural commodities through the Finekarts buyer portal after registration and approval.",
};

export default function BuyerRequestPage() {
  return (
    <>
      <CmsPageHero
        pageSlug="buyer-request"
        tone="dark"
        defaults={{
          title: "Buyer purchase request",
          description:
            "Qualified buyers submit RFQs for listed commodities and on-demand volumes through the secure buyer portal. Registration and trade-desk qualification are required before programmes proceed.",
          primaryCta: { href: "/register/buyer", label: "Register your company →" },
          secondaryCta: { href: "/login", label: "Buyer sign in" },
        }}
      />

      <section className="bg-white marketing-section">
        <div className="container-page max-w-3xl space-y-8">
          <Reveal>
            <h2 className="text-2xl font-semibold text-[var(--navy)]">How buyer requests work</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-base leading-relaxed text-[var(--stone)]">
              <li>Register your buyer organization and accept the current terms.</li>
              <li>Finekarts reviews your company (CIS/KYB may be requested).</li>
              <li>After approval, sign in to the buyer portal.</li>
              <li>
                Submit a purchase request with product, grade, quantity (MT), destination port,
                FOB or CIF, contract duration, and ICC-aligned payment terms (for example Irrevocable LC at sight).
              </li>
              <li>The trade desk qualifies your enquiry — submission is not a binding contract.</li>
            </ol>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="rounded-lg border border-[var(--line)] bg-[var(--cream)]/50 p-6">
              <h3 className="font-semibold text-[var(--navy)]">Edible oils programme form</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--stone)]">
                Approved buyers can specify grade, monthly MT volume, destination, 12- or 24-month
                contracts, and agreed payment structures from our published programme options.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/portal/buyer/new-request" className="btn btn-primary">
                  Open request form (sign-in required)
                </Link>
                <Link href="/resources" className="btn btn-secondary">
                  Payment & document resources
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-sm text-[var(--stone)]">
              Finekarts does not guarantee availability, pricing, financing, or shipment based on a
              website submission alone. Binding terms appear only in signed PSA/SPA and banking
              instruments.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
