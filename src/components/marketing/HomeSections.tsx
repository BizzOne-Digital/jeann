"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { HomeCtaChat } from "@/components/marketing/HomeCtaChat";
import type { SeedCategory } from "@/lib/content/catalog";

const COMMODITY_CARDS = [
  {
    slug: "edible-oils",
    name: "Edible Oils",
    image: "/images/products/product-1.png",
    alt: "Edible oils commodity",
  },
  {
    slug: "sugar",
    name: "Sugar",
    image: "/images/products/product-2.png",
    alt: "Sugar commodity",
  },
  {
    slug: "rice-and-grains",
    name: "Rice & Grains",
    image: "/images/products/product-3.png",
    alt: "Rice and grains commodity",
  },
  {
    slug: "beans-and-pulses",
    name: "Beans & Pulses",
    image: "/images/products/product-4.png",
    alt: "Beans and pulses commodity",
  },
  {
    slug: "other-commodities",
    name: "Coffee & Spices",
    image: "/images/products/product-5.png",
    alt: "Coffee and spices commodity",
  },
];

const PACKAGING = [
  {
    name: "Jumbo Bags",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Flexitanks",
    image:
      "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "IBC Totes",
    image:
      "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Drums",
    image:
      "https://images.unsplash.com/photo-1635274605638-d44babc08a4f?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Bulk Vessels",
    image:
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=700&q=80",
  },
];

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
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-[#e89a2d] px-6 py-3.5 text-sm font-semibold text-[#071525] transition hover:bg-[#f0a93c] ${className}`}
    >
      {children}
    </Link>
  );
}

