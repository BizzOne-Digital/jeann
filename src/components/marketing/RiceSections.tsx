"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { buyerOrderHref } from "@/lib/marketing/cta-links";
import {
  RICE_BULK_SUPPLY,
  RICE_BUYER_NOTE,
  RICE_CATEGORY,
  RICE_CONTACT,
  RICE_MARKETS,
  RICE_PACKAGING,
  RICE_QUALITY_PILLARS,
  RICE_SPECIFICATIONS,
  RICE_SPOTLIGHT_SLUGS,
  getRiceProductDetail,
  type RiceProductDetail,
} from "@/lib/content/rice-product-content";

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

export function RiceProductDetailSections({ product }: { product: RiceProductDetail }) {
  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="container-page">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#c88e4a] uppercase">{product.grade}</p>
        <h2 className="mt-2 text-2xl font-semibold text-[#001a3d]">{product.subtitle}</h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#555555]">{product.description}</p>
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <DetailList title="Typical applications" items={product.applications} />
          <DetailList title="Product characteristics" items={product.characteristics} />
        </div>
        <div className="mt-10 marketing-box rounded-lg p-6">
          <h3 className="text-sm font-semibold text-[#001a3d]">Packaging options</h3>
          <p className="mt-3 text-sm text-[#555555]">{product.packaging.join(" • ")}</p>
          {product.note ? (
            <p className="mt-4 text-xs leading-relaxed text-[#777777]">{product.note}</p>
          ) : null}
        </div>
        {product.images && product.images.length > 0 ? (
          <div className="mt-10">
            <h3 className="text-sm font-semibold text-[#001a3d]">Product gallery</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {product.images.map((image) => (
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

export function RiceCategorySections() {
  const cat = RICE_CATEGORY;
  const spotlights = RICE_SPOTLIGHT_SLUGS.map((slug) => getRiceProductDetail(slug)).filter(Boolean);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#faf8f4] via-[#f3efe6] to-[#ebe4d6] marketing-section">
        <div
          className="pointer-events-none absolute -top-12 right-[10%] h-48 w-48 rounded-full bg-[#d4a84b]/15 blur-3xl"
          aria-hidden
        />
        <div className="container-page relative">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] text-[#8b7340] uppercase">{cat.eyebrow}</p>
            <h2 className="mt-2 max-w-3xl text-2xl font-semibold text-[#1a2e1a] sm:text-3xl">{cat.title}</h2>
            <div className="gold-rule mt-4" />
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#5a5348]">{cat.lead}</p>
          </Reveal>

          <Reveal delay={0.06} className="mt-10">
            <h3 className="text-lg font-semibold text-[#1a2e1a]">Our rice products include</h3>
          </Reveal>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {spotlights.map((product, index) => {
              if (!product?.heroImage) return null;
              return (
                <Reveal key={product.slug} delay={0.06 + index * 0.04}>
                  <Link
                    href={`/products/rice-and-grains/${product.slug}`}
                    className="group marketing-box marketing-box-interactive flex h-full flex-col overflow-hidden rounded-xl"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#e4e0d8]">
                      <Image
                        src={product.heroImage}
                        alt={product.grade}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 360px"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h4 className="text-base font-semibold text-[#1a2e1a] transition group-hover:text-[#c88e4a]">
                        {product.grade}
                      </h4>
                      <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-[#5a5348]">
                        {product.description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#8b7340] transition group-hover:gap-2">
                        View programme <span aria-hidden>→</span>
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.1} className="mt-8">
            <p className="text-xs leading-relaxed text-[#7a7268]">{cat.disclaimer}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white marketing-section">
        <div className="container-page">
          <Reveal>
            <h2 className="text-xl font-semibold text-[#001a3d] sm:text-2xl">{RICE_BULK_SUPPLY.title}</h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#555555]">{RICE_BULK_SUPPLY.lead}</p>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#666666]">{RICE_BULK_SUPPLY.incoterms}</p>
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <Reveal delay={0.05}>
              <article className="marketing-box h-full rounded-xl p-6">
                <h3 className="text-sm font-semibold tracking-[0.12em] text-[#c88e4a] uppercase">
                  {RICE_PACKAGING.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#555555]">{RICE_PACKAGING.lead}</p>
              </article>
            </Reveal>
            <Reveal delay={0.08}>
              <article className="marketing-box h-full rounded-xl p-6">
                <h3 className="text-sm font-semibold tracking-[0.12em] text-[#c88e4a] uppercase">
                  {RICE_SPECIFICATIONS.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#555555]">{RICE_SPECIFICATIONS.lead}</p>
              </article>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="mt-10">
            <h3 className="text-sm font-semibold text-[#001a3d]">Markets</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {RICE_MARKETS.map((market) => (
                <span
                  key={market}
                  className="rounded-full border border-[#d5d0c8] bg-[#f9f8f5] px-4 py-2 text-sm font-medium text-[#001a3d]"
                >
                  {market}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.12} className="mt-8">
            <p className="max-w-3xl text-base leading-relaxed text-[#555555]">{RICE_BUYER_NOTE}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#1a3352] marketing-section text-white">
        <div className="container-page">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] text-[#d4a84b] uppercase">Supply confidence</p>
            <h2 className="mt-2 text-xl font-semibold sm:text-2xl">Quality, safety and punctuality on every shipment</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {RICE_QUALITY_PILLARS.map((pillar, index) => (
              <Reveal key={pillar.title} delay={0.05 + index * 0.05}>
                <article
                  className="h-full rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition duration-300 hover:border-[#c88e4a]/40"
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

      <section className="bg-[#f3f1ec] marketing-section">
        <div className="container-page text-center">
          <Reveal>
            <h2 className="text-xl font-semibold text-[#001a3d] sm:text-2xl">{RICE_CONTACT.title}</h2>
            <p className="mt-3 text-sm tracking-wide text-[#888888]">{RICE_CONTACT.tagline}</p>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#555555]">{RICE_BUYER_NOTE}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href={buyerOrderHref()}
                className="focus-ring inline-flex items-center gap-2 rounded-md bg-[#d4a84b] px-6 py-3.5 text-sm font-semibold text-[#071525] transition hover:bg-[#c4983f]"
              >
                Click here to ORDER <span aria-hidden>→</span>
              </Link>
              <Link
                href="/contact"
                className="focus-ring inline-flex items-center gap-2 rounded-md border border-[#001a3d]/25 px-6 py-3.5 text-sm font-semibold text-[#001a3d] transition hover:border-[#c88e4a] hover:text-[#c88e4a]"
              >
                Contact trade desk
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
