"use client";

import Image from "next/image";
import Link from "next/link";
import { FeaturedTestimonialAside } from "@/components/marketing/TestimonialSections";
import type { PublicTestimonial } from "@/lib/content/testimonials-catalog";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cmsField, cmsLines } from "@/lib/content/cms-field";
import {
  HOME_COMMODITY_SLUGS,
  HOME_DEFAULTS,
  HOME_HERO_TRUST_LABELS,
  HOME_PACKAGING_BODY,
  HOME_PROCESS_STEPS,
  HOME_SHIPPING_TERMS,
  HOME_SOURCED_ITEMS,
  parseTitleText,
} from "@/lib/marketing/home-cms";
import { resolveImageSrc } from "@/lib/media/resolve-image-src";
import { Reveal } from "@/components/motion/Reveal";
import { HomeCtaChat } from "@/components/marketing/HomeCtaChat";
import { HeroVideoBackground } from "@/components/marketing/HeroVideoBackground";
import { resolveHeroYoutubeInput } from "@/lib/content/hero-video";
import type { SeedCategory } from "@/lib/content/catalog";
import { getCategoryCover } from "@/lib/content/product-images";
import { HOMEPAGE_PACKAGING_TEASER } from "@/lib/content/packaging-images";
import { HOME_PAGE_ONLY_IMAGES } from "@/lib/content/home-page-images";
import { resolveMarketingHeroImage } from "@/lib/marketing/cms-hero";
import { isStoredUploadUrl } from "@/lib/media/resolve-image-src";
import { HOME_INSIGHTS_TEASER } from "@/lib/content/operational-insights-content";
import { HOME_INSIGHTS_CARD_IMAGES } from "@/lib/content/home-images";
import {
  HERO_DARK_OVERLAY_BOTTOM,
  HERO_DARK_OVERLAY_WASH,
  HERO_HOME_OVERLAY_HORIZONTAL,
  MARKETING_HERO_INNER_CLASS,
  MARKETING_HERO_SECTION_CLASS,
} from "@/lib/marketing/hero-layout";

const COMMODITY_CARDS = HOME_COMMODITY_SLUGS.map((slug) => {
  const cover = getCategoryCover(slug);
  return { slug, name: cover.shortName, image: cover.image, alt: cover.alt };
});

function GoldButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-md marketing-btn-primary px-6 py-3.5 text-sm font-semibold ${className}`}
    >
      {children}
    </Link>
  );
}

export function HomeHero({ cms }: { cms?: Record<string, string> }) {
  const reduce = useReducedMotion();
  const hero = resolveMarketingHeroImage(cms, "home");

  const trustLabels = cmsLines(cms, "bullets", [...HOME_HERO_TRUST_LABELS]);
  const trust = [
    {
      label: trustLabels[0] ?? HOME_HERO_TRUST_LABELS[0],
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M3 17h18M5 17l2-8h10l2 8M8 9V6h8v3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      label: trustLabels[1] ?? HOME_HERO_TRUST_LABELS[1],
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3l8 3.5v5.5c0 4.8-3.2 8.2-8 9.5-4.8-1.3-8-4.7-8-9.5V6.5L12 3z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 12l1.8 1.8L15 10"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      label: trustLabels[2] ?? HOME_HERO_TRUST_LABELS[2],
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M4 12h16M12 4c2.8 2.4 2.8 13.6 0 16M12 4c-2.8 2.4-2.8 13.6 0 16"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className={`${MARKETING_HERO_SECTION_CLASS} bg-[var(--navy)] text-white`}>
      <div className="absolute inset-0">
        <Image
          src={hero.src}
          alt={hero.alt}
          fill
          priority
          sizes="100vw"
          unoptimized={isStoredUploadUrl(hero.src)}
          className="object-cover object-[center_center] sm:object-[55%_center]"
        />
        <div className={`absolute inset-0 ${HERO_DARK_OVERLAY_WASH}`} />
        <div
          className="absolute inset-0"
          style={{ background: HERO_HOME_OVERLAY_HORIZONTAL }}
        />
        <div className={`absolute inset-0 ${HERO_DARK_OVERLAY_BOTTOM}`} />
      </div>

      <div className={`${MARKETING_HERO_INNER_CLASS} pt-[8.75rem] lg:pt-[9.25rem]`}>
        <div className="min-w-0 max-w-xl lg:max-w-2xl">
          <Reveal>
            <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-[#d4a84b] uppercase sm:text-xs sm:tracking-[0.26em]">
              {cmsField(
                cms,
                "eyebrow",
                "Bulk commodities for sale • Verified programmes • Worldwide delivery",
              )}
            </p>
          </Reveal>

          <motion.h1
            className="mt-5 break-words text-[2rem] font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.6rem]"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          >
            {cmsField(cms, "title", "Bulk Agricultural Commodities for Qualified Buyers")}
          </motion.h1>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
              {cmsField(
                cms,
                "description",
                "Finekarts supplies edible oils, sugar, rice, beans, and related bulk cargoes for sale to qualified international buyers — with independent inspection, coordinated CIF carriage, and marine insurance where the PSA requires them, plus bankable structures such as documentary LC and standby support for longer programmes.",
              )}
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="mt-9 flex w-full max-w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={cmsField(cms, "primaryCtaHref", "/login")}
                className="focus-ring inline-flex w-full items-center justify-center gap-2 marketing-btn-primary px-6 py-3.5 text-sm font-semibold sm:w-auto"
              >
                {cmsField(cms, "primaryCtaLabel", "Buyer portal")} <span aria-hidden>→</span>
              </Link>
              <Link
                href={cmsField(cms, "secondaryCtaHref", "/products")}
                className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-sm border border-white/75 bg-transparent px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
              >
                {cmsField(cms, "secondaryCtaLabel", "Explore Products")}
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.22}>
            <ul className="mt-10 flex flex-col gap-3 text-[0.88rem] text-[#d4a84b] sm:mt-12 sm:flex-row sm:flex-wrap sm:items-center sm:gap-y-4 sm:text-[0.92rem]">
              {trust.map((item, i) => (
                <li key={item.label} className="flex items-center">
                  {i > 0 ? (
                    <span className="mx-5 hidden h-5 w-px bg-white/35 sm:block" aria-hidden />
                  ) : null}
                  <span className="flex items-center gap-2.5">
                    <span className="shrink-0 text-[#d4a84b]">{item.icon}</span>
                    <span className="font-medium tracking-wide">{item.label}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {!reduce ? (
          <motion.div
            className="absolute bottom-8 left-[max(1rem,calc((100%-1180px)/2+1rem))] hidden items-center gap-3 sm:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.span
              className="text-[#d4a84b]"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            >
              <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
                <path
                  d="M7 1v16M2 13l5 5 5-5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.span>
            <span className="text-[0.62rem] font-medium tracking-[0.3em] text-white/65 uppercase">
              Scroll to discover
            </span>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}

export function ConnectionSection({
  home1 = "/images/home-1.png",
  home2 = "/images/home-2.png",
  cms,
}: {
  home1?: string;
  home2?: string;
  cms?: Record<string, string>;
}) {
  const youtubeInput = resolveHeroYoutubeInput(cmsField(cms, "youtubeVideoId", ""));

  return (
    <>
      <section className="bg-[#f4f6f8] py-16 lg:py-24">
        <div className="container-page grid items-center gap-10 lg:grid-cols-[0.95fr_1.15fr] lg:gap-14">
          <div className="max-w-xl">
            <Reveal>
              <p className="text-sm font-semibold tracking-[0.22em] text-[#c88e4a] uppercase sm:text-base">
                {cmsField(cms, "eyebrow", "Who we are")}
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#001a3d] sm:text-4xl lg:text-[2.65rem]">
                {cmsField(cms, "title", "Selling bulk commodities with trust at the centre")}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-base leading-relaxed text-[#555555]">
                {cmsField(
                  cms,
                  "body",
                  "Finekarts Incorporated is a distributor: every product on this site is offered for sale to qualified bulk buyers. We are not a marketplace and we do not connect unrelated buyers with unrelated sellers.",
                )}
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-4 text-base leading-relaxed text-[#555555]">
                {cmsField(
                  cms,
                  "body2",
                  "Supplier relationships stay private. We explain how we use verification, inspection, carriers, and trade insurance on programmes we sell — coordinated through independent partners, not offered as standalone Finekarts services.",
                )}
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <Link
                href="/about"
                className="mt-7 inline-flex items-center gap-2 text-base font-semibold text-[#c88e4a] transition hover:gap-3"
              >
                {cmsField(cms, "ctaLabel", "Discover Finekarts")} <span aria-hidden>→</span>
              </Link>
            </Reveal>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Reveal>
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[#e4e0d8] sm:aspect-[4/5]">
                <Image
                  src={resolveImageSrc(home1)}
                  alt="Quality inspection of bulk agricultural grains"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 360px"
                  unoptimized={home1.startsWith("/api/uploads/")}
                />
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[#e4e0d8] sm:aspect-[4/5]">
                <Image
                  src={resolveImageSrc(home2)}
                  alt="Container ship and port logistics at sunset"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 360px"
                  unoptimized={home2.startsWith("/api/uploads/")}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {youtubeInput ? (
        <section
          className="relative min-h-[min(72svh,680px)] w-full overflow-hidden bg-[#071525]"
          aria-label="Company overview video"
        >
          <HeroVideoBackground
            youtubeInput={youtubeInput}
            posterSrc={resolveImageSrc(home2)}
            posterAlt="Container ship and port logistics at sunset"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(4,14,28,0.97) 0%, rgba(4,14,28,0.92) 24%, rgba(4,14,28,0.58) 48%, rgba(4,14,28,0.22) 70%, rgba(4,14,28,0.12) 100%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071525]/70 via-transparent to-[#071525]/25" />
        </section>
      ) : null}
    </>
  );
}

export function CommoditiesWeTrade({
  categories,
  cms,
}: {
  categories: SeedCategory[];
  cms?: Record<string, string>;
}) {
  void categories;
  const names = cmsLines(cms, "items", []);
  return (
    <section className="bg-[#0a1628] py-12 text-white lg:py-16">
      <div className="container-page">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-medium tracking-tight sm:text-[1.75rem]">
            {cmsField(cms, "title", HOME_DEFAULTS.commodities.title)}
          </h2>
          <Link
            href="/products"
            className="text-base font-medium text-[#d4a84b] transition hover:text-[#e8bc5c]"
          >
            {cmsField(cms, "ctaLabel", HOME_DEFAULTS.commodities.ctaLabel)}
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
          {COMMODITY_CARDS.map((card, i) => (
            <Reveal key={card.slug} delay={i * 0.05}>
              <Link href={`/products/${card.slug}`} className="group block min-w-0">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] border border-white/25 bg-[#122033]">
                  <Image
                    src={resolveImageSrc(cmsField(cms, `image${i + 1}`, card.image))}
                    alt={card.alt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    unoptimized={cmsField(cms, `image${i + 1}`, "").startsWith("/api/uploads/")}
                    sizes="(max-width: 1024px) 33vw, 16vw"
                  />
                </div>
                <p className="mt-3 text-left text-base font-medium tracking-wide text-white">
                  {names[i] ?? card.name}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureIcon({ type }: { type: "sprout" | "shield" | "globe" }) {
  if (type === "sprout") {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 21V11M12 11C12 7 9 4 5 4c0 4 3 7 7 7zm0 0c0-4 3-7 7-7 0 4-3 7-7 7z"
          stroke="#d4a84b"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (type === "shield") {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3l8 3.5v5.5c0 4.8-3.2 8.2-8 9.5-4.8-1.3-8-4.7-8-9.5V6.5L12 3z"
          stroke="#d4a84b"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M9 12l2 2 4-4"
          stroke="#d4a84b"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="#d4a84b" strokeWidth="1.6" />
      <path
        d="M4 12h16M12 4c2.8 2.4 2.8 13.6 0 16M12 4c-2.8 2.4-2.8 13.6 0 16"
        stroke="#d4a84b"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SourcedResponsibly({
  home3 = "/images/home/responsible-sourcing-aerial.jpg",
  cms,
}: {
  home3?: string;
  cms?: Record<string, string>;
}) {
  const icons = ["sprout", "shield", "globe"] as const;
  const items = parseTitleText(
    cmsLines(cms, "items", HOME_SOURCED_ITEMS.map((i) => `${i.title}: ${i.text}`)),
    HOME_SOURCED_ITEMS,
  ).map((item, i) => ({ ...item, icon: icons[i] ?? icons[0] }));
  const titleLines = cmsField(cms, "title", HOME_DEFAULTS.sourced.title).split(/\r?\n/);

  return (
    <section className="bg-[#f4f6f8] py-16 lg:py-24">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[0.95fr_1.15fr] lg:gap-16">
        <Reveal>
          <div className="relative mx-auto aspect-[5/4] w-full max-w-md overflow-hidden bg-white lg:max-w-none">
            <Image
              src={resolveImageSrc(home3)}
              alt="Global commodity sourcing and logistics network"
              fill
              className="object-contain object-center p-2 sm:p-4"
              sizes="(max-width: 1024px) 90vw, 480px"
              priority={false}
              unoptimized={home3.startsWith("/api/uploads/")}
            />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <h2 className="text-3xl font-semibold leading-tight text-[#001a3d] sm:text-4xl">
              {titleLines.map((line, i) => (
                <span key={i}>
                  {i > 0 ? <br /> : null}
                  {line}
                </span>
              ))}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#555555]">
              {cmsField(cms, "body", HOME_DEFAULTS.sourced.body)}
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-3 sm:gap-0">
            {items.map((item, i) => (
              <Reveal key={item.title} delay={0.1 + i * 0.06}>
                <div
                  className={`sm:px-5 ${i > 0 ? "sm:border-l sm:border-[#d5d0c8]" : "sm:pl-0"} ${i === 0 ? "sm:pr-5" : ""}`}
                >
                  <FeatureIcon type={item.icon} />
                  <h3 className="mt-4 text-base font-semibold text-[#001a3d]">{item.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-[#666666]">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.28}>
            <Link
              href="/resources"
              className="focus-ring mt-10 inline-flex items-center gap-2 marketing-btn-primary px-6 py-3.5 text-base font-semibold"
            >
              {cmsField(cms, "ctaLabel", HOME_DEFAULTS.sourced.ctaLabel)} <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function ProcessTimeline({ cms }: { cms?: Record<string, string> }) {
  const steps = parseTitleText(
    cmsLines(cms, "items", HOME_PROCESS_STEPS.map((s) => `${s.title}: ${s.text}`)),
    HOME_PROCESS_STEPS,
  );

  return (
    <section className="bg-[#eef2f5] py-16 lg:py-24">
      <div className="container-page">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-center text-3xl font-semibold text-[#0b1f33] sm:text-4xl">
            {cmsField(cms, "title", HOME_DEFAULTS.process.title)}
          </h2>
        </Reveal>
        <div className="relative mt-14 grid gap-8 md:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.06}>
              <div className="relative text-center">
                <h3 className="font-semibold text-[#0b1f33]">{step.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-stone">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ShippingTerms({ cms }: { cms?: Record<string, string> }) {
  const terms = parseTitleText(
    cmsLines(cms, "items", HOME_SHIPPING_TERMS.map((t) => `${t.title}: ${t.text}`)),
    HOME_SHIPPING_TERMS,
  );
  const shippingImage = cmsField(cms, "image", HOME_PAGE_ONLY_IMAGES.shippingTerms.src);
  return (
    <section className="relative bg-white overflow-hidden">
      <div className="grid lg:grid-cols-2">
        <div className="relative bg-[#0b1f33] px-6 py-14 text-white sm:px-10 lg:px-16 lg:py-20 z-10">
          <Reveal>
            <h2 className="text-3xl font-semibold sm:text-4xl">
              {cmsField(cms, "title", HOME_DEFAULTS.shipping.title)}
            </h2>
          </Reveal>
          <div className="mt-8 space-y-4">
            {terms.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="border border-white/15 bg-white/5 p-5">
                  <p className="text-lg font-semibold text-[#e89a2d]">{item.title}</p>
                  <p className="mt-2 text-base leading-relaxed text-white/70">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.16}>
            <div className="mt-8 flex flex-wrap gap-3">
              <GoldButton href="/logistics">
                {cmsField(cms, "primaryCtaLabel", HOME_DEFAULTS.shipping.primaryCtaLabel)}
              </GoldButton>
              <Link
                href="/dispute-resolution"
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-white/40 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {cmsField(cms, "secondaryCtaLabel", HOME_DEFAULTS.shipping.secondaryCtaLabel)}
              </Link>
            </div>
          </Reveal>
        </div>
        <div className="relative min-h-[320px] lg:min-h-full">
          <Image
            src={resolveImageSrc(shippingImage)}
            alt={cmsField(cms, "imageAlt", HOME_PAGE_ONLY_IMAGES.shippingTerms.alt)}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            unoptimized={shippingImage.startsWith("/api/uploads/")}
          />
        </div>
      </div>
    </section>
  );
}

export function PackagingSection({ cms }: { cms?: Record<string, string> }) {
  const names = cmsLines(cms, "items", []);
  return (
    <section className="relative bg-[#f4f6f8] py-16 lg:py-24 overflow-hidden">
      <div className="container-page relative z-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <h2 className="text-3xl font-semibold text-[#0b1f33] sm:text-4xl">
              {cmsField(cms, "title", HOME_DEFAULTS.packaging.title)}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <Link href="/packaging" className="text-base font-semibold text-[#e89a2d] hover:underline">
              {cmsField(cms, "ctaLabel", HOME_DEFAULTS.packaging.ctaLabel)}
            </Link>
          </Reveal>
        </div>
        <p className="mt-3 max-w-2xl text-base text-stone">
          {cmsField(cms, "body", HOME_PACKAGING_BODY)}{" "}
          <Link href="/packaging" className="font-semibold text-[#c88e4a] hover:underline">
            {cmsField(cms, "bodyLinkLabel", HOME_DEFAULTS.packaging.bodyLinkLabel)}
          </Link>
          .
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {HOMEPAGE_PACKAGING_TEASER.map((item, i) => (
            <Reveal key={item.slug} delay={i * 0.05}>
              <Link href={`/packaging#${item.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-[#dfe5ea]">
                  <Image
                    src={resolveImageSrc(cmsField(cms, `image${i + 1}`, item.image))}
                    alt={item.alt}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    unoptimized={cmsField(cms, `image${i + 1}`, "").startsWith("/api/uploads/")}
                    sizes="(max-width: 1024px) 50vw, 220px"
                  />
                  {item.slug === "bulk-railcar" ? (
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#001a3d]/75 via-[#001a3d]/35 to-[#c88e4a]/20"
                      aria-hidden
                    />
                  ) : null}
                </div>
                <p className="mt-3 text-center text-base font-semibold text-[#0b1f33] group-hover:text-[#c88e4a]">
                  {names[i] ?? item.name}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReadyCtaBanner({ cms }: { cms?: Record<string, string> }) {
  const [chatFocus, setChatFocus] = useState(0);
  const ctaImage = cmsField(cms, "image", HOME_PAGE_ONLY_IMAGES.readyCta.src);

  return (
    <section className="relative overflow-hidden py-16 text-white lg:py-24">
      <Image
        src={resolveImageSrc(ctaImage)}
        alt={cmsField(cms, "imageAlt", HOME_PAGE_ONLY_IMAGES.readyCta.alt)}
        fill
        className="object-cover object-center"
        sizes="100vw"
        unoptimized={ctaImage.startsWith("/api/uploads/")}
      />
      <div className="absolute inset-0 bg-[#071525]/80" />

      <div className="container-page relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <div>
          <Reveal>
            <h2 className="max-w-xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.75rem]">
              {cmsField(cms, "title", HOME_DEFAULTS.cta.title)}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-white/75">
              {cmsField(cms, "body", HOME_DEFAULTS.cta.body)}
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="focus-ring inline-flex items-center gap-2 marketing-btn-primary px-6 py-3.5 text-base font-semibold"
              >
                {cmsField(cms, "primaryCtaLabel", HOME_DEFAULTS.cta.primaryCtaLabel)} <span aria-hidden>→</span>
              </Link>
              <button
                type="button"
                onClick={() => setChatFocus((n) => n + 1)}
                suppressHydrationWarning
                className="focus-ring inline-flex items-center gap-2 rounded-md marketing-btn-primary px-6 py-3.5 text-base font-semibold"
              >
                {cmsField(cms, "secondaryCtaLabel", HOME_DEFAULTS.cta.secondaryCtaLabel)}
              </button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} y={24}>
          <div id="finekarts-ai-chat">
            <HomeCtaChat focusToken={chatFocus} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const HOME_INSIGHTS_TEASER_IMAGES = HOME_INSIGHTS_CARD_IMAGES;

export function InsightsAndNotes({
  featuredTestimonial,
  cms,
  testimonialCms,
}: {
  featuredTestimonial?: PublicTestimonial | null;
  cms?: Record<string, string>;
  testimonialCms?: Record<string, string>;
}) {
  // Card line format: "Title | excerpt" (links stay fixed per card).
  const cardTexts = parseTitleText(
    cmsLines(
      cms,
      "items",
      HOME_INSIGHTS_TEASER.cards.map((c) => `${c.title} | ${c.excerpt}`),
    ),
    HOME_INSIGHTS_TEASER.cards.map((c) => ({ title: c.title, text: c.excerpt })),
    "|",
  );
  return (
    <section className="relative w-full overflow-hidden bg-[#f4f6f8] py-16 lg:py-24">
      <div className="container-page relative z-10 w-full">
        <div className="grid w-full gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          {/* Insights Cards Column */}
          <div className="w-full">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-[#c88e4a] uppercase">
                  {cmsField(cms, "eyebrow", HOME_INSIGHTS_TEASER.eyebrow)}
                </p>
                <h2 className="mt-1 text-3xl font-semibold text-[#001a3d] lg:text-4xl">
                  {cmsField(cms, "title", HOME_INSIGHTS_TEASER.title)}
                </h2>
              </div>
              <Link
                href={HOME_INSIGHTS_TEASER.viewAllHref}
                className="text-base font-medium text-[#c88e4a] transition-colors hover:text-[#b57d3c]"
              >
                {cmsField(cms, "ctaLabel", HOME_INSIGHTS_TEASER.viewAllLabel)}
              </Link>
            </div>

            <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {HOME_INSIGHTS_TEASER.cards.map((card, i) => {
                const image = HOME_INSIGHTS_TEASER_IMAGES[i] ?? HOME_INSIGHTS_TEASER_IMAGES[0];
                const imageSrc = cmsField(cms, `image${i + 1}`, image.src);
                return (
                  <Reveal key={card.title} delay={i * 0.06}>
                    <article className="group w-full">
                      <Link href={card.href} className="block w-full">
                        <div className="relative aspect-[16/11] w-full overflow-hidden rounded-lg bg-[#e4e0d8]">
                          <Image
                            src={resolveImageSrc(imageSrc)}
                            alt={image.alt}
                            unoptimized={imageSrc.startsWith("/api/uploads/")}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                          />
                        </div>
                        <div className="w-full pt-4">
                          <h3 className="text-base font-semibold leading-snug text-[#001a3d] transition-colors group-hover:text-[#c88e4a]">
                            {cardTexts[i]?.title ?? card.title}
                          </h3>
                          <p className="mt-2 line-clamp-3 text-base leading-relaxed text-[#666666]">
                            {cardTexts[i]?.text ?? card.excerpt}
                          </p>
                          <span className="mt-3 inline-flex items-center gap-1 text-base font-medium text-[#c88e4a]">
                            {cmsField(cms, "cardLinkLabel", HOME_DEFAULTS.insights.cardLinkLabel)} <span aria-hidden="true">→</span>
                          </span>
                        </div>
                      </Link>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>

          <Reveal delay={0.1}>
            <FeaturedTestimonialAside testimonial={featuredTestimonial ?? null} cms={testimonialCms} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** @deprecated kept for import compatibility — prefer discrete section components */
export function CategoryShowcase({ categories }: { categories: SeedCategory[] }) {
  return <CommoditiesWeTrade categories={categories} />;
}

export function ProcessSection() {
  return <ProcessTimeline />;
}

export function LogisticsVisual() {
  return <SourcedResponsibly />;
}

export function IncotermExplainer() {
  return <ShippingTerms />;
}

export function PackagingTeaser() {
  return <PackagingSection />;
}

export function WorkflowOverview() {
  return null;
}

export function InsightsTeaser() {
  return <InsightsAndNotes />;
}

export function BookingCta() {
  return <ReadyCtaBanner />;
}