export function HomeHero() {
  const reduce = useReducedMotion();

  const trust = [
    {
      label: "FOB & CIF",
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
      label: "Secure Trade Workflow",
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
      label: "Worldwide Delivery",
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
    <section className="relative min-h-[100svh] w-full max-w-full overflow-hidden bg-[#071525] text-white">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-commodities.png"
          alt="Agricultural commodities with port logistics and refining infrastructure"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_center] sm:object-[78%_center]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(4,14,28,0.92) 0%, rgba(4,14,28,0.86) 24%, rgba(4,14,28,0.52) 48%, rgba(4,14,28,0.26) 70%, rgba(4,14,28,0.14) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071525]/65 via-transparent to-[#071525]/20" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a2844]/40 via-transparent to-[#d4a84b]/10" />
      </div>

      <div className="container-page relative flex min-h-[100svh] flex-col justify-center pb-28 pt-28 lg:pb-32 lg:pt-32">
        <div className="min-w-0 max-w-xl lg:max-w-2xl">
          <Reveal>
            <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-[#d4a84b] uppercase sm:text-xs sm:tracking-[0.26em]">
              Global sourcing • Bulk commodities • Worldwide delivery
            </p>
          </Reveal>

          <motion.h1
            className="mt-5 break-words text-[2rem] font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.6rem]"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          >
            Global Agricultural Commodity Trading
          </motion.h1>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
              We source and supply high-quality agricultural commodities to qualified buyers across
              global markets.
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="mt-9 flex w-full max-w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/login"
                className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[#d4a84b] px-6 py-3.5 text-base font-semibold text-white transition hover:bg-[#c4983f] sm:w-auto"
              >
                Buyer portal <span aria-hidden>→</span>
              </Link>
              <Link
                href="/products"
                className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-sm border border-white/75 bg-transparent px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
              >
                Explore Products
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
}: {
  home1?: string;
  home2?: string;
}) {
  return (
    <section className="bg-[#f3f1ec] py-16 lg:py-24">
      <div className="container-page grid items-center gap-10 lg:grid-cols-[0.95fr_1.15fr] lg:gap-14">
        <div className="max-w-xl">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
              Who We Are
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#001a3d] sm:text-4xl lg:text-[2.65rem]">
              Your Connection to Global Commodity Markets
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-base leading-relaxed text-[#555555]">
              Finekarts Incorporated connects qualified buyers with established origin programmes worldwide. We
              specialize in the sourcing, quality coordination, and logistics of bulk agricultural
              commodities with integrity and professionalism.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-4 text-base leading-relaxed text-[#555555]">
              From origin to destination, our team ensures reliable execution, transparent
              communication, and consistent value at every step.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <Link
              href="/about"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#c88e4a] transition hover:gap-3"
            >
              Discover Finekarts <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Reveal>
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[#e4e0d8] sm:aspect-[4/5]">
              <Image
                src={home1}
                alt="Quality inspection of bulk agricultural grains"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 360px"
              />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[#e4e0d8] sm:aspect-[4/5]">
              <Image
                src={home2}
                alt="Container ship and port logistics at sunset"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 360px"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function CommoditiesWeTrade({ categories }: { categories: SeedCategory[] }) {
  void categories;
  return (
    <section className="bg-[#0a1628] py-12 text-white lg:py-16">
      <div className="container-page">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-medium tracking-tight sm:text-[1.75rem]">
            Commodities We Trade
          </h2>
          <Link
            href="/products"
            className="text-sm font-medium text-[#d4a84b] transition hover:text-[#e8bc5c]"
          >
            View All Products →
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {COMMODITY_CARDS.map((card, i) => (
            <Reveal key={card.slug} delay={i * 0.05}>
              <Link href={`/products/${card.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] border border-white/25 bg-[#122033]">
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 50vw, 220px"
                  />
                </div>
                <p className="mt-3 text-left text-sm font-medium tracking-wide text-white">
                  {card.name}
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

export function SourcedResponsibly({ home3 = "/images/home-3.png" }: { home3?: string }) {
  const items = [
    {
      title: "Trusted Sourcing",
      text: "We partner with reputable producers who share our commitment to quality and integrity.",
      icon: "sprout" as const,
    },
    {
      title: "Quality Coordination",
      text: "Rigorous quality checks and consistent standards across every shipment and origin.",
      icon: "shield" as const,
    },
    {
      title: "Global Logistics",
      text: "End-to-end logistics solutions that ensure on-time delivery worldwide.",
      icon: "globe" as const,
    },
  ];

  return (
    <section className="bg-[#f3f1ec] py-16 lg:py-24">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[0.95fr_1.15fr] lg:gap-16">
        <Reveal>
          <div className="relative mx-auto aspect-[5/4] w-full max-w-md overflow-hidden bg-white lg:max-w-none">
            <Image
              src={home3}
              alt="Global commodity sourcing and logistics network"
              fill
              className="object-contain object-center p-2 sm:p-4"
              sizes="(max-width: 1024px) 90vw, 480px"
              priority={false}
            />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <h2 className="text-3xl font-semibold leading-tight text-[#001a3d] sm:text-4xl">
              Sourced Responsibly.
              <br />
              Delivered Globally.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#555555]">
              Our global network of logistics partners enables us to deliver quality
              commodities reliably and responsibly.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-3 sm:gap-0">
            {items.map((item, i) => (
              <Reveal key={item.title} delay={0.1 + i * 0.06}>
                <div
                  className={`sm:px-5 ${i > 0 ? "sm:border-l sm:border-[#d5d0c8]" : "sm:pl-0"} ${i === 0 ? "sm:pr-5" : ""}`}
                >
                  <FeatureIcon type={item.icon} />
                  <h3 className="mt-4 text-sm font-semibold text-[#001a3d]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#666666]">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.28}>
            <Link
              href="/resources"
              className="focus-ring mt-10 inline-flex items-center gap-2 rounded-md bg-[#d4a84b] px-6 py-3.5 text-base font-semibold text-white transition hover:bg-[#c4983f]"
            >
              Resources & documents <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function ProcessTimeline() {
  const steps = [
    {
      n: "01",
      title: "Submit Request",
      text: "Share product, quantity, destination, and preferred Incoterms through the RFQ form.",
    },
    {
      n: "02",
      title: "Review & Quote",
      text: "Trade desk reviews fit against origin programmes and workable logistics structures.",
    },
    {
      n: "03",
      title: "Contract & Documentation",
      text: "Agreed PSA/SPA and banking wording proceed only after mutual confirmation.",
    },
    {
      n: "04",
      title: "Inspection & Delivery",
      text: "Inspection, packaging, and shipment milestones follow the signed contract.",
    },
  ];

  return (
    <section className="bg-[#eef2f5] py-16 lg:py-24">
      <div className="container-page">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-center text-3xl font-semibold text-[#0b1f33] sm:text-4xl">
            A Clear Path From Request to Delivery
          </h2>
        </Reveal>
        <div className="relative mt-14 grid gap-8 md:grid-cols-4">
          <div className="pointer-events-none absolute top-8 right-[12%] left-[12%] hidden h-px bg-[#c9d3dc] md:block" />
          {steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.06}>
              <div className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#e89a2d] bg-white text-sm font-bold text-[#e89a2d]">
                  {step.n}
                </div>
                <h3 className="mt-5 font-semibold text-[#0b1f33]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ShippingTerms() {
  return (
    <section className="relative bg-white overflow-hidden">
      <div className="grid lg:grid-cols-2">
        <div className="relative bg-[#0b1f33] px-6 py-14 text-white sm:px-10 lg:px-16 lg:py-20 z-10">
          <Reveal>
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Shipping Terms Built Around Your Trade
            </h2>
          </Reveal>
          <div className="mt-8 space-y-4">
            {[
              {
                term: "FOB",
                text: "Free On Board — seller typically delivers on board at the named port of shipment; buyer arranges main carriage and insurance from that point.",
              },
              {
                term: "CIF",
                text: "Cost, Insurance and Freight — seller typically arranges carriage and minimum insurance to the named destination port, subject to contract wording.",
              },
            ].map((item, i) => (
              <Reveal key={item.term} delay={i * 0.08}>
                <div className="border border-white/15 bg-white/5 p-5">
                  <p className="text-lg font-semibold text-[#e89a2d]">{item.term}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.16}>
            <GoldButton href="/shipping" className="mt-8">
              Choose Your Shipment →
            </GoldButton>
          </Reveal>
        </div>
        <div className="relative min-h-[320px] lg:min-h-full">
          <Image
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1400&q=80"
            alt="Container ship at sea"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}

export function PackagingSection() {
  return (
    <section className="relative bg-[#f4f6f8] py-16 lg:py-24 overflow-hidden">
      <div className="container-page relative z-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <h2 className="text-3xl font-semibold text-[#0b1f33] sm:text-4xl">
              Packaging for Every Commodity
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <Link href="/packaging" className="text-sm font-semibold text-[#e89a2d] hover:underline">
              View packaging options →
            </Link>
          </Reveal>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-stone">
          Not every package type is available for every product. Compatibility depends on product,
          corridor, and contract terms.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PACKAGING.map((item, i) => (
            <Reveal key={item.name} delay={i * 0.05}>
              <div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-[#dfe5ea]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 220px"
                  />
                </div>
                <p className="mt-3 text-center text-sm font-semibold text-[#0b1f33]">{item.name}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReadyCtaBanner() {
  const [chatFocus, setChatFocus] = useState(0);

  return (
    <section className="relative overflow-hidden py-16 text-white lg:py-24">
      <Image
        src="/images/hero-commodities.png"
        alt="Port logistics and agricultural commodities at sunset"
        fill
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[#071525]/80" />

      <div className="container-page relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <div>
          <Reveal>
            <h2 className="max-w-xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.75rem]">
              Ready to Source Your Next Commodity?
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-white/75">
              Tell us what you need, where it is going, and your preferred trade terms.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="focus-ring inline-flex items-center gap-2 rounded-md bg-[#d4a84b] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#c4983f]"
              >
                Buyer portal sign in <span aria-hidden>→</span>
              </Link>
              <button
                type="button"
                onClick={() => setChatFocus((n) => n + 1)}
                className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/70 bg-transparent px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <span aria-hidden className="text-[#d4a84b]">
                  ✧
                </span>
                Ask Finekarts AI
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

export function InsightsAndNotes({
  posts,
}: {
  posts: Array<{ slug: string; title: string; excerpt: string; category: string }>;
}) {
  const cardImages = [
    "/images/products/rapeseed-oil-reference.png",
    "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=900&q=80",
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#f3f1ec] py-16 lg:py-24">
      <div className="container-page relative z-10 w-full">
        <div className="grid w-full gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          {/* Insights Cards Column */}
          <div className="w-full">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-3xl font-semibold text-[#001a3d] lg:text-4xl">
                Market Insights
              </h2>
              <Link
                href="/insights"
                className="text-sm font-medium text-[#c88e4a] transition-colors hover:text-[#b57d3c]"
              >
                View All Insights →
              </Link>
            </div>

            <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {posts.slice(0, 3).map((post, i) => (
                <Reveal key={post.slug} delay={i * 0.06}>
                  <article className="group w-full">
                    <Link href={`/insights/${post.slug}`} className="block w-full">
                      <div className="relative aspect-[16/11] w-full overflow-hidden rounded-lg bg-[#e4e0d8]">
                        <Image
                          src={cardImages[i] ?? cardImages[0]}
                          alt={`Illustration for ${post.title}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                        />
                      </div>
                      <div className="w-full pt-4">
                        <h3 className="text-base font-semibold leading-snug text-[#001a3d] transition-colors group-hover:text-[#c88e4a]">
                          {post.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#666666]">
                          {post.excerpt}
                        </p>
                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#c88e4a]">
                          Read More <span aria-hidden="true">→</span>
                        </span>
                      </div>
                    </Link>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1}>
            <aside className="flex w-full flex-col justify-center rounded-lg bg-white/50 p-8 lg:p-10">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#c88e4a] uppercase">
                Client Perspective
              </p>
              <p
                className="mt-4 font-serif text-5xl leading-none text-[#001a3d]"
                aria-hidden
              >
                “
              </p>
              <blockquote className="mt-2 text-base leading-relaxed text-[#555555]">
                Finekarts has been a reliable partner in our global sourcing journey. Their
                transparency, quality focus, and logistics expertise give us confidence in every
                shipment.
              </blockquote>
              <div className="mt-6 h-px w-16 bg-[#c88e4a]" />
              <p className="mt-5 text-sm font-semibold text-[#001a3d]">Procurement Manager</p>
              <p className="text-sm text-[#001a3d]/80">Global Food Importer</p>
              <p className="mt-4 text-[11px] leading-snug text-[#8a8580]">
                Illustrative anonymous perspective for layout — published testimonials require CMS
                approval.
              </p>
            </aside>
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

export function InsightsTeaser({
  posts,
}: {
  posts: Array<{ slug: string; title: string; excerpt: string; category: string }>;
}) {
  return <InsightsAndNotes posts={posts} />;
}

export function BookingCta() {
  return <ReadyCtaBanner />;
}
