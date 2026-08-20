import type { Metadata } from "next";
import Link from "next/link";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { PageHero } from "@/components/marketing/PageHero";
import { buyerQuoteHref } from "@/lib/marketing/cta-links";
import { getPublishedFaqs } from "@/lib/content/faqs-catalog";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Finekarts RFQs, Incoterms, pricing, and buyer access.",
};

export default async function FaqPage() {
  const faqs = await getPublishedFaqs();

  return (
    <>
      <PageHero
        title="Common questions"
        description="Straight answers about how we trade. For deal-specific advice, contact the trade desk."
        primaryCta={{ href: buyerQuoteHref(), label: "Request a Quote →" }}
        secondaryCta={{ href: "/contact", label: "Contact us" }}
      />

      <section className="bg-[#f3f1ec] py-16 lg:py-24">
        <div className="container-narrow">
          <FaqAccordion items={faqs} />
          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              href={buyerQuoteHref()}
              className="focus-ring inline-flex items-center gap-2 rounded-md bg-[#d4a84b] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#c4983f]"
            >
              Request a Quote <span aria-hidden>→</span>
            </Link>
            <Link
              href="/contact"
              className="focus-ring inline-flex items-center gap-2 rounded-md border border-[#001a3d]/25 px-6 py-3.5 text-sm font-semibold text-[#001a3d] transition hover:border-[#001a3d]"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
