"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/marketing/PageHero";
import { PurchaseRequestForm } from "@/components/marketing/PurchaseRequestForm";
import { getPackagingSync } from "@/lib/content/packaging-catalog";
import { TradeOfferForm } from "@/components/marketing/TradeOfferForm";

const TERMS = [
  {
    term: "LOI",
    text: "Letter of Intent — a non-binding expression of interest outlining proposed terms for further negotiation.",
  },
  {
    term: "SCO",
    text: "Soft Corporate Offer — an indicative offer subject to verification, often replaced by firmer documentation later.",
  },
  {
    term: "FCO",
    text: "Full Corporate Offer — a more detailed corporate offer, still subject to contract and diligence unless expressly binding.",
  },
  {
    term: "ICPO",
    text: "Irrevocable Corporate Purchase Order — a strong buyer-side instrument in some structures; enforceability depends on wording and jurisdiction.",
  },
  {
    term: "PSA / SPA",
    text: "Purchase and Sale Agreement — contractual documents that define specifications, price mechanics, delivery, and remedies.",
  },
  {
    term: "LC",
    text: "Letter of Credit — a bank instrument; type (e.g. irrevocable, at sight) and compliance with documents are negotiated per deal.",
  },
];

export function TradeHero() {
  return (
    <PageHero
      title="How we trade"
      description="Finekarts coordinates enquiries, diligence, and documentation for qualified buyers and suppliers. Website submissions are starting points — not confirmed deals."
      primaryCta={{ href: "#purchase-request", label: "Post a Purchase Request →" }}
      secondaryCta={{ href: "#trade-offer", label: "Supplier trade offer" }}
    />
  );
}

