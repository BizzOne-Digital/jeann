"use client";

import Link from "next/link";
import { MarketingAbstractBand } from "@/components/marketing/MarketingAbstractBand";
import { Reveal } from "@/components/motion/Reveal";
import {
  PRODUCER_PARTNERS_CTA,
  PRODUCER_PARTNERS_INTRO,
  PRODUCER_PARTNERS_PILLARS,
  PRODUCER_PARTNERS_PRODUCT_LINES,
} from "@/lib/content/producer-partners-content";

export function PartnersPageSections({
  introNote,
}: {
  introNote: string;
}) {
  return (
    <>
      <MarketingAbstractBand className="border-b border-[#0d2844] py-14 lg:py-16 marketing-section">
        <div className="container-page">
          <Reveal variant="up">
            <p className="text-xs font-semibold tracking-[0.22em] text-[#d4a84b] uppercase">
              {PRODUCER_PARTNERS_INTRO.eyebrow}
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-semibold sm:text-3xl lg:text-4xl">
              {PRODUCER_PARTNERS_INTRO.title}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/82">
              {PRODUCER_PARTNERS_INTRO.lead}
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/70">{introNote}</p>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {PRODUCER_PARTNERS_PILLARS.map((pillar, i) => (
              <Reveal key={pillar.title} delay={i * 0.06} variant="up">
                <article className="h-full rounded-lg border border-white/12 bg-[#0a2540] p-5">
                  <p className="text-xs font-bold tracking-[0.18em] text-[#d4a84b] uppercase">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-white">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/78">{pillar.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </MarketingAbstractBand>

      <section id="partner-programmes" className="scroll-mt-24 bg-white marketing-section">
        <div className="container-page space-y-8">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
              Commodity lines
            </p>
            <h2 className="mt-2 max-w-2xl text-2xl font-semibold text-[#001a3d] sm:text-3xl">
              Programmes we structure for international buyers
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#555555]">
              Buyers source sugar, oils, coffee, grains, pulses, and spices through Finekarts export
              contracts. Partners should be ready to discuss specifications, packaging, and inspection
              scope that match these categories — with evidence that supports government import rules in
              target markets.
            </p>
          </Reveal>

          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCER_PARTNERS_PRODUCT_LINES.map((line, i) => (
              <Reveal key={line.href} delay={i * 0.04}>
                <li>
                  <Link
                    href={line.href}
                    className="flex h-full items-center justify-between rounded-lg border border-[var(--line)] bg-[var(--mist)] px-5 py-4 text-sm font-semibold text-[#001a3d] transition hover:border-[#c88e4a]/45 hover:bg-white"
                  >
                    {line.label}
                    <span className="text-[#c88e4a]" aria-hidden>→</span>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal>
            <div className="rounded-xl border border-[#1b3a5c]/20 bg-[#001a3d] p-6 text-white sm:p-8">
              <h2 className="text-xl font-semibold sm:text-2xl">{PRODUCER_PARTNERS_CTA.title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">{PRODUCER_PARTNERS_CTA.lead}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={PRODUCER_PARTNERS_CTA.primary.href}
                  className="focus-ring inline-flex items-center gap-2 marketing-btn-primary px-6 py-3.5 text-sm font-semibold"
                >
                  {PRODUCER_PARTNERS_CTA.primary.label}
                </Link>
                <Link
                  href={PRODUCER_PARTNERS_CTA.secondary.href}
                  className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/60 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  {PRODUCER_PARTNERS_CTA.secondary.label}
                </Link>
                <Link
                  href={PRODUCER_PARTNERS_CTA.inspections.href}
                  className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/35 px-6 py-3.5 text-sm font-semibold text-white/90 transition hover:bg-white/10"
                >
                  {PRODUCER_PARTNERS_CTA.inspections.label}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
