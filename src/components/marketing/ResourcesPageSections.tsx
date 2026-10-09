"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MarketingAbstractBand } from "@/components/marketing/MarketingAbstractBand";
import { ResourcesHub } from "@/components/marketing/ResourcesHub";
import { Reveal } from "@/components/motion/Reveal";
import { ProductQualitySpotlight } from "@/components/marketing/ProductQualitySpotlight";
import { RESOURCES_PAGE_SPOTLIGHTS } from "@/lib/content/product-quality-spotlights";
import { RESOURCES_PAGE_INTRO } from "@/lib/content/resources-page-content";

export function ResourcesPageSections({ introBody }: { introBody: string }) {
  const reduce = useReducedMotion();

  return (
    <>
      <MarketingAbstractBand className="py-14 lg:py-16">
        <motion.div
          className="pointer-events-none absolute inset-0 z-[1] opacity-50"
          aria-hidden
          style={{
            background:
              "radial-gradient(circle at 20% 50%, rgba(200,142,74,0.35), transparent 55%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.08), transparent 50%)",
          }}
          animate={reduce ? undefined : { opacity: [0.4, 0.55, 0.4] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="container-page relative z-[2]">
          <Reveal variant="up">
            <p className="text-xs font-semibold tracking-[0.22em] text-[#d4a84b] uppercase">
              {RESOURCES_PAGE_INTRO.eyebrow}
            </p>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold sm:text-3xl lg:text-4xl">
              {RESOURCES_PAGE_INTRO.title}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/80">{RESOURCES_PAGE_INTRO.lead}</p>
          </Reveal>
          <ul className="mt-6 max-w-3xl space-y-2 text-sm leading-relaxed text-white/88">
            {RESOURCES_PAGE_INTRO.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a84b]" aria-hidden />
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </MarketingAbstractBand>

      <ProductQualitySpotlight spotlights={RESOURCES_PAGE_SPOTLIGHTS} variant="light" />

      <ResourcesHub introBody={introBody} />
    </>
  );
}
