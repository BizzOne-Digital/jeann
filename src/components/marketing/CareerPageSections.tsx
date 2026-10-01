"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  CAREERS_FORM,
  CAREERS_INTRO,
  CAREERS_PAGE_HERO,
} from "@/lib/content/careers-page-content";
import { CAREERS_PAGE_IMAGES } from "@/lib/content/careers-page-images";
import { CareerApplicantAuth } from "@/components/marketing/CareerApplicantAuth";
import { CareerApplicationForm } from "@/components/marketing/CareerApplicationForm";
import type { CareerFormPrefill } from "@/lib/auth/career-prefill";
import { LogisticsPairedRow } from "@/components/marketing/LogisticsVisuals";
import { Reveal } from "@/components/motion/Reveal";

export function CareerPageSections({
  signedIn,
  prefill,
}: {
  signedIn: boolean;
  prefill?: CareerFormPrefill;
}) {
  const reduce = useReducedMotion();

  return (
    <>
      <section className="marketing-section bg-white">
        <div className="container-page">
          <LogisticsPairedRow image={CAREERS_PAGE_IMAGES.interview} reversed>
            <Reveal>
              <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
                {CAREERS_PAGE_HERO.eyebrow}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[#001a3d] sm:text-3xl">{CAREERS_INTRO.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-[#555555] sm:text-base">{CAREERS_INTRO.lead}</p>
            </Reveal>
          </LogisticsPairedRow>
        </div>
      </section>

      <section className="border-y border-[#e8e4dc] bg-[#f3f1ec] py-12 lg:py-16">
        <div className="container-page">
          <div className="grid gap-6 md:grid-cols-3">
            {CAREERS_INTRO.pillars.map((pillar, i) => (
              <motion.article
                key={pillar.title}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-xl border border-[#d5d0c8] bg-white p-6 shadow-sm"
              >
                <span className="text-xs font-bold tracking-[0.2em] text-[#c88e4a]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-[#001a3d]">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#555555]">{pillar.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="career-application" className="scroll-mt-24 bg-white marketing-section">
        <div className="container-page space-y-10">
          <Reveal>
            <div className="max-w-3xl">
              <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">Application</p>
              <h2 className="mt-3 text-2xl font-semibold text-[#001a3d] sm:text-3xl">{CAREERS_FORM.title}</h2>
            </div>
          </Reveal>

          {!signedIn ? (
            <CareerApplicantAuth />
          ) : (
            <Reveal delay={0.06}>
              <div className="rounded-xl border border-[#d4a84b]/35 bg-[#fffaf3] px-5 py-4 text-sm text-[#444444]">
                Signed in as <span className="font-semibold text-[#001a3d]">{prefill?.email}</span>. Complete
                the questionnaire below and upload your dossier.
              </div>
              <CareerApplicationForm className="mt-8" prefill={prefill} />
            </Reveal>
          )}
        </div>
      </section>

      <section className="bg-[#001a3d] py-14 text-center text-white lg:py-16">
        <div className="container-page mx-auto max-w-3xl">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] text-[#d4a84b] uppercase">Equal opportunity</p>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
              Finekarts welcomes applications from qualified professionals. All submissions are reviewed
              confidentially by HR and hiring managers.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
