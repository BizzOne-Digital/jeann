"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import {
  COFFEE_CATEGORY,
  COFFEE_QUALITY_PILLARS,
  COFFEE_SPOTLIGHT_SLUGS,
  getCoffeeProductDetail,
} from "@/lib/content/coffee-product-content";

const VARIETY_STYLES: Record<string, string> = {
  Arabica: "border-[#4a7c59]/30 bg-[#e8f2ea] text-[#2d4a36]",
  Robusta: "border-[#8b5e3c]/30 bg-[#f3e8dc] text-[#5c3d24]",
  Liberica: "border-[#7a5c3e]/30 bg-[#efe6d8] text-[#4a3424]",
  Excelsa: "border-[#9a7348]/30 bg-[#f5ebe0] text-[#6b4a2e]",
};

const SPOTLIGHT_ACCENTS = [
  "from-[#2d5a3d]/15 to-transparent border-[#4a7c59]/35",
  "from-[#8b5e3c]/20 to-transparent border-[#c88e4a]/50 ring-2 ring-[#c88e4a]/20",
  "from-[#3d2817]/15 to-transparent border-[#6b4423]/35",
] as const;

export function CoffeeCategorySections() {
  const cat = COFFEE_CATEGORY;
  const spotlights = COFFEE_SPOTLIGHT_SLUGS.map((slug) => getCoffeeProductDetail(slug)).filter(Boolean);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#faf6f0] via-[#f3ebe0] to-[#e8dfd2] marketing-section">
        <div
          className="coffee-orb pointer-events-none absolute -top-16 right-[8%] h-56 w-56 rounded-full bg-[#c88e4a]/20 blur-3xl"
          aria-hidden
        />
        <div
          className="coffee-orb-delayed pointer-events-none absolute bottom-0 left-[5%] h-48 w-48 rounded-full bg-[#4a7c59]/15 blur-3xl"
          aria-hidden
        />

        <div className="container-page relative">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] text-[#8b5e3c] uppercase">{cat.eyebrow}</p>
            <h2 className="mt-2 max-w-3xl text-2xl font-semibold text-[#2c1810] sm:text-3xl">{cat.title}</h2>
            <div className="gold-rule mt-4" />
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#5c4a3a]">{cat.lead}</p>
          </Reveal>

          <Reveal delay={0.06} className="mt-8">
            <p className="text-sm font-semibold text-[#3d2817]">Coffee types available</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {cat.varieties.map((variety, index) => (
                <span
                  key={variety}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition duration-300 hover:-translate-y-0.5 hover:shadow-sm ${VARIETY_STYLES[variety] ?? "border-[#d5d0c8] bg-white text-[#444]"}`}
                  style={{ transitionDelay: `${index * 40}ms` }}
                >
                  {variety}
                </span>
              ))}
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {spotlights.map((product, index) => {
              if (!product?.heroImage) return null;
              const isDryCoffee = product.slug === "dry-coffee-beans";
              return (
                <Reveal key={product.slug} delay={0.08 + index * 0.06}>
                  <Link
                    href={`/products/coffee/${product.slug}`}
                    className={`group marketing-box marketing-box-interactive flex h-full flex-col overflow-hidden rounded-xl bg-gradient-to-b ${SPOTLIGHT_ACCENTS[index] ?? SPOTLIGHT_ACCENTS[0]}`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#e4e0d8]">
                      <Image
                        src={product.heroImage}
                        alt={product.grade}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 360px"
                        priority={isDryCoffee}
                      />
                      {isDryCoffee ? (
                        <span className="absolute top-3 left-3 rounded-full bg-[#c88e4a] px-2.5 py-1 text-[10px] font-bold tracking-wide text-white uppercase">
                          Featured
                        </span>
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2c1810]/50 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-lg font-semibold text-[#2c1810] transition group-hover:text-[#c88e4a]">
                        {product.grade}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#5c4a3a]">
                        {product.subtitle}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#8b5e3c] transition group-hover:gap-2">
                        View programme <span aria-hidden>→</span>
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.12} className="mt-8">
            <p className="text-xs leading-relaxed text-[#7a6a5a]">{cat.disclaimer}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#2c1810] marketing-section text-white">
        <div className="container-page">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] text-[#d4a84b] uppercase">
              Supply confidence
            </p>
            <h2 className="mt-2 text-xl font-semibold sm:text-2xl">Quality, safety and punctuality on every shipment</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {COFFEE_QUALITY_PILLARS.map((pillar, index) => (
              <Reveal key={pillar.title} delay={0.05 + index * 0.06}>
                <article
                  className="h-full rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition duration-300 hover:border-[#c88e4a]/40 hover:bg-white/10"
                >
                  <h3 className="text-sm font-semibold tracking-[0.14em] text-[#d4a84b] uppercase">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/75">{pillar.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
