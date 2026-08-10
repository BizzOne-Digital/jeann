"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/marketing/PageHero";
import { searchProducts, type SeedCategory } from "@/lib/content/catalog";
import { getCategoryCover } from "@/lib/content/product-images";

export function ProductsHero() {
  return (
    <PageHero
      title="Commodities we trade"
      description="Browse edible oils, sugar, rice & grains, beans & pulses, and related programmes. Specifications are confirmed with the trade desk — not fixed public prices."
      primaryCta={{ href: "/trade#purchase-request", label: "Request a Quote →" }}
      secondaryCta={{ href: "#catalog", label: "Browse catalog" }}
    />
  );
}

export function CategoryShowcase({ categories }: { categories: SeedCategory[] }) {
  return (
    <section className="bg-[#0a1628] py-12 text-white lg:py-16">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <h2 className="text-2xl font-medium tracking-tight sm:text-[1.75rem]">
              Categories
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="max-w-md text-sm text-white/55">
              Select a category to view product overviews available for qualified buyers.
            </p>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {categories.map((cat, i) => {
            const cover = getCategoryCover(cat.slug);
            return (
              <Reveal key={cat.slug} delay={i * 0.05}>
                <Link href={`/products/${cat.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] border border-white/25 bg-[#122033]">
                    <Image
                      src={cover.image}
                      alt={cover.alt}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 50vw, 220px"
                    />
                  </div>
                  <p className="mt-3 text-left text-sm font-medium tracking-wide text-white">
                    {cover.shortName}
                  </p>
                  <p className="mt-1 text-xs text-white/45">
                    {cat.products.length} product{cat.products.length === 1 ? "" : "s"}
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ProductCatalogSection({
  categories,
  totalCount,
}: {
  categories: SeedCategory[];
  totalCount: number;
}) {
  const [query, setQuery] = useState("");
  const [categorySlug, setCategorySlug] = useState("");

  const filtered = useMemo(
    () => searchProducts(query, categorySlug || undefined),
    [query, categorySlug],
  );

  return (
    <section id="catalog" className="scroll-mt-24 bg-[#f3f1ec] py-16 lg:py-24">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Reveal>
              <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
                Catalog
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-2 text-3xl font-semibold text-[#001a3d] sm:text-4xl">
                All commodity listings
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.08}>
            <p className="text-sm text-[#666666]">
              {filtered.length} of {totalCount} listings
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-8 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,220px)]">
            <label className="block min-w-0">
              <span className="sr-only">Search products</span>
              <input
                className="w-full min-w-0 border border-[#d5d0c8] bg-white px-4 py-3 text-sm text-[#001a3d] outline-none transition placeholder:text-[#999] focus:border-[#c88e4a]"
                placeholder="Search sunflower, ICUMSA, basmati…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <label className="block min-w-0">
              <span className="sr-only">Filter by category</span>
              <select
                className="w-full min-w-0 border border-[#d5d0c8] bg-white px-4 py-3 text-sm text-[#001a3d] outline-none transition focus:border-[#c88e4a]"
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {getCategoryCover(c.slug).shortName}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product, i) => {
            const cover = getCategoryCover(product.categorySlug);
            return (
              <Reveal key={`${product.categorySlug}-${product.slug}`} delay={Math.min(i * 0.03, 0.18)}>
                <Link
                  href={`/products/${product.categorySlug}/${product.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[16/11] overflow-hidden bg-[#e4e0d8]">
                    <Image
                      src={cover.image}
                      alt=""
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 50vw, 360px"
                    />
                  </div>
                  <p className="mt-3 text-xs font-semibold tracking-[0.16em] text-[#c88e4a] uppercase">
                    {cover.shortName}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-[#001a3d] transition group-hover:text-[#c88e4a]">
                    {product.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#666666]">
                    {product.overview}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#c88e4a]">
                    View details <span aria-hidden>→</span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-12 text-center text-[#666666]">No products match your filters.</p>
        ) : null}
      </div>
    </section>
  );
}

export function ProductsCta() {
  return (
    <section className="relative overflow-hidden py-16 text-white lg:py-20">
      <Image
        src="/images/hero-commodities.png"
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
        aria-hidden
      />
      <div className="absolute inset-0 bg-[#071525]/85" />
      <div className="container-page relative text-center">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
            Need a tailored quotation?
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/70">
            Share quantity, destination, and specifications. Submission does not guarantee pricing
            or supply.
          </p>
        </Reveal>
        <Reveal delay={0.14}>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/trade#purchase-request"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-[#d4a84b] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#c4983f]"
            >
              Request a Quote <span aria-hidden>→</span>
            </Link>
            <Link
              href="/contact"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-white/70 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Contact the desk
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
