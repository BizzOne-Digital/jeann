"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  INSIGHTS_ARCHITECTURE,
  INSIGHTS_CONTAINMENT_MATRIX,
  INSIGHTS_CTA,
  INSIGHTS_HERO,
  INSIGHTS_LIFECYCLE,
  INSIGHTS_PROTOCOL,
  INSIGHTS_SOP,
  INSIGHTS_VALIDATION,
  INSIGHTS_VERIFICATION_VS_VALIDATION,
} from "@/lib/content/operational-insights-content";
import { INSIGHTS_SECTION_IMAGES } from "@/lib/content/insights-operational-images";
import { LogisticsPairedRow } from "@/components/marketing/LogisticsVisuals";
import { MotionImageFrame } from "@/components/motion/MotionImageFrame";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils/cn";

const DOMAIN_IMAGES: Partial<Record<string, { src: string; alt: string }>> = {
  lab: INSIGHTS_SECTION_IMAGES.labValidation,
  supply: INSIGHTS_SECTION_IMAGES.supplyChainValidation,
  finance: INSIGHTS_SECTION_IMAGES.financeValidation,
  ctrm: INSIGHTS_SECTION_IMAGES.ctrmValidation,
};

function SectionHeading({
  n,
  title,
  lead,
  className = "",
}: {
  n?: number;
  title: string;
  lead?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {n != null ? (
        <p className="text-xs font-bold tracking-[0.24em] text-[#c88e4a] uppercase">Section {n}</p>
      ) : null}
      <h2 className="mt-2 text-2xl font-semibold text-[#001a3d] sm:text-3xl lg:text-4xl">{title}</h2>
      {lead ? (
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#555555] sm:text-base">{lead}</p>
      ) : null}
    </div>
  );
}

function LifecycleFunnel() {
  const reduce = useReducedMotion();
  return (
    <div className="mt-10 space-y-0">
      {INSIGHTS_LIFECYCLE.map((stage, index) => (
        <motion.div
          key={stage.phase}
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.45, delay: index * 0.1 }}
          className="relative"
        >
          {index > 0 ? (
            <div className="flex justify-center py-2" aria-hidden>
              <span className="text-[#c88e4a] text-lg">▼</span>
            </div>
          ) : null}
          <article
            className={cn(
              "overflow-hidden rounded-xl border border-[#d5d0c8] bg-white shadow-sm",
              index === 1 && "ring-2 ring-[#c88e4a]/30",
            )}
          >
            <div className="bg-gradient-to-r from-[#001a3d] to-[#0c2544] px-6 py-4 text-white sm:px-8">
              <p className="text-xs font-semibold tracking-[0.16em] text-[#d4a84b] uppercase">
                {stage.subtitle}
              </p>
              <h3 className="mt-1 text-lg font-semibold sm:text-xl">{stage.phase}</h3>
            </div>
            <ul className="grid gap-2 p-6 sm:grid-cols-2 sm:p-8">
              {stage.bullets.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-relaxed text-[#444444]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c88e4a]" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </motion.div>
      ))}
    </div>
  );
}

function ProtocolPipeline() {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-2">
      {INSIGHTS_PROTOCOL.pipeline.map((step, i) => (
        <Reveal key={step.label} delay={i * 0.06} variant="zoom" bounce className="w-full sm:flex sm:max-w-[11rem] sm:flex-1 sm:items-center sm:gap-2">
          <div className="flex h-full w-full flex-col rounded-lg border border-[#d5d0c8] bg-white p-4 text-center shadow-sm">
            <p className="text-sm font-semibold text-[#001a3d]">{step.label}</p>
            <p className="mt-1 text-xs text-[#777]">{step.note}</p>
          </div>
          {i < INSIGHTS_PROTOCOL.pipeline.length - 1 ? (
            <span className="hidden shrink-0 text-center text-[#c88e4a] sm:inline" aria-hidden>→</span>
          ) : null}
        </Reveal>
      ))}
    </div>
  );
}

