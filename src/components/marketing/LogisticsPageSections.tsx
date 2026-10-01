"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  LogisticsFullBleedBand,
  LogisticsPairedStack,
  LogisticsPhotoBackdropSection,
  LogisticsPairedRow,
  LogisticsSplitPanel,
} from "@/components/marketing/LogisticsVisuals";
import { MarketingStorySection } from "@/components/marketing/MarketingStorySection";
import { Reveal } from "@/components/motion/Reveal";
import {
  LOGISTICS_PAGE_SECTION_IMAGES,
  LOGISTICS_SHIP_TRUCK_BAND,
} from "@/lib/content/logistics-images";
import type { BuiltLogisticsContent } from "@/lib/marketing/logistics-cms";

function LogisticsDivider() {
  const reduce = useReducedMotion();
  return (
    <div className="relative overflow-hidden bg-[#001a3d] py-3" aria-hidden>
      <motion.div
        className="h-1 w-[200%] bg-gradient-to-r from-[#c88e4a] via-[#d4a84b] to-[#c88e4a]"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export function LogisticsPageSections({ content }: { content: BuiltLogisticsContent }) {
  const story = content.story;
  const reduce = useReducedMotion();

  return (
    <>
      <MarketingStorySection
        eyebrow={story.eyebrow}
        title={story.title}
        lead={story.lead}
        boxes={story.boxes}
        imageSrc={story.imageSrc}
        imageAlt={story.imageAlt}
        youtubeUrl={story.youtubeUrl}
        videoTitle="Logistics overview"
        variant="reversed"
        background="cream"
      />

      <section id="incoterms" className="bg-[#f3f1ec] marketing-section">
        <div className="container-page">
          <LogisticsSplitPanel image={LOGISTICS_PAGE_SECTION_IMAGES.globalCoverage} reversed>
            <Reveal>
              <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
                Global coverage
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[#001a3d] sm:text-3xl lg:text-4xl">
                {content.globalCoverage.title}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[#555555]">{content.globalCoverage.lead}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {content.globalCoverage.incoterms.map((term, i) => (
                  <motion.span
                    key={term}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="rounded-full border border-[#d5d0c8] bg-white px-4 py-2 text-sm font-medium text-[#001a3d] shadow-sm"
                  >
                    {term}
                  </motion.span>
                ))}
              </div>
              <p className="mt-6 text-sm text-[#555555]">{content.globalCoverage.note}</p>
            </Reveal>
          </LogisticsSplitPanel>

          <div className="mt-12">
            <Reveal>
              <p className="text-sm font-semibold text-[#001a3d]">
                <Link
                  href={content.incotermsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#c88e4a] underline decoration-[#c88e4a]/40 underline-offset-4 hover:text-[#a86f2e]"
                >
                  FOB, CIF &amp; DDP — ICC Incoterms® 2020
                </Link>
              </p>
            </Reveal>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {content.fobCifTerms.map((term, index) => (
                <Reveal key={term.code} delay={index * 0.05} variant="up" bounce>
                  <article className="marketing-box marketing-box-motion h-full rounded-lg p-6 sm:p-8">
                    <p className="text-xs font-semibold tracking-[0.2em] text-[#c88e4a] uppercase">
                      {term.code}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-[#001a3d]">{term.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#555555]">{term.summary}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal>
            <p className="mt-8 text-sm font-medium text-[#001a3d]">{content.incotermsPrimaryNote}</p>
          </Reveal>
        </div>
      </section>

      <LogisticsFullBleedBand image={LOGISTICS_SHIP_TRUCK_BAND} />

      <section className="bg-white marketing-section">
        <div className="container-page">
          <LogisticsPairedStack
            rows={[
              {
                image: LOGISTICS_PAGE_SECTION_IMAGES.realTimeTrackingPrimary,
                content: (
                  <Reveal>
                    <h2 className="text-2xl font-semibold text-[#001a3d] sm:text-3xl">{content.tracking.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-[#555555]">{content.tracking.lead}</p>
                    <ul className="mt-4 space-y-2">
                      {content.tracking.items.map((item) => (
                        <li key={item} className="flex gap-2 text-sm text-[#555555]">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a84b]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-sm text-[#555555]">{content.tracking.note}</p>
                  </Reveal>
                ),
              },
              {
                image: LOGISTICS_PAGE_SECTION_IMAGES.realTimeTrackingSecondary,
                boxed: true,
                content: (
                  <Reveal delay={0.08}>
                    <h2 className="text-xl font-semibold text-[#001a3d]">{content.eta.title}</h2>
                    <p className="mt-3 text-sm text-[#555555]">{content.eta.lead}</p>
                    <p className="mt-4 rounded-md bg-[#f9f8f5] px-4 py-3 text-xs font-medium leading-relaxed text-[#001a3d]">
                      {content.eta.flow}
                    </p>
                    <p className="mt-4 text-sm text-[#555555]">{content.eta.note}</p>
                    <p className="mt-6 text-sm font-semibold text-[#c88e4a]">{content.eta.goal}</p>
                  </Reveal>
                ),
              },
            ]}
          />
        </div>
      </section>

      <section className="bg-[#f3f1ec] marketing-section">
        <div className="container-page">
          <LogisticsSplitPanel image={LOGISTICS_PAGE_SECTION_IMAGES.portToPort} reversed>
            <Reveal>
              <h2 className="text-2xl font-semibold text-[#001a3d] sm:text-3xl">{content.portChain.title}</h2>
              <p className="mt-3 text-base text-[#555555]">{content.portChain.lead}</p>
              <ol className="mt-8 space-y-3">
                {content.portChain.steps.map((step, index) => (
                  <li key={step} className="flex items-start gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#071525] text-xs font-semibold text-[#d4a84b]">
                      {index + 1}
                    </span>
                    <span className="pt-1 text-sm text-[#555555]">{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-sm text-[#555555]">{content.portChain.note}</p>
            </Reveal>
          </LogisticsSplitPanel>
        </div>
      </section>

      <LogisticsDivider />

      <section className="bg-white marketing-section">
        <div className="container-page">
          <Reveal>
            <h2 className="text-2xl font-semibold text-[#001a3d] sm:text-3xl">{content.shippingModesIntro.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#555555]">
              {content.shippingModesIntro.description}
            </p>
          </Reveal>
          {(() => {
            const [bulkVessel, ...otherModes] = content.shippingModes;
            const surfaces = [
              "bg-white",
              "bg-[#f9f8f5]",
              "bg-[#eef3f7]",
              "bg-[#faf6f0]",
              "bg-[#f5f0e8]",
              "bg-[#f0f4f8]",
            ];
            return (
              <>
                {bulkVessel ? (
                  <div className="mt-10">
                    <LogisticsPairedRow
                      image={LOGISTICS_PAGE_SECTION_IMAGES.bulkVesselMode}
                      reversed
                      boxed
                    >
                      <h3 className="font-semibold text-[#001a3d]">{bulkVessel.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#555555]">{bulkVessel.text}</p>
                    </LogisticsPairedRow>
                  </div>
                ) : null}
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {otherModes.map((mode, index) => (
                    <Reveal key={mode.title} delay={index * 0.04} variant="up">
                      <article
                        className={`h-full rounded-lg border border-[#e8e4dc] p-5 sm:p-6 shadow-sm transition hover:shadow-md ${surfaces[(index + 1) % surfaces.length]}`}
                      >
                        <h3 className="font-semibold text-[#001a3d]">{mode.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#555555]">{mode.text}</p>
                      </article>
                    </Reveal>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      </section>

      <section className="bg-[#f3f1ec] marketing-section">
        <div className="container-page">
          <LogisticsPairedRow image={LOGISTICS_PAGE_SECTION_IMAGES.documentation}>
            <Reveal>
              <h2 className="text-2xl font-semibold text-[#001a3d]">{content.documentation.title}</h2>
              <p className="mt-3 text-base text-[#555555]">{content.documentation.lead}</p>
              <p className="mt-4 text-sm font-medium text-[#001a3d]">{content.documentation.intro}</p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {content.documentation.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-[#555555]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a84b]" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-[#555555]">{content.documentation.note}</p>
            </Reveal>
          </LogisticsPairedRow>
        </div>
      </section>

      <section className="bg-white marketing-section">
        <div className="container-page">
          <LogisticsPairedStack
            rows={[
              {
                image: LOGISTICS_PAGE_SECTION_IMAGES.coordinationPrimary,
                reversed: true,
                boxed: true,
                content: (
                  <Reveal>
                    <h2 className="text-xl font-semibold text-[#001a3d]">{content.coordination.title}</h2>
                    <p className="mt-3 text-sm text-[#555555]">{content.coordination.lead}</p>
                    <p className="mt-4 rounded-md bg-[#f9f8f5] px-4 py-3 text-xs font-medium leading-relaxed text-[#001a3d]">
                      {content.coordination.parties}
                    </p>
                    <p className="mt-4 text-sm text-[#555555]">{content.coordination.note}</p>
                  </Reveal>
                ),
              },
              {
                image: LOGISTICS_PAGE_SECTION_IMAGES.coordinationSecondary,
                reversed: true,
                content: (
                  <Reveal delay={0.06}>
                    <h2 className="text-xl font-semibold text-[#001a3d]">{content.reliability.title}</h2>
                    <p className="mt-3 text-sm text-[#555555]">{content.reliability.lead}</p>
                    <ul className="mt-4 space-y-2">
                      {content.reliability.items.map((item) => (
                        <li key={item} className="flex gap-2 text-sm text-[#555555]">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a84b]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-sm font-semibold text-[#001a3d]">{content.reliability.commitment}</p>
                    <p className="mt-4 text-xs leading-relaxed text-[#777777]">{content.reliability.disclaimer}</p>
                  </Reveal>
                ),
              },
            ]}
          />
        </div>
      </section>

      <LogisticsPhotoBackdropSection image={LOGISTICS_PAGE_SECTION_IMAGES.contractToCargo}>
        <Reveal variant="blur-up">
          <h2 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">{content.contractBand.title}</h2>
          <p className="mt-3 max-w-3xl text-sm text-white/75">{content.contractBand.lead}</p>
        </Reveal>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.contractCargoSteps.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.04}>
              <li
                className="list-none rounded-lg border border-white/15 bg-[#071525]/45 p-5 shadow-lg backdrop-blur-md transition hover:border-[#d4a84b]/40"
              >
                <p className="text-xs font-semibold tracking-[0.2em] text-[#d4a84b] uppercase">
                  {String(step.step).padStart(2, "0")} — {step.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/85">{step.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </LogisticsPhotoBackdropSection>

      <section className="bg-[#f3f1ec] marketing-section">
        <div className="container-page">
          <Reveal>
            <div className="rounded-xl border border-[#d5d0c8] bg-white p-8 shadow-sm sm:p-10 lg:p-12">
              <h2 className="text-2xl font-semibold text-[#001a3d] sm:text-3xl">{content.closing.title}</h2>
              <p className="mt-3 text-base text-[#555555]">{content.closing.lead}</p>
              <p className="mt-4 text-sm leading-relaxed text-[#555555]">{content.closing.body}</p>
              <p className="mt-6 text-lg font-semibold text-[#001a3d]">{content.closing.tagline}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {content.closing.badges.map((badge, i) => (
                  <Reveal key={badge} delay={i * 0.05} variant="up">
                    <span className="inline-block rounded-full border border-[#d5d0c8] bg-[#f9f8f5] px-4 py-2 text-sm font-medium text-[#001a3d]">
                      {badge}
                    </span>
                  </Reveal>
                ))}
              </div>
              <p className="mt-8 text-xs leading-relaxed text-[#777777]">{content.incotermsDisclaimer}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        id="request-quote"
        className="relative overflow-hidden bg-[#071525] py-16 text-white lg:py-20"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,168,75,0.25), transparent 70%)",
          }}
        />
        <div className="container-page relative text-center">
          <Reveal>
            <h2 className="text-2xl font-semibold sm:text-3xl">{content.cta.title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/80">{content.cta.lead}</p>
            <p className="mx-auto mt-4 max-w-3xl text-sm text-white/70">
              Include: {content.cta.fields.join(" · ")}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/login"
                className="focus-ring inline-flex items-center gap-2 marketing-btn-primary px-6 py-3.5 text-sm font-semibold"
              >
                Buyer portal — submit request <span aria-hidden>→</span>
              </Link>
              <Link
                href="/contact"
                className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/70 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Contact trade desk
              </Link>
              <Link
                href="/resources"
                className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/40 px-6 py-3.5 text-sm font-semibold text-white/90 transition hover:bg-white/10"
              >
                Trade documents
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
