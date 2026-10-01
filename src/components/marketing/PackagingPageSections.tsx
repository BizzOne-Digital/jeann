"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  PACKAGING_CONTAINMENT_COMPARISON,
  PACKAGING_DRY_SOFT,
  PACKAGING_HARD,
  PACKAGING_LIQUID,
  PACKAGING_MARITIME,
  PACKAGING_PAGE_CTA,
  PACKAGING_PAGE_HERO,
  PACKAGING_SUMMARY_MATRIX,
  type PackagingSubsection,
} from "@/lib/content/packaging-page-content";
import { PACKAGING_PAGE_IMAGES } from "@/lib/content/packaging-page-images";
import { LogisticsPairedRow } from "@/components/marketing/LogisticsVisuals";
import { MotionImageFrame } from "@/components/motion/MotionImageFrame";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils/cn";

type MaritimeDrySub = (typeof PACKAGING_MARITIME.dryVessel.subsections)[number];
type MaritimeLiquidSub = (typeof PACKAGING_MARITIME.liquidVessel.subsections)[number];
type MaritimeGasSub = (typeof PACKAGING_MARITIME.gasVessel.subsections)[number];

function maritimeSubsectionToCard(id: string, sub: MaritimeDrySub | MaritimeLiquidSub | MaritimeGasSub): PackagingSubsection {
  const item: PackagingSubsection = {
    id,
    letter: sub.letter,
    title: sub.title,
    primaryGoods: "primaryGoods" in sub ? sub.primaryGoods : "use" in sub ? sub.use : "",
  };
  if ("capacity" in sub) item.capacity = sub.capacity;
  if ("mechanism" in sub) item.mechanism = sub.mechanism;
  if ("structure" in sub) item.structure = sub.structure;
  if ("use" in sub) item.use = sub.use;
  if ("keyConsiderations" in sub) item.keyConsiderations = sub.keyConsiderations;
  if ("keyFeatures" in sub) item.keyFeatures = [...sub.keyFeatures];
  return item;
}

function SectionHeading({
  n,
  title,
  example,
  lead,
  dark,
}: {
  n?: number;
  title: string;
  example?: string;
  lead?: string;
  dark?: boolean;
}) {
  return (
    <div>
      {n != null ? (
        <p
          className={cn(
            "text-xs font-bold tracking-[0.24em] uppercase",
            dark ? "text-[#d4a84b]" : "text-[#c88e4a]",
          )}
        >
          Section {n}
        </p>
      ) : null}
      <h2
        className={cn(
          "mt-2 text-2xl font-semibold sm:text-3xl lg:text-4xl",
          dark ? "text-white" : "text-[#001a3d]",
        )}
      >
        {title}
      </h2>
      {example ? (
        <p className={cn("mt-2 text-sm italic", dark ? "text-white/65" : "text-[#666]")}>{example}</p>
      ) : null}
      {lead ? (
        <p className={cn("mt-4 max-w-3xl text-sm leading-relaxed sm:text-base", dark ? "text-white/75" : "text-[#555555]")}>
          {lead}
        </p>
      ) : null}
    </div>
  );
}

