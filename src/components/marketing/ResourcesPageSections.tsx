"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ResourcesHub } from "@/components/marketing/ResourcesHub";
import { Reveal } from "@/components/motion/Reveal";
import { RESOURCES_PAGE_INTRO } from "@/lib/content/resources-page-content";

export function ResourcesPageSections({ introBody }: { introBody: string }) {
  const reduce = useReducedMotion();

  return (
    <>
      <section className="relative overflow-hidden border-b border-[#d5d0c8] bg-[#001a3d] py-14 text-white lg:py-16">
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            background:
              "radial-gradient(circle at 20% 50%, rgba(200,142,74,0.35), transparent 55%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.08), transparent 50%)",
          }}
          animate={reduce ? undefined : { opacity: [0.35, 0.5, 0.35] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="container-page relative">
          <Reveal variant="blur-up">
            <p className="text-xs font-semibold tracking-[0.22em] text-[#d4a84b] uppercase">
              {RESOURCES_PAGE_INTRO.eyebrow}
            </p>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold sm:text-3xl lg:text-4xl">
              {RESOURCES_PAGE_INTRO.title}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/80">{RESOURCES_PAGE_INTRO.lead}</p>
          </Reveal>
          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {RESOURCES_PAGE_INTRO.bullets.map((bullet, i) => (
              <Reveal key={bullet} delay={i * 0.06}>
                <li className="flex h-full gap-3 rounded-lg border border-white/12 bg-white/5 p-4 text-sm leading-relaxed text-white/85 backdrop-blur-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a84b]" aria-hidden />
                  {bullet}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <ResourcesHub introBody={introBody} />
    </>
  );
}
