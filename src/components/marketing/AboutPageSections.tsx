"use client";

import Link from "next/link";
import { MarketingAbstractBand } from "@/components/marketing/MarketingAbstractBand";
import { motion, useReducedMotion } from "framer-motion";
import {
  ABOUT_CONTACT,
  ABOUT_HIGHLIGHTS,
  ABOUT_INTRO,
  ABOUT_SUPPLY_CHAIN,
  ABOUT_WHAT_WE_DO,
  ABOUT_WHY_PARTNER,
} from "@/lib/content/about-content";
import { ABOUT_SECTION_IMAGE_META } from "@/lib/content/about-images";
import { LogisticsPairedRow } from "@/components/marketing/LogisticsVisuals";
import { Reveal } from "@/components/motion/Reveal";
import { buyerQuoteHref } from "@/lib/marketing/cta-links";
import { cn } from "@/lib/utils/cn";

function HighlightIcon({ type }: { type: string }) {
  const cls = "h-7 w-7 text-[#d4a84b]";
  switch (type) {
    case "globe":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M3 12h18M12 3a15 15 0 0 1 4 18M12 3a15 15 0 0 0-4 18"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "layers":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3 3 8l9 5 9-5-9-5Zm0 7L3 15l9 5 9-5-9-5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "document":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M8 4h8l4 4v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M16 4v4h4M10 13h6M10 17h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M7 11a4 4 0 1 0 8 0M5 19c0-2.5 3-4 7-4s7 1.5 7 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

function PrincipleIcon({ type }: { type: string }) {
  const cls = "h-8 w-8 text-[#d4a84b]";
  if (type === "logistics") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M3 7h11v8H3V7Zm11 2h4l3 3v3h-7V9ZM7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (type === "shield") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 6h8M7 7l4 10M17 7l-4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DivisionCard({
  division,
  index,
}: {
  division: (typeof ABOUT_WHAT_WE_DO.divisions)[number];
  index: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#d5d0c8] bg-white shadow-sm transition hover:border-[#c88e4a]/40 hover:shadow-lg"
    >
      <div className="border-b border-[#ebe6de] bg-gradient-to-br from-[#001a3d] to-[#0c2544] px-6 py-5 text-white">
        <span className="text-xs font-bold tracking-[0.2em] text-[#d4a84b]">{division.n}</span>
        <h3 className="mt-2 text-xl font-semibold">{division.title}</h3>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm leading-relaxed text-[#555555]">{division.intro}</p>
        <ul className="mt-4 flex-1 space-y-2.5 text-sm leading-relaxed text-[#444444]">
          {division.bullets.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c88e4a]" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <Link
          href={division.href}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#c88e4a] transition group-hover:gap-3"
        >
          View programmes <span aria-hidden>→</span>
        </Link>
      </div>
    </motion.article>
  );
}

export function AboutPageSections({
  email,
  phone,
  phoneDisplay,
}: {
  email: string;
  phone: string;
  phoneDisplay: string;
}) {
  const strategy = ABOUT_SECTION_IMAGE_META.teamStrategy;
  const collaboration = ABOUT_SECTION_IMAGE_META.teamCollaboration;

  return (
    <>
      <section className="marketing-section bg-white">
        <div className="container-page">
          <LogisticsPairedRow image={strategy} reversed>
            <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
              {ABOUT_INTRO.eyebrow}
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-[#001a3d] sm:text-3xl lg:text-4xl">
              {ABOUT_INTRO.title}
            </h2>
            {ABOUT_INTRO.paragraphs.map((p, i) => (
              <p key={i} className={cn("text-sm leading-relaxed text-[#555555] sm:text-base", i === 0 ? "mt-5" : "mt-4")}>
                {p}
              </p>
            ))}
            <Link
              href="/products"
              className="mt-7 inline-flex items-center gap-2 marketing-btn-primary px-5 py-2.5 text-sm font-semibold"
            >
              Learn more about products <span aria-hidden>→</span>
            </Link>
          </LogisticsPairedRow>
        </div>
      </section>

      <MarketingAbstractBand
        className="border-y border-white/10 py-12 lg:py-14"
        aria-label="Highlights"
      >
        <div className="container-page">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT_HIGHLIGHTS.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06} variant="up" bounce>
                <div className="text-center lg:text-left">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#d4a84b]/35 bg-white/5">
                    <HighlightIcon type={item.icon} />
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{item.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </MarketingAbstractBand>

      <section className="marketing-section bg-[#f3f1ec]">
        <div className="container-page">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
              {ABOUT_WHAT_WE_DO.eyebrow}
            </p>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold text-[#001a3d] sm:text-3xl">
              {ABOUT_WHAT_WE_DO.title}
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#555555] sm:text-base">
              {ABOUT_WHAT_WE_DO.lead}
            </p>
          </Reveal>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {ABOUT_WHAT_WE_DO.divisions.map((division, index) => (
              <DivisionCard key={division.title} division={division} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-section bg-white">
        <div className="container-page">
          <LogisticsPairedRow image={collaboration} boxed>
            <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
              {ABOUT_SUPPLY_CHAIN.eyebrow}
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-[#001a3d] sm:text-3xl">
              {ABOUT_SUPPLY_CHAIN.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#555555] sm:text-base">{ABOUT_SUPPLY_CHAIN.lead}</p>
            <ul className="mt-6 space-y-5">
              {ABOUT_SUPPLY_CHAIN.bullets.map((item, i) => (
                <Reveal key={item.title} delay={0.05 + i * 0.06} variant="right">
                  <li className="rounded-lg border border-[#e8e4dc] bg-[#faf9f6] p-4 sm:p-5">
                    <p className="font-semibold text-[#001a3d]">{item.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-[#555555]">{item.body}</p>
                  </li>
                </Reveal>
              ))}
            </ul>
            <Link
              href="/resources"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#c88e4a] transition hover:gap-3"
            >
              Explore trade resources <span aria-hidden>→</span>
            </Link>
          </LogisticsPairedRow>
        </div>
      </section>

      <section className="marketing-section border-t border-[#d5d0c8] bg-[#f3f1ec]">
        <div className="container-page">
          <Reveal>
            <p className="text-center text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
              {ABOUT_WHY_PARTNER.eyebrow}
            </p>
            <h2 className="mt-3 text-center text-2xl font-semibold text-[#001a3d] sm:text-3xl">
              {ABOUT_WHY_PARTNER.title}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {ABOUT_WHY_PARTNER.items.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.08} variant="zoom" bounce>
                <article className="h-full rounded-xl border border-[#d5d0c8] bg-white p-7 text-center shadow-sm transition hover:shadow-md">
                  <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#001a3d]">
                    <PrincipleIcon type={item.icon} />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-[#001a3d]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#555555]">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#071525] py-16 text-white lg:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(232,154,45,0.18), transparent 65%)",
          }}
        />
        <div className="container-page relative">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <p className="text-xs font-semibold tracking-[0.22em] text-[#d4a84b] uppercase">
                {ABOUT_CONTACT.eyebrow}
              </p>
              <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">{ABOUT_CONTACT.title}</h2>
              {ABOUT_CONTACT.lines.map((line) => (
                <p key={line} className="mt-2 text-sm text-white/70 sm:text-base">
                  {line}
                </p>
              ))}
            </Reveal>
            <Reveal delay={0.08}>
              <h3 className="mt-10 text-xl font-semibold sm:text-2xl">{ABOUT_CONTACT.ctaTitle}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">{ABOUT_CONTACT.ctaBody}</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link href={buyerQuoteHref()} className="marketing-btn-primary px-6 py-3 text-sm font-semibold">
                  Submit a purchase request <span aria-hidden>→</span>
                </Link>
                <Link
                  href="/contact"
                  className="rounded-md border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Request a consultation
                </Link>
              </div>
              <p className="mt-8 text-sm text-white/55">
                <a className="hover:text-[#e89a2d]" href={`mailto:${email}`}>{email}</a>
                <span className="mx-2 text-white/30" aria-hidden>|</span>
                <a className="hover:text-[#e89a2d]" href={`tel:${phone}`}>{phoneDisplay}</a>
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
