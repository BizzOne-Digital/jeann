"use client";

import Image from "next/image";
import Link from "next/link";
import { MarketingAbstractBand } from "@/components/marketing/MarketingAbstractBand";
import { motion, useReducedMotion } from "framer-motion";
import {
  DUE_DILIGENCE_CORPORATE_IDENTITY,
  DUE_DILIGENCE_CTA,
  DUE_DILIGENCE_DOCUMENTATION,
  DUE_DILIGENCE_OVERVIEW,
  DUE_DILIGENCE_RISK_MATRIX,
  DUE_DILIGENCE_SUPPLY_CHAIN,
  DUE_DILIGENCE_SWIFT,
} from "@/lib/content/due-diligence-page-content";
import { DUE_DILIGENCE_PAGE_IMAGES } from "@/lib/content/due-diligence-page-images";
import { LogisticsPairedRow } from "@/components/marketing/LogisticsVisuals";
import { MotionImageFrame } from "@/components/motion/MotionImageFrame";
import { Reveal } from "@/components/motion/Reveal";

function SectionLabel({ n, title }: { n?: number; title: string }) {
  return (
    <div>
      {n != null ? (
        <p className="text-xs font-bold tracking-[0.24em] text-[#c88e4a] uppercase">Section {n}</p>
      ) : null}
      <h2 className="mt-2 text-2xl font-semibold text-[#001a3d] sm:text-3xl lg:text-4xl">{title}</h2>
    </div>
  );
}

function VerticalFlow({ steps, dark }: { steps: readonly string[]; dark?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <ol className="space-y-0">
      {steps.map((step, i) => (
        <li key={step} className="relative flex flex-col items-center">
          {i > 0 ? (
            <span className={dark ? "py-2 text-[#d4a84b]" : "py-2 text-[#c88e4a]"} aria-hidden>▼</span>
          ) : null}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className={
              dark
                ? "w-full max-w-md rounded-xl border border-white/15 bg-white/5 px-5 py-4 text-center text-sm font-medium text-white backdrop-blur-sm"
                : "w-full max-w-md rounded-xl border border-[#d5d0c8] bg-white px-5 py-4 text-center text-sm font-semibold text-[#001a3d] shadow-sm"
            }
          >
            {step}
          </motion.div>
        </li>
      ))}
    </ol>
  );
}

