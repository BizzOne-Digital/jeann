"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { LogisticsPairedRow } from "@/components/marketing/LogisticsVisuals";
import { MarketingAbstractBand } from "@/components/marketing/MarketingAbstractBand";
import { Reveal } from "@/components/motion/Reveal";
import {
  HOME_SITE_COMPANY_LINKS,
  HOME_SITE_OVERVIEW_INTRO,
  HOME_SITE_TRADE_SECTIONS,
  type HomeOverviewTradeSection,
} from "@/lib/content/home-site-overview";

function TradeOverviewRow({
  section,
  reversed,
  tone,
}: {
  section: HomeOverviewTradeSection;
  reversed: boolean;
  tone: "light" | "cream";
}) {
  const bg = tone === "cream" ? "bg-[#f3f1ec]" : "bg-white";

  return (
    <section className={`${bg} overflow-x-clip py-14 lg:py-20`}>
      <div className="container-page min-w-0">
        <LogisticsPairedRow image={section.image} reversed={reversed} boxed>
          <Reveal variant={reversed ? "right" : "left"}>
            <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">{section.eyebrow}</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#001a3d] sm:text-3xl lg:text-4xl">{section.title}</h2>
            <p className="mt-4 text-base leading-relaxed text-[#555555]">{section.lead}</p>
            <ul className="mt-6 space-y-2">
              {section.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2 text-sm text-[#555555]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a84b]" aria-hidden />
                  {bullet}
                </li>
              ))}
            </ul>
            <Link
              href={section.href}
              className="focus-ring mt-8 inline-flex w-full max-w-full items-center justify-center gap-2 marketing-btn-primary px-6 py-3.5 text-sm font-semibold sm:w-auto sm:justify-start"
            >
              {section.ctaLabel}
            </Link>
          </Reveal>
        </LogisticsPairedRow>
      </div>
    </section>
  );
}

export function HomeSiteOverviewIntro() {
  const reduce = useReducedMotion();

  return (
    <MarketingAbstractBand className="border-y border-[#d5d0c8] py-14 lg:py-16">
      <div className="container-page text-center">
        <Reveal variant="blur-up">
          <p className="text-xs font-semibold tracking-[0.24em] text-[#d4a84b] uppercase">
            {HOME_SITE_OVERVIEW_INTRO.eyebrow}
          </p>
          <h2 className="mx-auto mt-3 max-w-3xl text-2xl font-semibold sm:text-3xl lg:text-4xl">
            {HOME_SITE_OVERVIEW_INTRO.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/80">
            {HOME_SITE_OVERVIEW_INTRO.lead}
          </p>
        </Reveal>
        <motion.div
          className="mx-auto mt-10 h-1 max-w-xs rounded-full bg-gradient-to-r from-transparent via-[#d4a84b] to-transparent"
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </MarketingAbstractBand>
  );
}

export function HomeSiteTradeOverview() {
  return (
    <>
      {HOME_SITE_TRADE_SECTIONS.map((section, index) => (
        <TradeOverviewRow
          key={section.id}
          section={section}
          reversed={index % 2 === 1}
          tone={index % 2 === 0 ? "light" : "cream"}
        />
      ))}
    </>
  );
}

export function HomeSiteCompanyGrid() {
  return (
    <section className="bg-[#0a1628] py-14 text-white lg:py-20">
      <div className="container-page">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.22em] text-[#d4a84b] uppercase">Company</p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">People, answers, and next steps</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75">
            Learn who supports your programme, read common questions, explore careers, or message the trade desk.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {HOME_SITE_COMPANY_LINKS.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.06} variant="up" bounce>
              <Link
                href={item.href}
                className="group flex h-full flex-col overflow-hidden rounded-lg border border-white/12 bg-white/[0.04] transition hover:border-[#d4a84b]/50 hover:bg-white/[0.08]"
              >
                <div className="relative aspect-[16/10] min-h-[140px] overflow-hidden bg-[#122033]">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    className="object-cover object-center transition duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, 280px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/75 via-[#0a1628]/15 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-semibold text-white group-hover:text-[#d4a84b]">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-white/70">{item.summary}</p>
                  <span className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#d4a84b]">
                    {item.ctaLabel}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.12}>
          <div className="mt-10 flex flex-wrap justify-center gap-3 border-t border-white/10 pt-10">
            <Link
              href="/about"
              className="rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-[#d4a84b] hover:text-[#d4a84b]"
            >
              About Finekarts →
            </Link>
            <Link
              href="/testimonials"
              className="rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-[#d4a84b] hover:text-[#d4a84b]"
            >
              Client testimonials →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