export function InsightsOperationalPage() {
  return (
    <div id="insights-framework" className="scroll-mt-20">
      <section className="marketing-section bg-white">
        <div className="container-page">
          <LogisticsPairedRow image={INSIGHTS_SECTION_IMAGES.introLab}>
            <Reveal>
              <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
                Framework overview
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#555555] sm:text-base">
                {INSIGHTS_HERO.guideLead}
              </p>
            </Reveal>
          </LogisticsPairedRow>
        </div>
      </section>

      <section className="marketing-section bg-[var(--mist)]">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              n={INSIGHTS_ARCHITECTURE.n}
              title={INSIGHTS_ARCHITECTURE.title}
              lead={INSIGHTS_ARCHITECTURE.lead}
            />
          </Reveal>
          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-start">
            <LifecycleFunnel />
            <LogisticsPairedRow image={INSIGHTS_SECTION_IMAGES.architecture} className="lg:sticky lg:top-28">
              <p className="text-xs font-semibold tracking-[0.18em] text-[#c88e4a] uppercase">
                {INSIGHTS_VERIFICATION_VS_VALIDATION.title}
              </p>
              <div className="mt-5 space-y-5">
                <div className="rounded-lg border border-[#e0dbd3] bg-white p-5">
                  <p className="text-sm font-semibold text-[#001a3d]">
                    {INSIGHTS_VERIFICATION_VS_VALIDATION.verification.label}
                  </p>
                  <p className="mt-2 text-sm italic text-[#666]">
                    {INSIGHTS_VERIFICATION_VS_VALIDATION.verification.question}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#555555]">
                    {INSIGHTS_VERIFICATION_VS_VALIDATION.verification.body}
                  </p>
                </div>
                <div className="rounded-lg border border-[#001a3d]/15 bg-[#001a3d] p-5 text-white">
                  <p className="text-sm font-semibold text-[#d4a84b]">
                    {INSIGHTS_VERIFICATION_VS_VALIDATION.validation.label}
                  </p>
                  <p className="mt-2 text-sm italic text-white/75">
                    {INSIGHTS_VERIFICATION_VS_VALIDATION.validation.question}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">
                    {INSIGHTS_VERIFICATION_VS_VALIDATION.validation.body}
                  </p>
                </div>
              </div>
            </LogisticsPairedRow>
          </div>
        </div>
      </section>

      <section className="marketing-section bg-white">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              n={INSIGHTS_PROTOCOL.n}
              title={INSIGHTS_PROTOCOL.title}
              lead={INSIGHTS_PROTOCOL.lead}
            />
          </Reveal>
          <ProtocolPipeline />
          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <div className="space-y-4">
              {INSIGHTS_PROTOCOL.tiers.map((tier, i) => (
                <Reveal key={tier.n} delay={i * 0.05} variant="right">
                  <article className="flex gap-4 rounded-xl border border-[#d5d0c8] bg-[#faf9f6] p-5">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#001a3d] text-sm font-bold text-[#d4a84b]"
                    >
                      {tier.n}
                    </span>
                    <div>
                      <h3 className="font-semibold text-[#001a3d]">{tier.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#555555]">{tier.body}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
            <Reveal variant="left" delay={0.08}>
              <MotionImageFrame>
                <div className="relative min-h-[280px] overflow-hidden rounded-xl border border-[#d5d0c8] shadow-lg lg:min-h-[480px]">
                  <Image
                    src={INSIGHTS_SECTION_IMAGES.protocolLoading.src}
                    alt={INSIGHTS_SECTION_IMAGES.protocolLoading.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 480px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071525]/40 via-transparent to-transparent" />
                </div>
              </MotionImageFrame>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#001a3d] py-14 text-white lg:py-16">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              n={INSIGHTS_VALIDATION.n}
              title={INSIGHTS_VALIDATION.title}
              lead={INSIGHTS_VALIDATION.lead}
              className="[&_h2]:text-white [&_p]:text-white/70"
            />
          </Reveal>
          <div className="mt-8 flex flex-wrap gap-2">
            {INSIGHTS_VALIDATION.pillars.map((p, i) => (
              <Reveal key={p} delay={i * 0.04} variant="up">
                <span className="rounded-full border border-[#d4a84b]/40 bg-white/5 px-4 py-2 text-xs font-semibold text-white/90">
                  {p}
                </span>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 overflow-hidden rounded-xl border border-white/10">
            <MotionImageFrame>
              <div className="relative aspect-[21/9] min-h-[200px]">
                <Image
                  src={INSIGHTS_SECTION_IMAGES.validationOverview.src}
                  alt={INSIGHTS_SECTION_IMAGES.validationOverview.alt}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#001a3d]/80 via-[#001a3d]/40 to-transparent" />
              </div>
            </MotionImageFrame>
          </div>
        </div>
      </section>

      <section className="marketing-section bg-[var(--mist)]">
        <div className="container-page space-y-10">
          {INSIGHTS_VALIDATION.domains.map((domain, index) => {
            const image = DOMAIN_IMAGES[domain.id];
            const reversed = index % 2 === 1;
            const body = (
              <>
                <p className="text-xs font-bold tracking-[0.2em] text-[#c88e4a]">{domain.roman}</p>
                <h3 className="mt-2 text-xl font-semibold text-[#001a3d]">{domain.title}</h3>
                {"lead" in domain && domain.lead ? (
                  <p className="mt-3 text-sm leading-relaxed text-[#555555]">{domain.lead}</p>
                ) : null}
                <ul className="mt-4 space-y-3">
                  {domain.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-sm leading-relaxed text-[#444444]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c88e4a]" aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>
              </>
            );
            if (!image) {
              return (
                <Reveal key={domain.id} variant="up" delay={index * 0.05}>
                  <article className="rounded-xl border border-[#d5d0c8] bg-white p-6 shadow-sm sm:p-8">{body}</article>
                </Reveal>
              );
            }
            return (
              <LogisticsPairedRow key={domain.id} image={image} reversed={reversed} boxed>
                {body}
              </LogisticsPairedRow>
            );
          })}
        </div>
      </section>

      <section className="marketing-section bg-white">
        <div className="container-page min-w-0">
          <Reveal>
            <SectionHeading
              n={INSIGHTS_CONTAINMENT_MATRIX.n}
              title={INSIGHTS_CONTAINMENT_MATRIX.title}
              lead={INSIGHTS_CONTAINMENT_MATRIX.lead}
            />
          </Reveal>

          <div className="table-scroll mt-8 rounded-xl border border-[#d5d0c8] bg-white shadow-sm">
            <table className="marketing-data-table min-w-[72rem] text-left text-sm">
              <colgroup>
                <col className="w-[11%]" />
                <col className="w-[14%]" />
                <col className="w-[22%]" />
                <col className="w-[16%]" />
                <col className="w-[37%]" />
              </colgroup>
              <thead>
                <tr className="bg-[#001a3d] text-[0.7rem] uppercase tracking-wide text-white sm:text-xs">
                  <th className="px-4 py-3.5 font-semibold">Classification</th>
                  <th className="px-4 py-3.5 font-semibold">Typical specs</th>
                  <th className="px-4 py-3.5 font-semibold">Packaging / containment</th>
                  <th className="px-4 py-3.5 font-semibold">Unit weight / volume</th>
                  <th className="px-4 py-3.5 font-semibold">Operational hazards</th>
                </tr>
              </thead>
              <tbody>
                {INSIGHTS_CONTAINMENT_MATRIX.rows.map((row) => (
                  <tr key={row.classification} className="border-t border-[#e8e4dc] bg-white even:bg-[#faf9f6]">
                    <td className="px-4 py-4 align-top font-semibold text-[#001a3d]">{row.classification}</td>
                    <td className="px-4 py-4 align-top leading-relaxed text-[#555555]">{row.specs}</td>
                    <td className="px-4 py-4 align-top leading-relaxed text-[#555555]">{row.packaging}</td>
                    <td className="px-4 py-4 align-top leading-relaxed text-[#555555]">{row.unit}</td>
                    <td className="px-4 py-4 align-top leading-relaxed text-[#555555]">{row.hazards}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-center text-xs text-[#888] sm:text-left">
            Swipe or scroll horizontally on smaller screens to view all columns.
          </p>
        </div>
      </section>

      <section id="insights-sop-checklist" className="scroll-mt-24 marketing-section bg-[#071525] text-white">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              n={INSIGHTS_SOP.n}
              title={INSIGHTS_SOP.title}
              lead={INSIGHTS_SOP.lead}
              className="[&_h2]:text-white [&_p]:text-white/70"
            />
          </Reveal>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {INSIGHTS_SOP.phases.map((phase, i) => (
              <Reveal key={phase.title} delay={i * 0.08} variant="up" bounce>
                <article className="h-full rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <h3 className="text-base font-semibold text-[#d4a84b]">{phase.title}</h3>
                  <ul className="mt-4 space-y-3">
                    {phase.items.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/80">
                        <span
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-[#d4a84b]/50 text-[10px] text-[#d4a84b]"
                          aria-hidden
                        >
                          ✓
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-section bg-white">
        <div className="container-page">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-[#d5d0c8] bg-gradient-to-br from-[#001a3d] via-[#0c2544] to-[#001a3d] p-8 text-white sm:p-10 lg:p-12">
              <div
                className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-[#e89a2d]/10 blur-3xl"
                aria-hidden
              />
              <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
                <div>
                  <h2 className="text-2xl font-semibold sm:text-3xl">{INSIGHTS_CTA.title}</h2>
                  <p className="mt-4 text-sm leading-relaxed text-white/75 sm:text-base">{INSIGHTS_CTA.lead}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href={INSIGHTS_CTA.primaryHref}
                      className="marketing-btn-primary px-6 py-3 text-sm font-semibold"
                    >
                      {INSIGHTS_CTA.primaryLabel} <span aria-hidden>→</span>
                    </Link>
                    <Link
                      href={INSIGHTS_CTA.secondaryHref}
                      className="rounded-md border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      {INSIGHTS_CTA.secondaryLabel}
                    </Link>
                  </div>
                </div>
                <div className="rounded-xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm sm:p-7">
                  <p className="text-xs font-semibold tracking-[0.18em] text-[#d4a84b] uppercase">
                    {INSIGHTS_CTA.shareTitle}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {INSIGHTS_CTA.shareItems.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/85">
                        <span
                          className="mt-1.5 flex h-2 w-2 shrink-0 rounded-full bg-[#e89a2d]"
                          aria-hidden
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/login"
                    className="mt-6 inline-flex text-sm font-semibold text-[#e89a2d] transition hover:text-white"
                  >
                    Buyer portal — submit after sign-in <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