export function DueDiligencePageSections() {
  const reduce = useReducedMotion();

  return (
    <div id="due-diligence-overview" className="scroll-mt-20">
      <section className="marketing-section bg-white">
        <div className="container-page">
          <LogisticsPairedRow image={DUE_DILIGENCE_PAGE_IMAGES.overview}>
            <Reveal>
              <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">Overview</p>
              <h2 className="mt-3 text-2xl font-semibold text-[#001a3d] sm:text-3xl">{DUE_DILIGENCE_OVERVIEW.title}</h2>
              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="font-semibold text-[#001a3d]">Subject company</dt>
                  <dd className="mt-1 text-[#555555]">{DUE_DILIGENCE_OVERVIEW.subject}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#001a3d]">Industry</dt>
                  <dd className="mt-1 text-[#555555]">{DUE_DILIGENCE_OVERVIEW.industry}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#001a3d]">Evaluation scope</dt>
                  <dd className="mt-1 text-[#555555]">{DUE_DILIGENCE_OVERVIEW.scope}</dd>
                </div>
              </dl>
            </Reveal>
          </LogisticsPairedRow>
        </div>
      </section>

      <section className="marketing-section bg-[#f3f1ec]">
        <div className="container-page min-w-0 space-y-8">
          <Reveal>
            <SectionLabel n={DUE_DILIGENCE_CORPORATE_IDENTITY.n} title={DUE_DILIGENCE_CORPORATE_IDENTITY.title} />
          </Reveal>
          <Reveal>
            <div className="table-scroll rounded-xl border border-[#d5d0c8] bg-white shadow-sm">
              <table className="marketing-data-table marketing-data-table--fit text-left text-sm">
                <colgroup>
                  <col className="w-[24%]" />
                  <col className="w-[22%]" />
                  <col className="w-[54%]" />
                </colgroup>
                <thead>
                  <tr className="bg-[#001a3d] text-[0.7rem] uppercase tracking-wide text-white sm:text-xs">
                    <th className="px-4 py-3.5 font-semibold">Evaluation parameter</th>
                    <th className="px-4 py-3.5 font-semibold">Status / standard</th>
                    <th className="px-4 py-3.5 font-semibold">Verification mechanism</th>
                  </tr>
                </thead>
                <tbody>
                  {DUE_DILIGENCE_CORPORATE_IDENTITY.rows.map((row) => (
                    <tr key={row.parameter} className="border-t border-[#e8e4dc] even:bg-[#faf9f6]">
                      <td className="px-4 py-4 align-top font-semibold text-[#001a3d]">{row.parameter}</td>
                      <td className="px-4 py-4 align-top text-[#555555]">{row.status}</td>
                      <td className="px-4 py-4 align-top leading-relaxed text-[#555555]">{row.mechanism}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="marketing-section bg-white">
        <div className="container-page">
          <Reveal>
            <SectionLabel n={DUE_DILIGENCE_SUPPLY_CHAIN.n} title={DUE_DILIGENCE_SUPPLY_CHAIN.title} />
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#555555]">
              Diligence follows cargo and capital from origin through Finekarts to off-takers — with explicit
              checkpoints for concentration, documentation, and freight execution.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
            <Reveal variant="left">
              <div className="h-full rounded-xl border border-[#d5d0c8] bg-[#f3f1ec] p-6 sm:p-8">
                <p className="text-xs font-semibold tracking-[0.2em] text-[#c88e4a] uppercase">
                  Programme flow
                </p>
                <p className="mt-2 text-sm text-[#555555]">
                  How commodity, finance, and logistics layers connect on a typical trade.
                </p>
                <div className="mt-8 flex justify-center lg:justify-start">
                  <VerticalFlow steps={DUE_DILIGENCE_SUPPLY_CHAIN.flow} />
                </div>
              </div>
            </Reveal>
            <div>
              <Reveal variant="right">
                <p className="text-xs font-semibold tracking-[0.2em] text-[#c88e4a] uppercase">
                  Key operational risk areas
                </p>
                <h3 className="mt-2 text-lg font-semibold text-[#001a3d] sm:text-xl">
                  What we examine along the chain
                </h3>
              </Reveal>
              <ul className="mt-6 space-y-4">
                {DUE_DILIGENCE_SUPPLY_CHAIN.riskAreas.map((item, i) => (
                  <Reveal key={item.title} delay={i * 0.07} variant="up">
                    <li className="list-none rounded-xl border border-[#d5d0c8] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                      <p className="font-semibold text-[#001a3d]">{item.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-[#555555]">{item.body}</p>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="marketing-section bg-[#f3f1ec]">
        <div className="container-page min-w-0 space-y-8">
          <Reveal>
            <SectionLabel n={DUE_DILIGENCE_RISK_MATRIX.n} title={DUE_DILIGENCE_RISK_MATRIX.title} />
          </Reveal>
          <Reveal>
            <div className="table-scroll rounded-xl border border-[#d5d0c8] bg-white shadow-sm">
              <table className="marketing-data-table marketing-data-table--fit text-left text-sm">
                <colgroup>
                  <col className="w-[18%]" />
                  <col className="w-[41%]" />
                  <col className="w-[41%]" />
                </colgroup>
                <thead>
                  <tr className="bg-[#001a3d] text-[0.7rem] uppercase tracking-wide text-white sm:text-xs">
                    <th className="px-4 py-3.5 font-semibold">Domain</th>
                    <th className="px-4 py-3.5 font-semibold">Key risk indicators (KRIs)</th>
                    <th className="px-4 py-3.5 font-semibold">Recommended mitigation strategy</th>
                  </tr>
                </thead>
                <tbody>
                  {DUE_DILIGENCE_RISK_MATRIX.rows.map((row) => (
                    <tr key={row.domain} className="border-t border-[#e8e4dc] even:bg-[#faf9f6]">
                      <td className="px-4 py-4 align-top font-semibold text-[#001a3d]">{row.domain}</td>
                      <td className="px-4 py-4 align-top leading-relaxed text-[#555555]">{row.kris}</td>
                      <td className="px-4 py-4 align-top leading-relaxed text-[#555555]">{row.mitigation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="marketing-section bg-white">
        <div className="container-page">
          <Reveal>
            <SectionLabel n={DUE_DILIGENCE_DOCUMENTATION.n} title={DUE_DILIGENCE_DOCUMENTATION.title} />
          </Reveal>
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="grid gap-4 sm:grid-cols-2">
              {DUE_DILIGENCE_DOCUMENTATION.items.map((item, i) => (
                <motion.article
                  key={item.title}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-xl border border-[#d5d0c8] bg-white p-5 shadow-sm"
                >
                  <span className="text-xs font-bold text-[#c88e4a]">{i + 1}</span>
                  <h3 className="mt-2 text-base font-semibold text-[#001a3d]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#555555]">{item.body}</p>
                </motion.article>
              ))}
            </div>
            <MotionImageFrame>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[#d5d0c8]">
                <Image
                  src={DUE_DILIGENCE_PAGE_IMAGES.documentation.src}
                  alt={DUE_DILIGENCE_PAGE_IMAGES.documentation.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 480px"
                />
              </div>
            </MotionImageFrame>
          </div>
        </div>
      </section>

      <MarketingAbstractBand className="overflow-x-clip border-y border-white/10 py-14 lg:py-20">
        <div className="container-page min-w-0 space-y-14">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.22em] text-[#d4a84b] uppercase">SWIFT</p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">{DUE_DILIGENCE_SWIFT.title}</h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/75 sm:text-base">{DUE_DILIGENCE_SWIFT.intro}</p>
          </Reveal>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#d4a84b]">{DUE_DILIGENCE_SWIFT.primaryTitle}</h3>
            <Reveal>
              <div className="table-scroll rounded-xl border border-white/15 bg-white/5 shadow-sm">
                <table className="marketing-data-table marketing-data-table--fit text-left text-sm text-white">
                  <colgroup>
                    <col className="w-[18%]" />
                    <col className="w-[12%]" />
                    <col className="w-[30%]" />
                    <col className="w-[40%]" />
                  </colgroup>
                  <thead>
                    <tr className="bg-[#0c2544] text-[0.65rem] uppercase tracking-wide sm:text-xs">
                      <th className="px-3 py-3 font-semibold sm:px-4 sm:py-3.5">Category</th>
                      <th className="px-3 py-3 font-semibold sm:px-4 sm:py-3.5">MT</th>
                      <th className="px-3 py-3 font-semibold sm:px-4 sm:py-3.5">Name / purpose</th>
                      <th className="px-3 py-3 font-semibold sm:px-4 sm:py-3.5">Primary operational function</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DUE_DILIGENCE_SWIFT.primaryRows.map((row) => (
                      <tr key={row.mt} className="border-t border-white/10 even:bg-white/5">
                        <td className="px-3 py-3 align-top text-white/90 sm:px-4 sm:py-3.5">{row.category}</td>
                        <td className="px-3 py-3 align-top font-semibold text-[#d4a84b] sm:px-4 sm:py-3.5">{row.mt}</td>
                        <td className="px-3 py-3 align-top text-white/85 sm:px-4 sm:py-3.5">{row.name}</td>
                        <td className="px-3 py-3 align-top leading-relaxed text-white/75 sm:px-4 sm:py-3.5">
                          {row.function}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#d4a84b]">{DUE_DILIGENCE_SWIFT.profileTitle}</h3>
            <Reveal>
              <div className="table-scroll rounded-xl border border-white/15 bg-white/5 shadow-sm">
                <table className="marketing-data-table marketing-data-table--fit text-left text-sm text-white">
                  <colgroup>
                    <col className="w-[22%]" />
                    <col className="w-[44%]" />
                    <col className="w-[34%]" />
                  </colgroup>
                  <thead>
                    <tr className="bg-[#0c2544] text-[0.65rem] uppercase tracking-wide sm:text-xs">
                      <th className="px-3 py-3 font-semibold sm:px-4 sm:py-3.5">Field</th>
                      <th className="px-3 py-3 font-semibold sm:px-4 sm:py-3.5">Detail / specification</th>
                      <th className="px-3 py-3 font-semibold sm:px-4 sm:py-3.5">SWIFT MT application</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DUE_DILIGENCE_SWIFT.profileRows.map((row) => (
                      <tr key={row.field} className="border-t border-white/10 even:bg-white/5">
                        <td className="px-3 py-3 align-top font-semibold text-white sm:px-4 sm:py-3.5">{row.field}</td>
                        <td className="px-3 py-3 align-top text-white/85 sm:px-4 sm:py-3.5">{row.detail}</td>
                        <td className="px-3 py-3 align-top text-white/75 sm:px-4 sm:py-3.5">{row.swift}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#d4a84b]">{DUE_DILIGENCE_SWIFT.routingTitle}</h3>
            <ol className="mt-8 grid max-w-3xl gap-4 sm:grid-cols-2 lg:max-w-none lg:grid-cols-2">
              {DUE_DILIGENCE_SWIFT.routingSteps.map((step, i) => (
                <motion.li
                  key={step.role}
                  initial={reduce ? false : { opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex list-none gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d4a84b] text-xs font-bold text-[#001a3d]">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{step.role}</p>
                    <p className="mt-1 text-sm text-white/75">{step.action}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </MarketingAbstractBand>

      <section id="request-verification" className="relative scroll-mt-24 overflow-hidden py-16 text-white lg:py-20">
        <Image
          src={DUE_DILIGENCE_PAGE_IMAGES.cta.src}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          aria-hidden
        />
        <div className="absolute inset-0 bg-[#071525]/88" />
        <div className="container-page relative text-center">
          <Reveal>
            <h2 className="text-2xl font-semibold sm:text-3xl">{DUE_DILIGENCE_CTA.title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/80">{DUE_DILIGENCE_CTA.lead}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href={DUE_DILIGENCE_CTA.primaryHref}
                className="focus-ring marketing-btn-primary px-6 py-3.5 text-sm font-semibold"
              >
                {DUE_DILIGENCE_CTA.primaryLabel} <span aria-hidden>→</span>
              </Link>
              <Link
                href={DUE_DILIGENCE_CTA.secondaryHref}
                className="focus-ring rounded-md border border-white/70 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {DUE_DILIGENCE_CTA.secondaryLabel}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
