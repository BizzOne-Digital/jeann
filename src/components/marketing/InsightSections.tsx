"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/marketing/PageHero";
import { getInsightCover } from "@/lib/content/insight-images";

export type InsightCard = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
};

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function InsightsHero() {
  return (
    <PageHero
      title="Market insights"
      description="Plain-language explainers on Incoterms, RFQs, packaging, and shipping documents for qualified counterparties. Educational only — not legal advice."
      primaryCta={{ href: "#insights-list", label: "Browse articles →" }}
      secondaryCta={{ href: "/trade", label: "How we trade" }}
    />
  );
}

export function InsightsFeatured({ post }: { post: InsightCard }) {
  const cover = getInsightCover(post.slug, 0);

  return (
    <section className="bg-[#0a1628] py-14 text-white lg:py-20">
      <div className="container-page">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.22em] text-[#d4a84b] uppercase">
            Featured
          </p>
        </Reveal>

        <div className="mt-6 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <Reveal delay={0.06}>
            <Link href={`/insights/${post.slug}`} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden bg-[#122033]">
                <Image
                  src={cover}
                  alt=""
                  fill
                  priority
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 560px"
                />
              </div>
            </Link>
          </Reveal>

          <div>
            <Reveal delay={0.08}>
              <p className="text-xs font-semibold tracking-[0.16em] text-[#d4a84b] uppercase">
                {post.category} · {formatDate(post.publishedAt)}
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                <Link
                  href={`/insights/${post.slug}`}
                  className="transition hover:text-[#d4a84b]"
                >
                  {post.title}
                </Link>
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-4 text-base leading-relaxed text-white/65">{post.excerpt}</p>
            </Reveal>
            <Reveal delay={0.2}>
              <Link
                href={`/insights/${post.slug}`}
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#d4a84b] transition hover:gap-3"
              >
                Read article <span aria-hidden>→</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export function InsightsCatalog({ posts }: { posts: InsightCard[] }) {
  const categories = useMemo(() => {
    const set = new Set(posts.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, [posts]);

  const [active, setActive] = useState("All");

  const filtered = useMemo(
    () => (active === "All" ? posts : posts.filter((p) => p.category === active)),
    [active, posts],
  );

  return (
    <section id="insights-list" className="scroll-mt-24 bg-[#f3f1ec] py-16 lg:py-24">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Reveal>
              <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
                Library
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-2 text-3xl font-semibold text-[#001a3d] sm:text-4xl">
                All articles
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.08}>
            <p className="text-sm text-[#666666]">
              {filtered.length} article{filtered.length === 1 ? "" : "s"}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap gap-2 border-b border-[#d5d0c8] pb-6">
            {categories.map((cat) => {
              const on = cat === active;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActive(cat)}
                  className={`focus-ring px-3 py-1.5 text-sm font-medium transition ${
                    on
                      ? "border-b-2 border-[#c88e4a] text-[#001a3d]"
                      : "text-[#666666] hover:text-[#001a3d]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post, i) => (
            <Reveal key={post.slug} delay={Math.min(i * 0.05, 0.2)}>
              <Link href={`/insights/${post.slug}`} className="group flex h-full flex-col">
                <div className="relative aspect-[16/11] overflow-hidden bg-[#e4e0d8]">
                  <Image
                    src={getInsightCover(post.slug, i)}
                    alt=""
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 50vw, 360px"
                  />
                </div>
                <p className="mt-4 text-xs font-semibold tracking-[0.16em] text-[#c88e4a] uppercase">
                  {post.category} · {formatDate(post.publishedAt)}
                </p>
                <h3 className="mt-2 text-lg font-semibold leading-snug text-[#001a3d] transition group-hover:text-[#c88e4a]">
                  {post.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#666666] line-clamp-3">
                  {post.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#c88e4a]">
                  Read more <span aria-hidden>→</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-12 text-center text-[#666666]">No articles in this category yet.</p>
        ) : null}
      </div>
    </section>
  );
}

export function InsightsCta() {
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
            Ready to put insight into an enquiry?
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/70">
            Share product, quantity, destination, and preferred terms. Submission does not guarantee
            pricing or supply.
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
              href="/booking"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-white/70 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Book a consultation
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function InsightRelated({
  posts,
  currentSlug,
}: {
  posts: InsightCard[];
  currentSlug: string;
}) {
  const related = posts.filter((p) => p.slug !== currentSlug).slice(0, 3);
  if (related.length === 0) return null;

  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="container-page">
        <h2 className="text-2xl font-semibold text-[#001a3d]">More insights</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {related.map((post, i) => (
            <Link key={post.slug} href={`/insights/${post.slug}`} className="group block">
              <div className="relative aspect-[16/11] overflow-hidden bg-[#e4e0d8]">
                <Image
                  src={getInsightCover(post.slug, i)}
                  alt=""
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
              <p className="mt-3 text-xs font-semibold tracking-[0.16em] text-[#c88e4a] uppercase">
                {post.category}
              </p>
              <h3 className="mt-1 text-base font-semibold text-[#001a3d] group-hover:text-[#c88e4a]">
                {post.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