export function TradeProcess() {
  const steps = [
    {
      n: "01",
      title: "Submit Request",
      text: "Share product, quantity, destination, and preferred Incoterms through the RFQ form.",
    },
    {
      n: "02",
      title: "Review & Quote",
      text: "Trade desk reviews fit against supplier programmes and workable logistics structures.",
    },
    {
      n: "03",
      title: "Contract & Documentation",
      text: "Agreed PSA/SPA and banking wording proceed only after mutual confirmation.",
    },
    {
      n: "04",
      title: "Inspection & Delivery",
      text: "Inspection, packaging, and shipment milestones follow the signed contract.",
    },
  ];

  return (
    <section className="bg-[#0a1628] py-16 text-white lg:py-24">
      <div className="container-page">
        <Reveal>
          <p className="text-center text-xs font-semibold tracking-[0.22em] text-[#d4a84b] uppercase">
            Process
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mx-auto mt-3 max-w-2xl text-center text-3xl font-semibold sm:text-4xl">
            A clear path from request to delivery
          </h2>
        </Reveal>
        <div className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
          <div className="pointer-events-none absolute top-8 right-[12%] left-[12%] hidden h-px bg-white/15 md:block" />
          {steps.map((step, i) => (
            <Reveal key={step.n} delay={0.1 + i * 0.06}>
              <div className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#d4a84b] bg-[#0a1628] text-sm font-bold text-[#d4a84b]">
                  {step.n}
                </div>
                <h3 className="mt-5 font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TradePathways() {
  return (
    <section className="bg-[#f3f1ec] py-16 lg:py-24">
      <div className="container-page grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div id="buyer">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
              Buyers
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-3 text-3xl font-semibold text-[#001a3d]">Buyer pathway</h2>
          </Reveal>
          <ol className="mt-6 space-y-0 border-t border-[#d5d0c8]">
            {[
              "Submit a purchase request with specifications and destination.",
              "Trade desk reviews fit, logistics, and compliance factors.",
              "Counterparties may exchange LOI/SCO/FCO-style documents during negotiation.",
              "Binding terms appear only in agreed PSA/SPA and payment instruments such as LC.",
            ].map((item, i) => (
              <Reveal key={item} delay={0.08 + i * 0.04}>
                <li className="flex gap-4 border-b border-[#d5d0c8] py-4 text-sm leading-relaxed text-[#555555]">
                  <span className="font-semibold text-[#c88e4a]">0{i + 1}</span>
                  <span>{item}</span>
                </li>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={0.28}>
            <Link
              href="#purchase-request"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#c88e4a] transition hover:gap-3"
            >
              Go to purchase request <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>

        <div id="supplier">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
              Suppliers
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-3 text-3xl font-semibold text-[#001a3d]">Supplier pathway</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-base leading-relaxed text-[#555555]">
              Supplier portal access is invitation-only after verification. You may submit an
              initial trade offer below; publication and onboarding remain at Finekarts&apos;
              discretion.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-4 text-sm leading-relaxed text-[#666666]">
              Learn about{" "}
              <Link href="/packaging" className="font-semibold text-[#001a3d] underline decoration-[#c88e4a]/40 underline-offset-2 hover:decoration-[#c88e4a]">
                packaging options
              </Link>{" "}
              and{" "}
              <Link
                href="/logistics"
                className="font-semibold text-[#001a3d] underline decoration-[#c88e4a]/40 underline-offset-2 hover:decoration-[#c88e4a]"
              >
                shipping documents
              </Link>
              .
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Link
              href="#trade-offer"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#c88e4a] transition hover:gap-3"
            >
              Submit a trade offer <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function TradeIncoterms() {
  return (
    <section className="bg-white">
      <div className="grid lg:grid-cols-2">
        <div className="bg-[#0b1f33] px-6 py-14 text-white sm:px-10 lg:px-16 lg:py-20">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.22em] text-[#d4a84b] uppercase">
              Incoterms
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Shipping terms built around your trade
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/65">
              Responsibilities depend on contract wording and the Incoterms edition referenced.
              Educational only — not legal advice.
            </p>
          </Reveal>
          <div className="mt-8 space-y-6">
            {[
              {
                term: "FOB",
                text: "Seller typically loads goods on board at the named port; buyer often arranges main carriage and insurance from that point. Risk transfer timing should be confirmed in contract.",
              },
              {
                term: "CIF",
                text: "Seller typically contracts freight and minimum insurance to the named destination port. Buyer takes delivery with agreed documents; coverage details remain negotiable.",
              },
            ].map((item, i) => (
              <Reveal key={item.term} delay={0.14 + i * 0.06}>
                <div className="border-t border-white/15 pt-5">
                  <p className="text-lg font-semibold text-[#d4a84b]">{item.term}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="relative min-h-[280px] lg:min-h-full">
          <Image
            src="/images/home-2.png"
            alt="Container ship and port logistics"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}

export function TradeTerminology() {
  return (
    <section className="bg-[#f3f1ec] py-16 lg:py-24">
      <div className="container-page">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
            Terminology
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold text-[#001a3d] sm:text-4xl">
            Documents you may hear discussed
          </h2>
        </Reveal>

        <dl className="mt-10 grid gap-0 border-t border-[#d5d0c8] sm:grid-cols-2">
          {TERMS.map((item, i) => (
            <Reveal key={item.term} delay={Math.min(i * 0.04, 0.2)}>
              <div
                className={`border-b border-[#d5d0c8] py-6 sm:px-6 ${i % 2 === 0 ? "sm:border-r" : ""} ${i < 2 ? "" : ""}`}
              >
                <dt className="font-mono text-sm font-semibold tracking-wide text-[#001a3d]">
                  {item.term}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-[#555555]">{item.text}</dd>
              </div>
            </Reveal>
          ))}
        </dl>

        <Reveal delay={0.2}>
          <p className="mt-8 text-sm text-[#666666]">
            Read more in{" "}
            <Link
              href="/insights/fob-vs-cif-for-bulk-commodities"
              className="font-semibold text-[#001a3d] underline decoration-[#c88e4a]/40 underline-offset-2"
            >
              Insights
            </Link>
            . Finekarts does not guarantee performance, pricing, or shipment based on terminology
            alone.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function TradePurchaseRequest({
  defaultProduct,
}: {
  defaultProduct?: { slug?: string; name?: string };
}) {
  return (
    <section id="purchase-request" className="scroll-mt-24 bg-white py-16 lg:py-24">
      <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
              Buyers
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-3 text-3xl font-semibold text-[#001a3d] sm:text-4xl">
              Purchase request
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-base leading-relaxed text-[#555555]">
              {defaultProduct?.name
                ? `Enquiring about ${defaultProduct.name}. Adjust details as needed.`
                : "Share product, quantity, destination, and Incoterm preference."}
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-3 text-sm leading-relaxed text-[#666666]">
              Submission does not guarantee acceptance, supply, pricing, financing, or shipment.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.08} y={20}>
          <div className="border border-[#e4e0d8] bg-[#f3f1ec]/60 p-6 sm:p-8">
            <PurchaseRequestForm defaultProduct={defaultProduct} packagingOptions={getPackagingSync()} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function TradeOfferSection() {
  return (
    <section id="trade-offer" className="scroll-mt-24 bg-[#0a1628] py-16 text-white lg:py-24">
      <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.22em] text-[#d4a84b] uppercase">
              Suppliers
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Trade offer</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-base leading-relaxed text-white/70">
              Initial supplier enquiries. Portal access and listing remain invitation-only after
              verification.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.08} y={20}>
          <div className="border border-white/15 bg-white p-6 text-[#001a3d] sm:p-8">
            <TradeOfferForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
