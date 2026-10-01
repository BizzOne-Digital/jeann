"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { MarketingStorySection } from "@/components/marketing/MarketingStorySection";
import { PartnerProfileCard } from "@/components/marketing/PartnerSections";
import { Reveal } from "@/components/motion/Reveal";
import {
  PARTNERS_PAGE_CTA,
  PARTNERS_PAGE_PILLARS,
} from "@/lib/content/partners-page-content";
import { PARTNERS_STORY } from "@/lib/content/marketing-pages";
import type { PartnerEntry } from "@/lib/content/partners-catalog";

export function PartnersPageSections({
  partners,
  introNote,
  introBody,
}: {
  partners: PartnerEntry[];
  introNote: string;
  introBody: string;
}) {
  const reduce = useReducedMotion();

  return (
    <>
      <MarketingStorySection
        eyebrow={PARTNERS_STORY.eyebrow}
        title={PARTNERS_STORY.title}
        lead={PARTNERS_STORY.lead}
        boxes={PARTNERS_STORY.boxes}
        imageSrc={PARTNERS_STORY.imageSrc}
        imageAlt={PARTNERS_STORY.imageAlt}
        youtubeUrl={PARTNERS_STORY.youtubeUrl}
        videoTitle="Verification partners overview"
        variant="reversed"
        background="cream"
      />

      <section className="border-y border-[var(--line)] bg-white marketing-section">
        <div className="container-page">
          <Reveal variant="blur-up">
            <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
              How appointments work
            </p>
            <h2 className="mt-2 max-w-2xl text-2xl font-semibold text-[#001a3d] sm:text-3xl">
              Finekarts sells the commodity — partners provide independent evidence
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {PARTNERS_PAGE_PILLARS.map((pillar, i) => (
              <Reveal key={pillar.title} delay={i * 0.07} variant="up" bounce>
                <article className="marketing-box marketing-box-motion h-full rounded-lg p-6">
                  <p className="text-xs font-bold tracking-[0.18em] text-[#c88e4a] uppercase">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-[#001a3d]">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#555555]">{pillar.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f3f1ec] marketing-section">
        <div className="container-page">
          <Reveal>
            <p className="max-w-3xl text-base leading-relaxed text-[var(--stone)]">{introNote}</p>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--stone)]">{introBody}</p>
          </Reveal>

          <div id="partners-list" className="mt-12 space-y-10 scroll-mt-28">
            {partners.map((partner, i) => (
              <motion.div
                key={partner.slug}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.06, 0.3), ease: [0.22, 1, 0.36, 1] }}
              >
                <PartnerProfileCard partner={partner} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#071525] py-16 text-white lg:py-20">
        <motion.div
          className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-[#d4a84b]/10 blur-3xl"
          animate={reduce ? undefined : { scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity }}
          aria-hidden
        />
        <div className="container-page relative">
          <Reveal>
            <h2 className="text-2xl font-semibold sm:text-3xl">{PARTNERS_PAGE_CTA.title}</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80">{PARTNERS_PAGE_CTA.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={PARTNERS_PAGE_CTA.primary.href}
                className="focus-ring inline-flex items-center gap-2 marketing-btn-primary px-6 py-3.5 text-sm font-semibold"
              >
                {PARTNERS_PAGE_CTA.primary.label}
              </Link>
              <Link
                href={PARTNERS_PAGE_CTA.secondary.href}
                className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/60 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {PARTNERS_PAGE_CTA.secondary.label}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
