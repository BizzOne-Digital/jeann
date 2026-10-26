"use client";

import Link from "next/link";
import { MarketingAbstractBand } from "@/components/marketing/MarketingAbstractBand";
import { Reveal } from "@/components/motion/Reveal";
import { cmsField, cmsLines } from "@/lib/content/cms-field";
import {
  PARTNERS_PROGRAMMES_LEAD,
  PRODUCER_PARTNERS_CTA,
  PARTNERS_INTRO_NOTE_DEFAULT,
  PRODUCER_PARTNERS_INTRO,
  PRODUCER_PARTNERS_PILLARS,
  PRODUCER_PARTNERS_PRODUCT_LINES,
} from "@/lib/content/producer-partners-content";

const SPOTLIGHT_SINGLE_DEFAULTS = {
  eyebrow: "Partner spotlight",
  title: "Additional programme notes",
  body:
    "Use this area for a single highlighted message — capacity updates, corridor focus, or onboarding steps.",
} as const;

const SPOTLIGHT_TRIO_DEFAULTS = {
  box1Title: "Documentation readiness",
  box1Body:
    "Share how your facility supports certificates of origin, analysis, and weight where buyers and banks require them.",
  box2Title: "Loading & logistics",
  box2Body:
    "Describe berths, container stuffing, or inland routes so CIF and FOB programmes can be quoted realistically.",
  box3Title: "Quality systems",
  box3Body:
    "Outline HACCP, traceability, or buyer audit protocols that support recurring export contracts.",
} as const;

function splitPair(line: string, sep: string) {
  const idx = line.indexOf(sep);
  if (idx === -1) return null;
  const a = line.slice(0, idx).trim();
  const b = line.slice(idx + sep.length).trim();
  return a && b ? [a, b] : null;
}

export function PartnersPageSections({
  intro,
  programmes,
  spotlightSingle,
  spotlightTrio,
  cta,
}: {
  intro?: Record<string, string>;
  programmes?: Record<string, string>;
  spotlightSingle?: Record<string, string>;
  spotlightTrio?: Record<string, string>;
  cta?: Record<string, string>;
}) {
  const introNote = cmsField(intro, "note", PARTNERS_INTRO_NOTE_DEFAULT);
  const pillars = (() => {
    const parsed = cmsLines(
      intro,
      "pillars",
      PRODUCER_PARTNERS_PILLARS.map((p) => `${p.title}: ${p.body}`),
    )
      .map((l) => splitPair(l, ":"))
      .filter((x): x is string[] => !!x)
      .map(([title, body]) => ({ title, body }));
    return parsed.length ? parsed : [...PRODUCER_PARTNERS_PILLARS];
  })();
  const productLines = (() => {
    const parsed = cmsLines(
      programmes,
      "lines",
      PRODUCER_PARTNERS_PRODUCT_LINES.map((l) => `${l.label} | ${l.href}`),
    )
      .map((l) => splitPair(l, "|"))
      .filter((x): x is string[] => !!x)
      .map(([label, href]) => ({ label, href }));
    return parsed.length ? parsed : [...PRODUCER_PARTNERS_PRODUCT_LINES];
  })();
  return (
    <>
      <MarketingAbstractBand className="border-b border-[#0d2844] py-14 lg:py-16 marketing-section">
        <div className="container-page">
          <Reveal variant="up">
            <p className="text-xs font-semibold tracking-[0.22em] text-[#d4a84b] uppercase">
              {cmsField(intro, "eyebrow", PRODUCER_PARTNERS_INTRO.eyebrow)}
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-semibold sm:text-3xl lg:text-4xl">
              {cmsField(intro, "title", PRODUCER_PARTNERS_INTRO.title)}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/82">
              {cmsField(intro, "lead", PRODUCER_PARTNERS_INTRO.lead)}
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/70">{introNote}</p>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {pillars.map((pillar, i) => (
              <Reveal key={pillar.title} delay={i * 0.06} variant="up">
                <article className="h-full rounded-lg border border-white/12 bg-[#0a2540] p-5">
                  <h3 className="text-lg font-semibold text-white">{pillar.title}</h3>
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
              {cmsField(programmes, "eyebrow", "Commodity lines")}
            </p>
            <h2 className="mt-2 max-w-2xl text-2xl font-semibold text-[#001a3d] sm:text-3xl">
              {cmsField(programmes, "title", "Programmes we structure for international buyers")}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#555555]">
              {cmsField(programmes, "lead", PARTNERS_PROGRAMMES_LEAD)}
            </p>
          </Reveal>

          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {productLines.map((line, i) => (
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

          <Reveal className="mt-10">
            <article className="rounded-xl border border-[var(--line)] bg-[var(--mist)] p-6 sm:p-8">
              <p className="text-xs font-semibold tracking-[0.16em] text-[#c88e4a] uppercase">
                {cmsField(spotlightSingle, "eyebrow", SPOTLIGHT_SINGLE_DEFAULTS.eyebrow)}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-[#001a3d]">
                {cmsField(spotlightSingle, "title", SPOTLIGHT_SINGLE_DEFAULTS.title)}
              </h3>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#555555]">
                {cmsField(spotlightSingle, "body", SPOTLIGHT_SINGLE_DEFAULTS.body)}
              </p>
            </article>
          </Reveal>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {(
              [
                ["box1Title", "box1Body"],
                ["box2Title", "box2Body"],
                ["box3Title", "box3Body"],
              ] as const
            ).map(([titleKey, bodyKey], i) => (
              <Reveal key={titleKey} delay={i * 0.05}>
                <article className="h-full rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm">
                  <h3 className="text-base font-semibold text-[#001a3d]">
                    {cmsField(spotlightTrio, titleKey, SPOTLIGHT_TRIO_DEFAULTS[titleKey])}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#555555]">
                    {cmsField(spotlightTrio, bodyKey, SPOTLIGHT_TRIO_DEFAULTS[bodyKey])}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-10 rounded-xl border border-[#1b3a5c]/20 bg-[#001a3d] p-6 text-white sm:p-8">
              <h2 className="text-xl font-semibold sm:text-2xl">{cmsField(cta, "title", PRODUCER_PARTNERS_CTA.title)}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">{cmsField(cta, "lead", PRODUCER_PARTNERS_CTA.lead)}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={cmsField(cta, "primaryCtaHref", PRODUCER_PARTNERS_CTA.primary.href)}
                  className="focus-ring inline-flex items-center gap-2 marketing-btn-primary px-6 py-3.5 text-sm font-semibold"
                >
                  {cmsField(cta, "primaryCtaLabel", PRODUCER_PARTNERS_CTA.primary.label)}
                </Link>
                <Link
                  href={cmsField(cta, "secondaryCtaHref", PRODUCER_PARTNERS_CTA.secondary.href)}
                  className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/60 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  {cmsField(cta, "secondaryCtaLabel", PRODUCER_PARTNERS_CTA.secondary.label)}
                </Link>
                <Link
                  href={cmsField(cta, "tertiaryCtaHref", PRODUCER_PARTNERS_CTA.inspections.href)}
                  className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/35 px-6 py-3.5 text-sm font-semibold text-white/90 transition hover:bg-white/10"
                >
                  {cmsField(cta, "tertiaryCtaLabel", PRODUCER_PARTNERS_CTA.inspections.label)}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
