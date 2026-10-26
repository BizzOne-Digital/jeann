"use client";

import Image from "next/image";
import { MarketingAbstractBand } from "@/components/marketing/MarketingAbstractBand";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { InspectionContent } from "@/lib/marketing/inspection-cms";
import { InspectionFirmVideoStrip } from "@/components/marketing/InspectionFirmVideoStrip";
import { LogisticsPairedRow } from "@/components/marketing/LogisticsVisuals";
import { MotionImageFrame } from "@/components/motion/MotionImageFrame";
import { Reveal } from "@/components/motion/Reveal";
import { stripLeadingMarker } from "@/lib/marketing/strip-leading-marker";

function TypeCard({
  title,
  purpose,
  focus,
  benefit,
  techniques,
  index,
  equalHeight = false,
}: {
  title: string;
  purpose: string;
  focus: string;
  benefit: string;
  techniques?: readonly string[];
  index: number;
  /** Only for equal-height grids (e.g. timing cards); avoid with paired images. */
  equalHeight?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className={`flex flex-col rounded-xl border border-[#d5d0c8] bg-white p-6 shadow-sm transition hover:border-[#c88e4a]/35 hover:shadow-md${
        equalHeight ? " h-full" : ""
      }`}
    >
      <h3 className="text-lg font-semibold text-[#001a3d]">{stripLeadingMarker(title)}</h3>
      <p className="mt-3 text-sm leading-relaxed text-[#555555]">
        <span className="font-semibold text-[#001a3d]">Purpose: </span>
        {purpose}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[#555555]">
        <span className="font-semibold text-[#001a3d]">Focus: </span>
        {focus}
      </p>
      {techniques?.length ? (
        <ul className="mt-3 space-y-2">
          {techniques.map((t) => (
            <li key={t} className="flex gap-2 text-sm leading-relaxed text-[#444444]">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c88e4a]" aria-hidden />
              {t}
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-4 border-t border-[#ebe6de] pt-4 text-sm leading-relaxed text-[#555555]">
        <span className="font-semibold text-[#001a3d]">Key benefit: </span>
        {benefit}
      </p>
    </motion.article>
  );
}

export function InspectionOperationalPage({ content }: { content: InspectionContent }) {
  const { overview, timing, methodology, scope, summary, validation, comparison, firmVideos, cta } =
    content;
  const COMMODITY_VALIDATION_BAND_AREAS = validation.areas.slice(0, -1);
  const COMMODITY_VALIDATION_TRAILING_AREA = validation.areas.at(-1);
  return (
    <div id="inspection-types" className="scroll-mt-20">
      <section className="marketing-section bg-white">
        <div className="container-page">
          <LogisticsPairedRow image={overview.image} reversed>
            <Reveal>
              <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">{overview.eyebrow}</p>
              <p className="mt-4 text-sm leading-relaxed text-[#555555] sm:text-base">{overview.body}</p>
            </Reveal>
          </LogisticsPairedRow>
        </div>
      </section>

      <section className="marketing-section bg-[var(--mist)]">
        <div className="container-page space-y-10">
          <Reveal>
            <h2 className="text-2xl font-semibold text-[#001a3d] sm:text-3xl">{timing.title}</h2>
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
            {timing.cards.map((item, i) => (
              <TypeCard key={item.title} title={item.title} purpose={item.purpose} focus={item.focus} benefit={item.benefit} index={i} equalHeight />
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-section bg-white">
        <div className="container-page space-y-10">
          <Reveal>
            <h2 className="text-2xl font-semibold text-[#001a3d] sm:text-3xl">{methodology.title}</h2>
          </Reveal>
          <div className="space-y-8 lg:space-y-10">
            {methodology.cards.map((item, i) => (
              <LogisticsPairedRow key={item.title} image={methodology.images[i] ?? methodology.images[0]} reversed={i % 2 === 1}>
                <TypeCard
                  title={item.title}
                  purpose={item.purpose}
                  focus={item.focus}
                  benefit={item.benefit}
                  techniques={item.bullets.length ? item.bullets : undefined}
                  index={i}
                />
              </LogisticsPairedRow>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-section bg-[var(--mist)]">
        <div className="container-page space-y-10">
          <Reveal>
            <h2 className="text-2xl font-semibold text-[#001a3d] sm:text-3xl">{scope.title}</h2>
          </Reveal>
          <LogisticsPairedRow image={scope.image}>
            <div className="space-y-8">
              {scope.cards.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.06} variant="right">
                  <article className="rounded-xl border border-[#d5d0c8] bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-[#001a3d]">{stripLeadingMarker(item.title)}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#555555]">{item.lead}</p>
                    <ul className="mt-4 space-y-2">
                      {item.bullets.map((b) => (
                        <li key={b} className="flex gap-2 text-sm leading-relaxed text-[#444444]">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c88e4a]" aria-hidden />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              ))}
            </div>
          </LogisticsPairedRow>
        </div>
      </section>

      <section className="marketing-section bg-white">
        <div className="container-page min-w-0">
          <Reveal>
            <h2 className="text-2xl font-semibold text-[#001a3d] sm:text-3xl">
              {summary.title}
            </h2>
          </Reveal>
          <div className="table-scroll mt-8 rounded-xl border border-[#d5d0c8] bg-white shadow-sm">
            <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[#001a3d] text-[0.7rem] uppercase tracking-wide text-white sm:text-xs">
                  <th className="px-4 py-3.5 font-semibold">Type</th>
                  <th className="px-4 py-3.5 font-semibold">Core focus</th>
                  <th className="px-4 py-3.5 font-semibold">Primary goal</th>
                </tr>
              </thead>
              <tbody>
                {summary.rows.map((row) => (
                  <tr key={row[0]} className="border-t border-[#e8e4dc] even:bg-[#faf9f6]">
                    <td className="px-4 py-4 align-top font-semibold text-[#001a3d]">{row[0]}</td>
                    <td className="px-4 py-4 align-top text-[#555555]">{row[1]}</td>
                    <td className="px-4 py-4 align-top text-[#555555]">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <MarketingAbstractBand
        className="border-y border-white/10 py-14 lg:py-16"
        imageSrc={validation.bandImageSrc}
        imageClassName="object-cover object-center saturate-[1.12] brightness-[1.06]"
        overlayClassName="bg-[#071525]/28"
        vignetteOpacity={0.1}
      >
        <div className="container-page space-y-12">
          <Reveal>
            <h2 className="text-2xl font-semibold sm:text-3xl">{validation.title}</h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/75 sm:text-base">
              {validation.lead}
            </p>
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-[#d5d0c8] border-t-[3px] border-t-[#c88e4a] bg-white/95 p-5 shadow-[0_10px_32px_rgba(0,26,61,0.14)] ring-1 ring-[#001a3d]/10 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#c88e4a]">Verification</p>
                <p className="mt-2 text-sm leading-relaxed text-[#555555]">
                  {validation.verification}
                </p>
              </div>
              <div className="rounded-xl border border-[#d5d0c8] border-t-[3px] border-t-[#c88e4a] bg-white/95 p-5 shadow-[0_10px_32px_rgba(0,26,61,0.14)] ring-1 ring-[#001a3d]/10 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#c88e4a]">Validation</p>
                <p className="mt-2 text-sm leading-relaxed text-[#555555]">
                  {validation.validation}
                </p>
              </div>
            </div>
            <p className="mt-6 text-sm text-white/85">{validation.intro}</p>
          </Reveal>
          <MotionImageFrame>
            <div className="relative aspect-[21/9] min-h-[200px] overflow-hidden rounded-xl border border-white/20 shadow-lg">
              <Image
                src={validation.featureImage.src}
                alt={validation.featureImage.alt}
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001a3d]/50 via-transparent to-transparent" />
            </div>
          </MotionImageFrame>
          <div className="grid gap-6 lg:grid-cols-2">
            {COMMODITY_VALIDATION_BAND_AREAS.map((area, i) => (
              <Reveal key={area.title} delay={i * 0.05} variant="up" bounce>
                <article className="h-full rounded-xl border border-[#d5d0c8] border-t-[3px] border-t-[#c88e4a] bg-white/95 p-6 shadow-[0_10px_32px_rgba(0,26,61,0.14)] ring-1 ring-[#001a3d]/10 backdrop-blur-sm sm:p-8">
                  <h3 className="text-lg font-semibold text-[#001a3d]">{stripLeadingMarker(area.title)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#555555]">{area.lead}</p>
                  <ul className="mt-4 space-y-2">
                    {area.bullets.map((b) => (
                      <li key={b} className="flex gap-2 text-sm leading-relaxed text-[#444444]">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c88e4a]" aria-hidden />
                        {b}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </MarketingAbstractBand>

      <section className="marketing-section bg-[var(--mist)]">
        <div className="container-page min-w-0 space-y-10">
          {COMMODITY_VALIDATION_TRAILING_AREA ? (
            <Reveal variant="up">
              <article className="rounded-xl border border-[#d5d0c8] bg-white p-6 shadow-sm sm:p-8">
                <h3 className="text-lg font-semibold text-[#001a3d]">
                  {stripLeadingMarker(COMMODITY_VALIDATION_TRAILING_AREA.title)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#555555]">
                  {COMMODITY_VALIDATION_TRAILING_AREA.lead}
                </p>
                <ul className="mt-4 space-y-2">
                  {COMMODITY_VALIDATION_TRAILING_AREA.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-sm leading-relaxed text-[#444444]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c88e4a]" aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ) : null}
          <Reveal>
            <h2 className="text-2xl font-semibold text-[#001a3d] sm:text-3xl">
              {comparison.title}
            </h2>
          </Reveal>
          <div className="table-scroll mt-8 rounded-xl border border-[#d5d0c8] bg-white shadow-sm">
            <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[#001a3d] text-[0.7rem] uppercase tracking-wide text-white sm:text-xs">
                  <th className="px-4 py-3.5 font-semibold">Aspect</th>
                  <th className="px-4 py-3.5 font-semibold">Focus</th>
                  <th className="px-4 py-3.5 font-semibold">Question</th>
                  <th className="px-4 py-3.5 font-semibold">Examples</th>
                </tr>
              </thead>
              <tbody>
                {comparison.rows.map((row) => (
                  <tr key={row[0]} className="border-t border-[#e8e4dc] even:bg-[#faf9f6]">
                    <td className="px-4 py-4 align-top font-semibold text-[#001a3d]">{row[0]}</td>
                    <td className="px-4 py-4 align-top text-[#555555]">{row[1]}</td>
                    <td className="px-4 py-4 align-top text-[#555555]">{row[2]}</td>
                    <td className="px-4 py-4 align-top text-[#555555]">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <InspectionFirmVideoStrip
        eyebrow={firmVideos.eyebrow}
        title={firmVideos.title}
        lead={firmVideos.lead}
      />

      <section className="marketing-section bg-white">
        <div className="container-page">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-[#d5d0c8] bg-[#001a3d] text-white shadow-lg">
              <div
                className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#e89a2d]/15 blur-3xl"
                aria-hidden
              />
              <div className="relative grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch">
                <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12 lg:pr-8">
                  <p className="text-xs font-semibold tracking-[0.22em] text-[#d4a84b] uppercase">{cta.eyebrow}</p>
                  <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">{cta.title}</h2>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">{cta.lead}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href={cta.primaryHref}
                      className="marketing-btn-primary px-6 py-3 text-sm font-semibold"
                    >
                      {cta.primaryLabel} <span aria-hidden>→</span>
                    </Link>
                    <Link
                      href={cta.secondaryHref}
                      className="rounded-md border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      {cta.secondaryLabel}
                    </Link>
                  </div>
                </div>

                <div className="relative min-h-[280px] border-t border-white/10 bg-[#0c2544] lg:min-h-0 lg:border-t-0 lg:border-l">
                  <div className="relative flex h-full flex-col justify-center p-8 sm:p-10 lg:p-12">
                    <p className="text-xs font-semibold tracking-[0.18em] text-[#d4a84b] uppercase">
                      {cta.shareTitle}
                    </p>
                    <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                      {cta.shareItems.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm leading-snug text-white/90"
                        >
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#e89a2d]" aria-hidden />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
