"use client";

import Image from "next/image";
import Link from "next/link";
import { MarketingAbstractBand } from "@/components/marketing/MarketingAbstractBand";
import { motion, useReducedMotion } from "framer-motion";
import type { PackagingSubsection } from "@/lib/content/packaging-page-content";
import type { PackagingCms } from "@/lib/marketing/packaging-cms";
import { isStoredUploadUrl } from "@/lib/media/resolve-image-src";
import { LogisticsPairedRow } from "@/components/marketing/LogisticsVisuals";
import { MotionImageFrame } from "@/components/motion/MotionImageFrame";
import { Reveal } from "@/components/motion/Reveal";
import { stripLeadingMarker } from "@/lib/marketing/strip-leading-marker";
import { cn } from "@/lib/utils/cn";

function SectionHeading({
  title,
  example,
  lead,
  dark,
}: {
  title: string;
  example?: string;
  lead?: string;
  dark?: boolean;
}) {
  return (
    <div>
      <h2
        className={cn(
          "text-2xl font-semibold sm:text-3xl lg:text-4xl",
          dark ? "text-white" : "text-[#001a3d]",
        )}
      >
        {stripLeadingMarker(title)}
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
      <h3 className="text-lg font-semibold text-[#001a3d]">{stripLeadingMarker(item.title)}</h3>
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

function ImageBand({
  image,
  fillHeight,
}: {
  image: { src: string; alt: string };
  /** Match adjacent stacked cards in a grid column (e.g. gas tanker subsections). */
  fillHeight?: boolean;
}) {
  return (
    <MotionImageFrame className={fillHeight ? "h-full min-h-0" : undefined}>
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-[#d5d0c8] shadow-md",
          fillHeight ? "h-full min-h-[220px]" : "aspect-[16/10]",
        )}
      >
        <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 520px" unoptimized={isStoredUploadUrl(image.src)} />
      </div>
    </MotionImageFrame>
  );
}

export function PackagingPageSections({ cms }: { cms: PackagingCms }) {
  const { dry, liquid, hard, maritime, summary, containment, cta } = cms;
  return (
    <div id="packaging-overview" className="scroll-mt-20">
      <section className="marketing-section bg-white">
        <div className="container-page min-w-0">
          <LogisticsPairedRow image={cms.overview.image}>
            <Reveal>
              <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">{cms.overview.eyebrow}</p>
              <p className="mt-4 text-sm leading-relaxed text-[#555555] sm:text-base">
                {cms.overview.description}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#555555] sm:text-base">
                {cms.overview.categoriesLead}
              </p>
            </Reveal>
          </LogisticsPairedRow>
        </div>
      </section>

      <section className="marketing-section bg-[#f3f1ec]">
        <div className="container-page space-y-12">
          <Reveal>
            <SectionHeading title={dry.title} example={dry.example} lead={dry.lead} />
          </Reveal>
          <LogisticsPairedRow image={dry.cards[0].image} reversed>
            <SubsectionCard item={dry.cards[0].item} index={0} />
          </LogisticsPairedRow>
          <div className="grid gap-8 lg:grid-cols-2">
            <LogisticsPairedRow image={dry.cards[1].image}>
              <SubsectionCard item={dry.cards[1].item} index={1} />
            </LogisticsPairedRow>
            <LogisticsPairedRow image={dry.cards[2].image} reversed>
              <SubsectionCard item={dry.cards[2].item} index={2} />
            </LogisticsPairedRow>
          </div>
          <LogisticsPairedRow image={dry.cards[3].image}>
            <SubsectionCard item={dry.cards[3].item} index={3} />
          </LogisticsPairedRow>
        </div>
      </section>

      <section className="marketing-section bg-white">
        <div className="container-page space-y-12">
          <Reveal>
            <SectionHeading title={liquid.title} example={liquid.example} lead={liquid.lead} />
          </Reveal>
          <LogisticsPairedRow image={liquid.cards[0].image} reversed>
            <SubsectionCard item={liquid.cards[0].item} index={0} />
          </LogisticsPairedRow>
          <LogisticsPairedRow image={liquid.cards[1].image}>
            <SubsectionCard item={liquid.cards[1].item} index={1} />
          </LogisticsPairedRow>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
            <Reveal variant="up">
              <SubsectionCard item={liquid.cards[2].item} index={2} />
            </Reveal>
            <Reveal variant="up" delay={0.08}>
              <ImageBand image={liquid.cards[2].image} />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="marketing-section bg-[#f3f1ec]">
        <div className="container-page space-y-10">
          <Reveal>
            <SectionHeading title={hard.title} example={hard.example} lead={hard.lead} />
          </Reveal>
          <LogisticsPairedRow image={hard.cards[0].image} reversed>
            <SubsectionCard item={hard.cards[0].item} index={0} />
          </LogisticsPairedRow>
          <LogisticsPairedRow image={hard.cards[1].image}>
            <SubsectionCard item={hard.cards[1].item} index={1} />
          </LogisticsPairedRow>
          <LogisticsPairedRow image={hard.cards[2].image} reversed>
            <SubsectionCard item={hard.cards[2].item} index={2} />
          </LogisticsPairedRow>
        </div>
      </section>

      <MarketingAbstractBand className="border-y border-white/10 py-14 lg:py-16">
        <div className="container-page space-y-14">
          <Reveal>
            <SectionHeading title={maritime.title} lead={maritime.lead} dark />
          </Reveal>

          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-[#d4a84b]">{maritime.dryTitle}</h3>
            {maritime.dryCards.map((card, i) => (
              <LogisticsPairedRow key={card.item.title} image={card.image} reversed={i % 2 === 1} boxed>
                <SubsectionCard item={card.item} index={i} />
              </LogisticsPairedRow>
            ))}
          </div>

          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-[#d4a84b]">{maritime.liquidTitle}</h3>
            {maritime.liquidCards.map((card, i) => (
              <LogisticsPairedRow key={card.item.title} image={card.image} reversed={i % 2 === 1} boxed>
                <SubsectionCard item={card.item} index={i} />
              </LogisticsPairedRow>
            ))}
          </div>

          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-[#d4a84b]">{maritime.gasTitle}</h3>
            <p className="text-sm text-white/70">{maritime.gasLead}</p>
            <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-stretch">
              <ImageBand image={maritime.gasImage} fillHeight />
              <div className="space-y-6">
                {maritime.gasCards.map((card, i) => (
                  <SubsectionCard key={card.item.title} index={i} item={card.item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </MarketingAbstractBand>

      <section className="marketing-section bg-white">
        <div className="container-page min-w-0">
          <Reveal>
            <h2 className="text-2xl font-semibold text-[#001a3d] sm:text-3xl">{summary.title}</h2>
          </Reveal>
          <div className="table-scroll mt-8 rounded-xl border border-[#d5d0c8] bg-white shadow-sm">
            <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[#001a3d] text-[0.7rem] uppercase tracking-wide text-white sm:text-xs">
                  {summary.headers.slice(0, 4).map((h) => (
                    <th key={h} className="px-4 py-3.5 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {summary.rows.map((row) => (
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

      <section className="marketing-section bg-[#f3f1ec]">
        <div className="container-page min-w-0">
          <Reveal>
            <h2 className="text-2xl font-semibold text-[#001a3d] sm:text-3xl">
              {containment.title}
            </h2>
          </Reveal>
          <div className="table-scroll mt-8 rounded-xl border border-[#d5d0c8] bg-white shadow-sm">
            <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[#001a3d] text-[0.7rem] uppercase tracking-wide text-white sm:text-xs">
                  {containment.headers.slice(0, 4).map((h) => (
                    <th key={h} className="px-4 py-3.5 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {containment.rows.map((row) => (
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

      <section className="marketing-section bg-white">
        <div className="container-page">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-[#d5d0c8] bg-gradient-to-br from-[#001a3d] via-[#0c2544] to-[#001a3d] p-8 text-white sm:p-10 lg:p-12">
              <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
                <div>
                  <h2 className="text-2xl font-semibold sm:text-3xl">{cta.title}</h2>
                  <p className="mt-4 text-sm leading-relaxed text-white/75 sm:text-base">{cta.lead}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href={cta.primaryHref} className="marketing-btn-primary px-6 py-3 text-sm font-semibold">
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
                <div className="rounded-xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm sm:p-7">
                  <p className="text-xs font-semibold tracking-[0.18em] text-[#d4a84b] uppercase">
                    {cta.shareTitle}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {cta.shareItems.map((item) => (
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
