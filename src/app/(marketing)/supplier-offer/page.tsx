import type { Metadata } from "next";
import Link from "next/link";
import { CmsPageHero } from "@/components/marketing/CmsPageHero";
import { Reveal } from "@/components/motion/Reveal";
import { TradeOfferForm } from "@/components/marketing/TradeOfferForm";
import { collectCmsSections } from "@/lib/content/cms-collect";
import { getPublishedPage } from "@/lib/content/page-content";
import {
  cmsMerged,
  SUPPLIER_OFFER_ENQUIRY_DEFAULTS,
  SUPPLIER_OFFER_HERO_DEFAULTS,
  SUPPLIER_OFFER_INVITATION_DEFAULTS,
  SUPPLIER_OFFER_SEE_ALSO_DEFAULTS,
} from "@/lib/marketing/simple-pages-cms";

export const metadata: Metadata = {
  title: "Supplier Trade Offer",
  description:
    "Supplier access to Finekarts is invitation-only after verification. Initial enquiries may be submitted for staff review.",
};

export default async function SupplierOfferPage() {
  const cms = await getPublishedPage("supplier-offer");
  const sections = collectCmsSections(cms, ["invitation", "enquiry", "see-also"]);
  const invitation = cmsMerged(sections, "invitation", SUPPLIER_OFFER_INVITATION_DEFAULTS);
  const enquiry = cmsMerged(sections, "enquiry", SUPPLIER_OFFER_ENQUIRY_DEFAULTS);
  const seeAlso = cmsMerged(sections, "see-also", SUPPLIER_OFFER_SEE_ALSO_DEFAULTS);
  return (
    <>
      <CmsPageHero
        pageSlug="supplier-offer"
        tone="dark"
        defaults={{
          title: SUPPLIER_OFFER_HERO_DEFAULTS.title,
          description: SUPPLIER_OFFER_HERO_DEFAULTS.description,
          primaryCta: {
            href: SUPPLIER_OFFER_HERO_DEFAULTS.primaryCtaHref,
            label: SUPPLIER_OFFER_HERO_DEFAULTS.primaryCtaLabel,
          },
          secondaryCta: {
            href: SUPPLIER_OFFER_HERO_DEFAULTS.secondaryCtaHref,
            label: SUPPLIER_OFFER_HERO_DEFAULTS.secondaryCtaLabel,
          },
        }}
      />

      <section className="bg-white marketing-section">
        <div className="container-page max-w-3xl space-y-8">
          <Reveal>
            <h2 className="text-2xl font-semibold text-[var(--navy)]">{invitation.title}</h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--stone)]">
              {invitation.body}
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="rounded-lg border border-[var(--line)] bg-white p-6">
              <h3 className="font-semibold text-[var(--navy)]">{enquiry.title}</h3>
              <p className="mt-2 text-sm text-[var(--stone)]">
                {enquiry.body}
              </p>
              <div className="mt-6">
                <TradeOfferForm />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-sm text-[var(--stone)]">
              {seeAlso.intro}{" "}
              <Link href={seeAlso.productsHref} className="font-semibold text-[var(--navy)] underline">
                {seeAlso.productsLabel}
              </Link>{" "}
              {seeAlso.joinText}{" "}
              <Link href={seeAlso.assuranceHref} className="font-semibold text-[var(--navy)] underline">
                {seeAlso.assuranceLabel}
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