function SubsectionCard({ item, index }: { item: PackagingSubsection; index: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-24px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="rounded-xl border border-[#d5d0c8] bg-white p-6 shadow-sm transition hover:border-[#c88e4a]/35 hover:shadow-md"
    >
      <span className="text-xs font-bold tracking-[0.2em] text-[#c88e4a]">{item.letter}</span>
      <h3 className="mt-2 text-lg font-semibold text-[#001a3d]">{item.title}</h3>
      {item.description ? (
        <p className="mt-3 text-sm leading-relaxed text-[#555555]">{item.description}</p>
      ) : null}
      {item.capacity ? (
        <p className="mt-2 text-sm text-[#444444]">
          <span className="font-semibold text-[#001a3d]">Capacity: </span>
          {item.capacity}
        </p>
      ) : null}
      {item.mechanism ? (
        <p className="mt-2 text-sm leading-relaxed text-[#555555]">
          <span className="font-semibold text-[#001a3d]">Mechanism: </span>
          {item.mechanism}
        </p>
      ) : null}
      {item.structure ? (
        <p className="mt-2 text-sm leading-relaxed text-[#555555]">
          <span className="font-semibold text-[#001a3d]">Structure: </span>
          {item.structure}
        </p>
      ) : null}
      {item.use ? (
        <p className="mt-2 text-sm leading-relaxed text-[#555555]">
          <span className="font-semibold text-[#001a3d]">Use: </span>
          {item.use}
        </p>
      ) : null}
      {item.keyFeatures?.length ? (
        <ul className="mt-3 space-y-2">
          {item.keyFeatures.map((f) => (
            <li key={f} className="flex gap-2 text-sm leading-relaxed text-[#444444]">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c88e4a]" aria-hidden />
              {f}
            </li>
          ))}
        </ul>
      ) : null}
      {item.keyConsiderations ? (
        <p className="mt-3 text-sm leading-relaxed text-[#555555]">
          <span className="font-semibold text-[#001a3d]">Key considerations: </span>
          {item.keyConsiderations}
        </p>
      ) : null}
      {item.bullets?.length ? (
        <ul className="mt-3 space-y-2">
          {item.bullets.map((b) => (
            <li key={b} className="flex gap-2 text-sm leading-relaxed text-[#444444]">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c88e4a]" aria-hidden />
              {b}
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-4 border-t border-[#ebe6de] pt-4 text-sm leading-relaxed text-[#555555]">
        <span className="font-semibold text-[#001a3d]">Primary goods: </span>
        {item.primaryGoods}
      </p>
    </motion.article>
  );
}

function ImageBand({ image }: { image: { src: string; alt: string } }) {
  return (
    <MotionImageFrame>
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-[#d5d0c8] shadow-md">
        <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 520px" />
      </div>
    </MotionImageFrame>
  );
}

export function PackagingPageSections() {
  return (
    <div id="packaging-overview" className="scroll-mt-20">
      <section className="marketing-section bg-white">
        <div className="container-page min-w-0">
          <LogisticsPairedRow image={PACKAGING_PAGE_IMAGES.intro}>
            <Reveal>
              <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">Overview</p>
              <p className="mt-4 text-sm leading-relaxed text-[#555555] sm:text-base">
                {PACKAGING_PAGE_HERO.description}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#555555] sm:text-base">
                {PACKAGING_PAGE_HERO.categoriesLead}
              </p>
            </Reveal>
          </LogisticsPairedRow>
        </div>
      </section>

      <section className="marketing-section bg-[#f3f1ec]">
        <div className="container-page space-y-12">
          <Reveal>
            <SectionHeading
              n={PACKAGING_DRY_SOFT.n}
              title={PACKAGING_DRY_SOFT.title}
              example={PACKAGING_DRY_SOFT.example}
              lead={PACKAGING_DRY_SOFT.lead}
            />
          </Reveal>
          <LogisticsPairedRow image={PACKAGING_PAGE_IMAGES.dryFibc} reversed>
            <SubsectionCard item={PACKAGING_DRY_SOFT.subsections[0]} index={0} />
          </LogisticsPairedRow>
          <div className="grid gap-8 lg:grid-cols-2">
            <LogisticsPairedRow image={PACKAGING_PAGE_IMAGES.dryPpBags}>
              <SubsectionCard item={PACKAGING_DRY_SOFT.subsections[1]} index={1} />
            </LogisticsPairedRow>
            <LogisticsPairedRow image={PACKAGING_PAGE_IMAGES.dryJute} reversed>
              <SubsectionCard item={PACKAGING_DRY_SOFT.subsections[2]} index={2} />
            </LogisticsPairedRow>
          </div>
          <LogisticsPairedRow image={PACKAGING_PAGE_IMAGES.dryLiner}>
            <SubsectionCard item={PACKAGING_DRY_SOFT.subsections[3]} index={3} />
          </LogisticsPairedRow>
        </div>
      </section>

      <section className="marketing-section bg-white">
        <div className="container-page space-y-12">
          <Reveal>
            <SectionHeading
              n={PACKAGING_LIQUID.n}
              title={PACKAGING_LIQUID.title}
              example={PACKAGING_LIQUID.example}
              lead={PACKAGING_LIQUID.lead}
            />
          </Reveal>
          <LogisticsPairedRow image={PACKAGING_PAGE_IMAGES.liquidFlexi} reversed>
            <SubsectionCard item={PACKAGING_LIQUID.subsections[0]} index={0} />
          </LogisticsPairedRow>
          <LogisticsPairedRow image={PACKAGING_PAGE_IMAGES.liquidIso}>
            <SubsectionCard item={PACKAGING_LIQUID.subsections[1]} index={1} />
          </LogisticsPairedRow>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
            <Reveal variant="up">
              <SubsectionCard item={PACKAGING_LIQUID.subsections[2]} index={2} />
            </Reveal>
            <Reveal variant="up" delay={0.08}>
              <ImageBand image={PACKAGING_PAGE_IMAGES.liquidDrums} />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="marketing-section bg-[#f3f1ec]">
        <div className="container-page space-y-10">
          <Reveal>
            <SectionHeading
              n={PACKAGING_HARD.n}
              title={PACKAGING_HARD.title}
              example={PACKAGING_HARD.example}
              lead={PACKAGING_HARD.lead}
            />
          </Reveal>
          <LogisticsPairedRow image={PACKAGING_PAGE_IMAGES.hardBundles} reversed>
            <SubsectionCard item={PACKAGING_HARD.subsections[0]} index={0} />
          </LogisticsPairedRow>
          <LogisticsPairedRow image={PACKAGING_PAGE_IMAGES.hardFibc}>
            <SubsectionCard item={PACKAGING_HARD.subsections[1]} index={1} />
          </LogisticsPairedRow>
          <LogisticsPairedRow image={PACKAGING_PAGE_IMAGES.hardBreakbulk} reversed>
            <SubsectionCard item={PACKAGING_HARD.subsections[2]} index={2} />
          </LogisticsPairedRow>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#001a3d] py-14 text-white lg:py-16">
        <div className="container-page space-y-14">
          <Reveal>
            <SectionHeading title={PACKAGING_MARITIME.title} lead={PACKAGING_MARITIME.lead} dark />
          </Reveal>

          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-[#d4a84b]">{PACKAGING_MARITIME.dryVessel.title}</h3>
            {PACKAGING_MARITIME.dryVessel.subsections.map((sub, i) => (
              <LogisticsPairedRow
                key={sub.title}
                image={i === 0 ? PACKAGING_PAGE_IMAGES.vesselDryHold : PACKAGING_PAGE_IMAGES.vesselContainerLiner}
                reversed={i % 2 === 1}
                boxed
              >
                <SubsectionCard item={maritimeSubsectionToCard(`dry-v-${i}`, sub)} index={i} />
              </LogisticsPairedRow>
            ))}
          </div>

          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-[#d4a84b]">{PACKAGING_MARITIME.liquidVessel.title}</h3>
            {PACKAGING_MARITIME.liquidVessel.subsections.map((sub, i) => (
              <LogisticsPairedRow
                key={sub.title}
                image={i === 0 ? PACKAGING_PAGE_IMAGES.vesselLiquidTanks : PACKAGING_PAGE_IMAGES.vesselFlexiAtSea}
                reversed={i % 2 === 1}
                boxed
              >
                <SubsectionCard item={maritimeSubsectionToCard(`liq-v-${i}`, sub)} index={i} />
              </LogisticsPairedRow>
            ))}
          </div>

          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-[#d4a84b]">{PACKAGING_MARITIME.gasVessel.title}</h3>
            <p className="text-sm text-white/70">{PACKAGING_MARITIME.gasVessel.lead}</p>
            <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
              <ImageBand image={PACKAGING_PAGE_IMAGES.vesselRail} />
              <div className="space-y-6">
                {PACKAGING_MARITIME.gasVessel.subsections.map((sub, i) => (
                  <SubsectionCard
                    key={sub.title}
                    index={i}
                    item={maritimeSubsectionToCard(`gas-${i}`, sub)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="marketing-section bg-white">
        <div className="container-page min-w-0">
          <Reveal>
            <h2 className="text-2xl font-semibold text-[#001a3d] sm:text-3xl">{PACKAGING_SUMMARY_MATRIX.title}</h2>
          </Reveal>
          <div className="table-scroll mt-8 rounded-xl border border-[#d5d0c8] bg-white shadow-sm">
            <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[#001a3d] text-[0.7rem] uppercase tracking-wide text-white sm:text-xs">
                  <th className="px-4 py-3.5 font-semibold">Commodity type</th>
                  <th className="px-4 py-3.5 font-semibold">Standard bulk packaging</th>
                  <th className="px-4 py-3.5 font-semibold">Typical unit weight / volume</th>
                  <th className="px-4 py-3.5 font-semibold">Primary protection requirement</th>
                </tr>
              </thead>
              <tbody>
                {PACKAGING_SUMMARY_MATRIX.rows.map((row) => (
                  <tr key={row.commodity} className="border-t border-[#e8e4dc] even:bg-[#faf9f6]">
                    <td className="px-4 py-4 align-top font-semibold text-[#001a3d]">{row.commodity}</td>
                    <td className="px-4 py-4 align-top text-[#555555]">{row.packaging}</td>
                    <td className="px-4 py-4 align-top text-[#555555]">{row.unit}</td>
                    <td className="px-4 py-4 align-top text-[#555555]">{row.protection}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="marketing-section bg-[#f3f1ec]">
        <div className="container-page min-w-0">
          <Reveal>
            <h2 className="text-2xl font-semibold text-[#001a3d] sm:text-3xl">
              {PACKAGING_CONTAINMENT_COMPARISON.title}
            </h2>
          </Reveal>
          <div className="table-scroll mt-8 rounded-xl border border-[#d5d0c8] bg-white shadow-sm">
            <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[#001a3d] text-[0.7rem] uppercase tracking-wide text-white sm:text-xs">
                  <th className="px-4 py-3.5 font-semibold">Containment type</th>
                  <th className="px-4 py-3.5 font-semibold">Primary vessel / transport</th>
                  <th className="px-4 py-3.5 font-semibold">Unit capacity range</th>
                  <th className="px-4 py-3.5 font-semibold">Primary commodity applications</th>
                </tr>
              </thead>
              <tbody>
                {PACKAGING_CONTAINMENT_COMPARISON.rows.map((row) => (
                  <tr key={row.type} className="border-t border-[#e8e4dc] even:bg-[#faf9f6]">
                    <td className="px-4 py-4 align-top font-semibold text-[#001a3d]">{row.type}</td>
                    <td className="px-4 py-4 align-top text-[#555555]">{row.vessel}</td>
                    <td className="px-4 py-4 align-top text-[#555555]">{row.capacity}</td>
                    <td className="px-4 py-4 align-top text-[#555555]">{row.applications}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="marketing-section bg-white">
        <div className="container-page">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-[#d5d0c8] bg-gradient-to-br from-[#001a3d] via-[#0c2544] to-[#001a3d] p-8 text-white sm:p-10 lg:p-12">
              <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
                <div>
                  <h2 className="text-2xl font-semibold sm:text-3xl">{PACKAGING_PAGE_CTA.title}</h2>
                  <p className="mt-4 text-sm leading-relaxed text-white/75 sm:text-base">{PACKAGING_PAGE_CTA.lead}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href={PACKAGING_PAGE_CTA.primaryHref} className="marketing-btn-primary px-6 py-3 text-sm font-semibold">
                      {PACKAGING_PAGE_CTA.primaryLabel} <span aria-hidden>→</span>
                    </Link>
                    <Link
                      href={PACKAGING_PAGE_CTA.secondaryHref}
                      className="rounded-md border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      {PACKAGING_PAGE_CTA.secondaryLabel}
                    </Link>
                  </div>
                </div>
                <div className="rounded-xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm sm:p-7">
                  <p className="text-xs font-semibold tracking-[0.18em] text-[#d4a84b] uppercase">
                    {PACKAGING_PAGE_CTA.shareTitle}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {PACKAGING_PAGE_CTA.shareItems.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/85">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#e89a2d]" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
