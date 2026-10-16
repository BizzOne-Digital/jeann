"use client";

import Link from "next/link";
import Image from "next/image";
import { MediaFieldPair } from "@/components/marketing/MediaFieldPair";
import { Reveal } from "@/components/motion/Reveal";
import {
  getSugarGradeDetail,
  SUGAR_CATEGORY,
  SUGAR_CATEGORY_COVER_IMAGE,
  SUGAR_SPOTLIGHT_SLUGS,
  type SugarGradeDetail,
} from "@/lib/content/sugar-product-content";
import { buyerQuoteHref } from "@/lib/marketing/cta-links";

const SUGAR_OVERVIEW_IMAGE = {
  src: "/images/products/sugar/icumsa-100-warehouse-aisle.jpg",
  alt: "ICUMSA sugar stored in an export warehouse aisle",
};

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-[#001a3d]">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-[#555555]">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a84b]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SugarGradeDetailSections({ grade }: { grade: SugarGradeDetail }) {
  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="container-page">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#c88e4a] uppercase">{grade.code}</p>
        <h2 className="mt-2 text-2xl font-semibold text-[#001a3d]">{grade.subtitle}</h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#555555]">{grade.description}</p>
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <DetailList title="Typical applications" items={grade.applications} />
          <DetailList title="Product characteristics" items={grade.characteristics} />
        </div>
        <div className="mt-10 marketing-box rounded-lg p-6">
          <h3 className="text-sm font-semibold text-[#001a3d]">Packaging options</h3>
          <p className="mt-3 text-sm text-[#555555]">{grade.packaging.join(" • ")}</p>
          {grade.note ? (
            <p className="mt-4 text-xs leading-relaxed text-[#777777]">{grade.note}</p>
          ) : null}
        </div>
        {grade.images && grade.images.length > 0 ? (
          <div className="mt-10">
            <h3 className="text-sm font-semibold text-[#001a3d]">Product gallery</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {grade.images.map((image) => (
                <div
                  key={image.src}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#d5d0c8] bg-[#e4e0d8]"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function SugarCategorySections() {
  const cat = SUGAR_CATEGORY;
  const spotlights = SUGAR_SPOTLIGHT_SLUGS.map((slug) => getSugarGradeDetail(slug)).filter(Boolean);
  const featuredVideo = getSugarGradeDetail("icumsa-45")?.youtubeVideoId;

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#faf8f4] via-[#f5f0e8] to-[#ebe4d8] marketing-section">
        <div
          className="pointer-events-none absolute -top-12 right-[8%] h-48 w-48 rounded-full bg-[#d4a84b]/15 blur-3xl"
          aria-hidden
        />
        <div className="container-page relative">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] text-[#c88e4a] uppercase">{cat.eyebrow}</p>
            <h2 className="mt-2 max-w-3xl text-2xl font-semibold text-[#001a3d] sm:text-3xl">{cat.title}</h2>
            <div className="gold-rule mt-4" />
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#555555]">{cat.lead}</p>
          </Reveal>

          <Reveal delay={0.06} className="mt-8">
            <p className="text-sm font-semibold text-[#001a3d]">Our sugar grades include</p>
          </Reveal>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {spotlights.map((grade, index) => {
              if (!grade?.heroImage) return null;
              const isFeatured = grade.slug === "icumsa-45";
              return (
                <Reveal key={grade.slug} delay={0.06 + index * 0.04}>
                  <Link
                    href={`/products/sugar/${grade.slug}`}
                    className="group marketing-box marketing-box-interactive flex h-full flex-col overflow-hidden rounded-xl"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#e4e0d8]">
                      <Image
                        src={grade.heroImage}
                        alt={grade.code}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 360px"
                        priority={isFeatured}
                      />
                      {isFeatured ? (
                        <span className="absolute top-3 left-3 rounded-full bg-[#c88e4a] px-2.5 py-1 text-[10px] font-bold tracking-wide text-white uppercase">
                          Featured
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-base font-semibold text-[#001a3d] transition group-hover:text-[#c88e4a]">
                        {grade.code}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#555555]">{grade.subtitle}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#c88e4a] transition group-hover:gap-2">
                        View grade <span aria-hidden>→</span>
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.1} className="mt-10">
            <MediaFieldPair
              imageSrc={SUGAR_OVERVIEW_IMAGE.src}
              imageAlt={SUGAR_OVERVIEW_IMAGE.alt}
              youtubeUrl={
                featuredVideo ? `https://www.youtube.com/watch?v=${featuredVideo}` : undefined
              }
              videoTitle="ICUMSA sugar overview"
            />
          </Reveal>

          <Reveal delay={0.12} className="mt-8">
            <p className="text-xs leading-relaxed text-[#777777]">{cat.disclaimer}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#f3f1ec] marketing-section">
        <div className="container-page">
          <h2 className="text-2xl font-semibold text-[#001a3d]">{cat.comparison.title}</h2>
          <div className="table-scroll mt-8">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#d5d0c8] text-xs font-semibold tracking-wide text-[#888] uppercase">
                  <th className="py-3 pr-4">Grade</th>
                  <th className="py-3 pr-4">General position</th>
                  <th className="py-3 pr-4">Typical market use</th>
                  <th className="py-3">Colour</th>
                </tr>
              </thead>
              <tbody>
                {cat.comparison.rows.map((row) => (
                  <tr key={row.grade} className="border-b border-[#e8e4dc]">
                    <td className="py-4 pr-4 font-semibold text-[#001a3d]">{row.grade}</td>
                    <td className="py-4 pr-4 text-[#555555]">{row.position}</td>
                    <td className="py-4 pr-4 text-[#555555]">{row.marketUse}</td>
                    <td className="py-4 text-[#555555]">{row.colour}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-[#777777]">{cat.comparison.note}</p>
        </div>
      </section>

      <section className="bg-white marketing-section">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <article>
            <h2 className="text-xl font-semibold text-[#001a3d]">{cat.globalSupply.title}</h2>
            <p className="mt-4 rounded-md bg-[#f9f8f5] px-4 py-3 text-xs font-medium leading-relaxed text-[#001a3d]">
              {cat.globalSupply.flow}
            </p>
            <h3 className="mt-6 text-sm font-semibold text-[#001a3d]">Supply options</h3>
            <ul className="mt-3 space-y-2">
              {cat.globalSupply.packaging.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-[#555555]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a84b]" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-[#555555]">{cat.globalSupply.tradeTerms}</p>
          </article>
          <article className="marketing-box rounded-lg p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#001a3d]">{cat.qualityVerification.title}</h2>
            <p className="mt-3 text-sm text-[#555555]">{cat.qualityVerification.lead}</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {cat.qualityVerification.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-[#555555]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a84b]" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-[#777777]">{cat.qualityVerification.note}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/verification" className="text-sm font-semibold text-[#c88e4a] underline">
                Due diligence
              </Link>
              <span className="text-[#ccc]">·</span>
              <Link href="/inspections" className="text-sm font-semibold text-[#c88e4a] underline">
                Inspections
              </Link>
              <span className="text-[#ccc]">·</span>
              <Link href="/logistics" className="text-sm font-semibold text-[#c88e4a] underline">
                Logistics
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="relative overflow-hidden marketing-section text-white">
        <Image src={SUGAR_CATEGORY_COVER_IMAGE} alt="" fill className="object-cover" sizes="100vw" aria-hidden />
        <div className="absolute inset-0 bg-[#071525]/88" />
        <div className="container-page relative">
          <p className="text-sm font-semibold tracking-[0.18em] text-[#d4a84b] uppercase">{cat.cta.tagline}</p>
          <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">{cat.cta.title}</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80">{cat.cta.lead}</p>
          <p className="mt-4 text-sm text-white/70">Tell us: {cat.cta.fields.join(" · ")}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {cat.cta.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white/90"
              >
                {badge}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={buyerQuoteHref()}
              className="focus-ring inline-flex items-center gap-2 marketing-btn-primary px-6 py-3.5 text-sm font-semibold"
            >
              Request a quote <span aria-hidden>→</span>
            </Link>
            <Link
              href="/contact"
              className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/70 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Contact trade desk
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
