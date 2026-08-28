import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";
import { MarketingStorySection } from "@/components/marketing/MarketingStorySection";
import { Reveal } from "@/components/motion/Reveal";
import { LOGISTICS_STORY } from "@/lib/content/marketing-pages";
import {
  CONTRACT_TO_CARGO_STEPS,
  DELIVERY_RELIABILITY,
  ETA_MONITORING,
  FOB_CIF_TERMS,
  GLOBAL_SHIPPING_COVERAGE,
  INCOTERMS_DISCLAIMER,
  LOGISTICS_CLOSING,
  LOGISTICS_CTA,
  LOGISTICS_HERO,
  PORT_TO_PORT_CHAIN,
  REAL_TIME_TRACKING,
  SHIPMENT_COORDINATION,
  SHIPPING_DOCUMENTATION,
  SHIPPING_MODES,
} from "@/lib/content/logistics-content";

export const metadata: Metadata = {
  title: "Global Shipping & Logistics",
  description:
    "Finekarts coordinates international commodity shipping from origin to destination — FOB and CIF terms, bulk and container programmes, shipment tracking, documentation and port-to-port logistics.",
};

export default function LogisticsPage() {
  const story = LOGISTICS_STORY;

  return (
    <>
      <PageHero
        tone="light"
        title={LOGISTICS_HERO.title}
        brand={LOGISTICS_HERO.eyebrow}
        description={LOGISTICS_HERO.description}
        imageSrc={story.imageSrc}
        imageAlt={story.imageAlt}
        primaryCta={LOGISTICS_HERO.primaryCta}
        secondaryCta={LOGISTICS_HERO.secondaryCta}
      />

      <MarketingStorySection
        eyebrow={story.eyebrow}
        title={story.title}
        lead={story.lead}
        boxes={story.boxes}
        imageSrc="/images/home-2.png"
        imageAlt="International port and commodity logistics"
        youtubeUrl={story.youtubeUrl}
        videoTitle="Logistics overview"
        variant="reversed"
        background="cream"
      />

      <section id="incoterms" className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-semibold text-[#001a3d] sm:text-3xl">
            {GLOBAL_SHIPPING_COVERAGE.title}
          </h2>
          <p className="mt-3 max-w-3xl text-base text-[#555555]">{GLOBAL_SHIPPING_COVERAGE.lead}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {GLOBAL_SHIPPING_COVERAGE.incoterms.map((term) => (
              <span
                key={term}
                className="rounded-full border border-[#d5d0c8] bg-[#f9f8f5] px-4 py-2 text-sm font-medium text-[#001a3d]"
              >
                {term}
              </span>
            ))}
          </div>
          <p className="mt-6 text-sm text-[#555555]">{GLOBAL_SHIPPING_COVERAGE.note}</p>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {FOB_CIF_TERMS.map((term) => (
              <article key={term.code} className="rounded-lg border border-[#d5d0c8] bg-[#f9f8f5] p-6 sm:p-8">
                <p className="text-xs font-semibold tracking-[0.2em] text-[#c88e4a] uppercase">{term.code}</p>
                <h3 className="mt-2 text-xl font-semibold text-[#001a3d]">{term.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#555555]">{term.summary}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm font-medium text-[#001a3d]">
            FOB and CIF are currently our primary commercial shipping terms.
          </p>
        </div>
      </section>

      <section className="bg-[#f3f1ec] py-16 lg:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <article>
            <h2 className="text-2xl font-semibold text-[#001a3d]">{REAL_TIME_TRACKING.title}</h2>
            <p className="mt-3 text-sm text-[#555555]">{REAL_TIME_TRACKING.lead}</p>
            <ul className="mt-4 space-y-2">
              {REAL_TIME_TRACKING.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-[#555555]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a84b]" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-[#555555]">{REAL_TIME_TRACKING.note}</p>
          </article>
          <article className="rounded-lg border border-[#d5d0c8] bg-white p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#001a3d]">{ETA_MONITORING.title}</h2>
            <p className="mt-3 text-sm text-[#555555]">{ETA_MONITORING.lead}</p>
            <p className="mt-4 rounded-md bg-[#f9f8f5] px-4 py-3 text-xs font-medium leading-relaxed text-[#001a3d]">
              {ETA_MONITORING.flow}
            </p>
            <p className="mt-4 text-sm text-[#555555]">{ETA_MONITORING.note}</p>
            <p className="mt-6 text-sm font-semibold text-[#c88e4a]">{ETA_MONITORING.goal}</p>
          </article>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-semibold text-[#001a3d]">{PORT_TO_PORT_CHAIN.title}</h2>
          <p className="mt-3 max-w-3xl text-base text-[#555555]">{PORT_TO_PORT_CHAIN.lead}</p>
          <ol className="mt-8 max-w-2xl space-y-3">
            {PORT_TO_PORT_CHAIN.steps.map((step, index) => (
              <li key={step} className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#071525] text-xs font-semibold text-[#d4a84b]">
                  {index + 1}
                </span>
                <span className="pt-1 text-sm text-[#555555]">{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-[#555555]">{PORT_TO_PORT_CHAIN.note}</p>
        </div>
      </section>

      <section className="bg-[#f3f1ec] py-16 lg:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-semibold text-[#001a3d]">Bulk & container shipping</h2>
          <p className="mt-3 max-w-3xl text-sm text-[#555555]">
            Depending on the commodity and order requirements, Finekarts can coordinate appropriate
            shipping solutions including:
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SHIPPING_MODES.map((mode, index) => (
              <Reveal key={mode.title} delay={index * 0.03}>
                <article className="h-full rounded-lg border border-[#d5d0c8] bg-white p-5">
                  <h3 className="font-semibold text-[#001a3d]">{mode.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#555555]">{mode.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-semibold text-[#001a3d]">{SHIPPING_DOCUMENTATION.title}</h2>
          <p className="mt-3 max-w-3xl text-base text-[#555555]">{SHIPPING_DOCUMENTATION.lead}</p>
          <p className="mt-4 text-sm font-medium text-[#001a3d]">{SHIPPING_DOCUMENTATION.intro}</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {SHIPPING_DOCUMENTATION.items.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-[#555555]">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a84b]" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-[#555555]">{SHIPPING_DOCUMENTATION.note}</p>
        </div>
      </section>

      <section className="bg-[#f3f1ec] py-16 lg:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <article className="rounded-lg border border-[#d5d0c8] bg-white p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#001a3d]">{SHIPMENT_COORDINATION.title}</h2>
            <p className="mt-3 text-sm text-[#555555]">{SHIPMENT_COORDINATION.lead}</p>
            <p className="mt-4 rounded-md bg-[#f9f8f5] px-4 py-3 text-xs font-medium leading-relaxed text-[#001a3d]">
              {SHIPMENT_COORDINATION.parties}
            </p>
            <p className="mt-4 text-sm text-[#555555]">{SHIPMENT_COORDINATION.note}</p>
          </article>
          <article>
            <h2 className="text-xl font-semibold text-[#001a3d]">{DELIVERY_RELIABILITY.title}</h2>
            <p className="mt-3 text-sm text-[#555555]">{DELIVERY_RELIABILITY.lead}</p>
            <ul className="mt-4 space-y-2">
              {DELIVERY_RELIABILITY.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-[#555555]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a84b]" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm font-semibold text-[#001a3d]">{DELIVERY_RELIABILITY.commitment}</p>
            <p className="mt-4 text-xs leading-relaxed text-[#777777]">{DELIVERY_RELIABILITY.disclaimer}</p>
          </article>
        </div>
      </section>

      <section className="bg-[#071525] py-16 text-white lg:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-semibold sm:text-3xl">From contract to cargo</h2>
          <p className="mt-3 max-w-3xl text-sm text-white/75">
            Finekarts integrates commodity sourcing, inspection, documentation and international shipping
            into one coordinated trading process.
          </p>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CONTRACT_TO_CARGO_STEPS.map((step) => (
              <li
                key={step.step}
                className="rounded-lg border border-white/15 bg-white/5 p-5 backdrop-blur-sm"
              >
                <p className="text-xs font-semibold tracking-[0.2em] text-[#d4a84b] uppercase">
                  {String(step.step).padStart(2, "0")} — {step.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-semibold text-[#001a3d]">{LOGISTICS_CLOSING.title}</h2>
          <p className="mt-3 max-w-3xl text-base text-[#555555]">{LOGISTICS_CLOSING.lead}</p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#555555]">{LOGISTICS_CLOSING.body}</p>
          <p className="mt-6 text-lg font-semibold text-[#001a3d]">{LOGISTICS_CLOSING.tagline}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {LOGISTICS_CLOSING.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-[#d5d0c8] bg-[#f9f8f5] px-4 py-2 text-sm font-medium text-[#001a3d]"
              >
                {badge}
              </span>
            ))}
          </div>
          <p className="mt-8 text-xs leading-relaxed text-[#777777]">{INCOTERMS_DISCLAIMER}</p>
        </div>
      </section>

      <section id="request-quote" className="relative overflow-hidden py-16 text-white lg:py-20">
        <Image src="/images/hero-commodities.png" alt="" fill className="object-cover" sizes="100vw" aria-hidden />
        <div className="absolute inset-0 bg-[#071525]/88" />
        <div className="container-page relative">
          <h2 className="text-2xl font-semibold sm:text-3xl">{LOGISTICS_CTA.title}</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80">{LOGISTICS_CTA.lead}</p>
          <p className="mt-4 text-sm text-white/70">Include: {LOGISTICS_CTA.fields.join(" · ")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="focus-ring inline-flex items-center gap-2 rounded-md bg-[#d4a84b] px-6 py-3.5 text-sm font-semibold text-[#071525] transition hover:bg-[#c4983f]"
            >
              Buyer portal — submit request <span aria-hidden>→</span>
            </Link>
            <Link
              href="/contact"
              className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/70 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Contact trade desk
            </Link>
            <Link
              href="/resources"
              className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/40 px-6 py-3.5 text-sm font-semibold text-white/90 transition hover:bg-white/10"
            >
              Trade documents
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
