import type { Metadata } from "next";
import Link from "next/link";
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
            "Finekarts is a distributor selling to qualified buyers. Origin supply is private — supplier portal access is invitation-only after diligence.",
          primaryCta: { href: "/contact", label: "Contact trade desk →" },
          secondaryCta: { href: "/login", label: "Sign in" },
        }}
      />

      <section className="bg-white marketing-section">
        <div className="container-page max-w-3xl space-y-8">
          <Reveal>
            <h2 className="text-2xl font-semibold text-[var(--navy)]">Invitation-only suppliers</h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--stone)]">
              We do not advertise open supplier registration on this site. Established origin
              relationships are managed privately. If Finekarts invites your organization to a
              programme, you will receive secure onboarding instructions by email.
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="rounded-lg border border-[var(--line)] bg-white p-6">
              <h3 className="font-semibold text-[var(--navy)]">Submit initial enquiry</h3>
              <p className="mt-2 text-sm text-[var(--stone)]">
                Optional initial messages are reviewed by the trade desk. They do not grant portal
                access or confirm a supply relationship.
              </p>
              <div className="mt-6">
                <TradeOfferForm />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-sm text-[var(--stone)]">
              For bulk buyer programmes, see{" "}
              <Link href="/products" className="font-semibold text-[var(--navy)] underline">
                products we sell
              </Link>{" "}
              or{" "}
              <Link href="/dispute-resolution" className="font-semibold text-[var(--navy)] underline">
                trade assurance
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
