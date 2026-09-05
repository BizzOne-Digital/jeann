"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import {
  MARKETING_HERO_INNER_CLASS,
  MARKETING_HERO_SECTION_CLASS,
} from "@/lib/marketing/hero-layout";

export type PageHeroCta = {
  href: string;
  label: string;
};

type Props = {
  title: string;
  description: string;
  /** Brand line above the H1 — defaults to Finekarts Incorporated */
  brand?: string;
  primaryCta?: PageHeroCta;
  secondaryCta?: PageHeroCta;
  /** dark = navy overlay (default); light = cream/paper band for readability */
  tone?: "dark" | "light";
  imageSrc?: string;
  imageAlt?: string;
  imageClassName?: string;
  priority?: boolean;
};

export function PageHero({
  title,
  description,
  brand = "Finekarts Incorporated",
  primaryCta,
  secondaryCta,
  tone = "dark",
  imageSrc = "/images/hero-commodities.png",
  imageAlt = "",
  imageClassName = "object-cover object-center",
  priority = true,
}: Props) {
  const reduce = useReducedMotion();
  const light = tone === "light";

  return (
    <section
      className={`${MARKETING_HERO_SECTION_CLASS} ${
        light ? "bg-[var(--cream)] text-[var(--ink)]" : "bg-[var(--navy)] text-white"
      }`}
    >
      {!light ? (
        <div className="absolute inset-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority={priority}
            sizes="100vw"
            className={imageClassName}
            aria-hidden={!imageAlt}
          />
          <div
            className="absolute inset-0"
            style={{ background: "var(--hero-gradient-full)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--navy-rgb)/0.5)] via-transparent to-[rgb(var(--navy-rgb)/0.18)]" />
        </div>
      ) : (
        <div
          className="absolute inset-0 opacity-40"
          aria-hidden
          style={{
            background:
              "linear-gradient(135deg, rgba(58,107,140,0.12) 0%, rgba(247,244,239,1) 45%, rgba(255,255,255,1) 100%)",
          }}
        />
      )}

      <div className={MARKETING_HERO_INNER_CLASS}>
        <div className="min-w-0 max-w-xl lg:max-w-2xl">
          <Reveal>
            <p
              className={`display tracking-tight break-words ${
                light ? "text-[var(--ocean)]" : "text-white"
              } text-xl sm:text-3xl`}
            >
              {brand}
            </p>
          </Reveal>

          <motion.h1
            className={`mt-4 break-words font-semibold leading-tight tracking-tight ${
              light ? "text-[var(--navy)]" : ""
            } text-[1.75rem] sm:text-4xl lg:text-[2.85rem]`}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.06 }}
          >
            {title}
          </motion.h1>

          <Reveal delay={0.12}>
            <p
              className={`mt-4 max-w-xl leading-relaxed ${
                light ? "text-base text-[var(--stone)] sm:text-lg" : "text-white/70 text-base sm:text-lg"
              }`}
            >
              {description}
            </p>
          </Reveal>

          {primaryCta || secondaryCta ? (
            <Reveal delay={0.18}>
              <div className="mt-8 flex w-full max-w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
                {primaryCta ? (
                  <Link
                    href={primaryCta.href}
                    className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#d4a84b] px-6 py-3.5 text-base font-semibold text-white transition hover:bg-[#c4983f] sm:w-auto"
                  >
                    {primaryCta.label}
                  </Link>
                ) : null}
                {secondaryCta ? (
                  <Link
                    href={secondaryCta.href}
                    className={`focus-ring inline-flex w-full items-center justify-center gap-2 rounded-md border px-6 py-3.5 text-base font-semibold transition sm:w-auto ${
                      light
                        ? "border-[var(--navy)]/25 text-[var(--navy)] hover:bg-[var(--navy)]/5"
                        : "border-white/70 text-white hover:bg-white/10"
                    }`}
                  >
                    {secondaryCta.label}
                  </Link>
                ) : null}
              </div>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
