"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { getPageHeroImage } from "@/lib/marketing/page-hero-images";
import { AGRICULTURE_IMAGES } from "@/lib/content/agriculture-images";
import { PageHero } from "@/components/marketing/PageHero";
import { searchCatalogProducts, type CatalogProduct } from "@/lib/content/catalog-utils";
import type { SeedCategory } from "@/lib/content/seed-catalog";
import { resolveImageSrc } from "@/lib/media/resolve-image-src";
import { buyerOrderHref } from "@/lib/marketing/cta-links";
import { getCategoryCover, getProductListingImage } from "@/lib/content/product-images";
import { BulkOrderBox } from "@/components/marketing/BulkOrderBox";
import { getBulkMinOrderText } from "@/lib/marketing/bulk-order-minimums";

export function ProductsHero() {
  const hero = getPageHeroImage("products");
  return (
    <PageHero
      title="Commodities we trade"
      description="Bulk supply only — browse edible oils, sugar, rice & grains, beans, coffee, spices, and related programmes. Minimum order volumes apply by category. Specifications are confirmed with the trade desk."
      imageSrc={hero.src}
      imageAlt={hero.alt}
      primaryCta={{ href: buyerOrderHref(), label: "Click here to ORDER →" }}
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

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
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
                      sizes="(max-width: 1024px) 50vw, 320px"
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
  products,
  totalCount,
}: {
  categories: SeedCategory[];
  products: CatalogProduct[];
  totalCount: number;
}) {
  const [query, setQuery] = useState("");
  const [categorySlug, setCategorySlug] = useState("");

  const filtered = useMemo(
    () => searchCatalogProducts(products, query, categorySlug || undefined),
    [products, query, categorySlug],
  );

  const grouped = useMemo(() => {
    const byCategory = new Map<string, CatalogProduct[]>();
    for (const product of filtered) {
      const list = byCategory.get(product.categorySlug) ?? [];
      list.push(product);
      byCategory.set(product.categorySlug, list);
    }
    return categories
      .filter((category) => byCategory.has(category.slug))
      .map((category) => ({
        category,
        products: byCategory.get(category.slug) ?? [],
      }));
  }, [filtered, categories]);

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
                Catalog by category
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

        <Reveal delay={0.12}>
          <div className="mt-8 marketing-box rounded-lg p-5 sm:p-6">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#c88e4a] uppercase">
              Bulk supply only
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#555555]">
              Finekarts supplies commodities in bulk volumes only. Minimum order quantities vary by
              category — see each section below.
            </p>
            <ul className="mt-4 grid gap-2 text-sm text-[#001a3d] sm:grid-cols-2 lg:grid-cols-3">
              <li>Spices, nuts &amp; cashews — 300 MT min</li>
              <li>Beans — 300 MT min</li>
              <li>Rice — 500 MT min</li>
              <li>Edible oils — 500 MT min</li>
              <li>Sugar — 5,000 MT min</li>
            </ul>
            <Link
              href={buyerOrderHref()}
              className="focus-ring mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#c88e4a] transition hover:text-[#a87338]"
            >
              Click here to ORDER <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 space-y-14">
          {grouped.map(({ category, products: categoryProducts }, groupIndex) => {
            const cover = getCategoryCover(category.slug);
            return (
              <div key={category.slug} id={`catalog-${category.slug}`} className="scroll-mt-28">
                <Reveal delay={Math.min(groupIndex * 0.04, 0.16)}>
                  <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#d5d0c8] pb-4">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.18em] text-[#c88e4a] uppercase">
                        {cover.shortName}
                      </p>
                      <h3 className="mt-1 text-2xl font-semibold text-[#001a3d]">{category.name}</h3>
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#666666]">
                        {category.summary}
                      </p>
                    </div>
                    <Link
                      href={`/products/${category.slug}`}
                      className="text-sm font-semibold text-[#c88e4a] transition hover:text-[#a87338]"
                    >
                      View category <span aria-hidden>→</span>
                    </Link>
                  </div>
                </Reveal>

                <Reveal delay={Math.min(groupIndex * 0.04 + 0.04, 0.2)}>
                  <BulkOrderBox categorySlug={category.slug} className="mt-6" compact />
                </Reveal>

                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryProducts.map((product, i) => {
                    const imageSrc = getProductListingImage(product, product.categorySlug);
                    return (
                      <Reveal
                        key={`${product.categorySlug}-${product.slug}`}
                        delay={Math.min(i * 0.03, 0.18)}
                      >
                        <article className="marketing-box flex h-full flex-col rounded-lg p-4 shadow-sm">
                          <Link
                            href={`/products/${product.categorySlug}/${product.slug}`}
                            className="group block"
                          >
                            <div className="relative aspect-[16/11] overflow-hidden bg-[#e4e0d8]">
                              <Image
                                src={resolveImageSrc(imageSrc)}
                                alt={product.name}
                                fill
                                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                                sizes="(max-width: 1024px) 50vw, 360px"
                                unoptimized={imageSrc.startsWith("/api/uploads/")}
                              />
                            </div>
                            <h4 className="mt-3 text-lg font-semibold text-[#001a3d] transition group-hover:text-[#c88e4a]">
                              {product.name}
                            </h4>
                            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#666666]">
                              {product.overview}
                            </p>
                            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#c88e4a]">
                              View details <span aria-hidden>→</span>
                            </span>
                          </Link>
                          <p className="mt-3 border-t border-[#ebe6de] pt-3 text-xs leading-relaxed text-[#777777]">
                            {getBulkMinOrderText(product.categorySlug, product.slug)}
                          </p>
                          <Link
                            href={buyerOrderHref(product.slug)}
                            className="focus-ring mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#001a3d] transition hover:text-[#c88e4a]"
                          >
                            Click here to ORDER <span aria-hidden>→</span>
                          </Link>
                        </article>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
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
        src={AGRICULTURE_IMAGES.combineHarvest.src}
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
            Ready to place a bulk order?
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/70">
            Sign in to the buyer portal and submit your purchase request with quantity, destination,
            and specifications.
          </p>
        </Reveal>
        <Reveal delay={0.14}>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={buyerOrderHref()}
              className="focus-ring inline-flex items-center justify-center gap-2 marketing-btn-primary px-6 py-3.5 text-sm font-semibold"
            >
              Click here to ORDER <span aria-hidden>→</span>
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
