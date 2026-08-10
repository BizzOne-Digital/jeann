"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";

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
  /** full = about-style viewport hero; standard = compact band for inner pages */
  size?: "full" | "standard";
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
  size = "standard",
  imageSrc = "/images/hero-commodities.png",
  imageAlt = "",
  imageClassName = "object-cover object-center",
  priority = true,
}: Props) {
  const reduce = useReducedMotion();
  const full = size === "full";

  return (
    <section
      className={`relative w-full max-w-full overflow-hidden bg-[#071525] text-white ${
        full ? "min-h-[100svh]" : ""
      }`}
    >
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
        {full ? (
          <>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(4,14,28,0.97) 0%, rgba(4,14,28,0.92) 24%, rgba(4,14,28,0.58) 48%, rgba(4,14,28,0.22) 70%, rgba(4,14,28,0.12) 100%)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071525]/70 via-transparent to-[#071525]/25" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[#071525]/88" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(105deg, rgba(4,14,28,0.95) 0%, rgba(4,14,28,0.75) 55%, rgba(4,14,28,0.45) 100%)",
              }}
            />
          </>
        )}
      </div>

      <div
        className={`container-page relative ${
          full
            ? "flex min-h-[100svh] flex-col justify-center pb-24 pt-28 lg:pb-28 lg:pt-32"
            : "py-16 sm:py-20 lg:py-24"
        }`}
      >
        <div className={`min-w-0 ${full ? "max-w-xl lg:max-w-2xl" : "max-w-2xl"}`}>
          <Reveal>
            <p
              className={`display tracking-tight break-words text-white ${
                full
                  ? "text-2xl sm:text-4xl lg:text-[2.75rem]"
                  : "text-xl sm:text-3xl"
              }`}
            >
              {brand}
            </p>
          </Reveal>

          <motion.h1
            className={`mt-4 break-words font-semibold leading-tight tracking-tight ${
              full
                ? "text-[1.75rem] sm:text-4xl lg:text-[2.85rem]"
                : "text-[1.65rem] sm:text-4xl lg:text-[2.75rem]"
            }`}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.06 }}
          >
            {title}
          </motion.h1>

          <Reveal delay={0.12}>
            <p
              className={`mt-4 max-w-xl leading-relaxed text-white/70 ${
                full ? "text-base sm:text-lg" : "text-base"
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
                    className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#d4a84b] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#c4983f] sm:w-auto"
                  >
                    {primaryCta.label}
                  </Link>
                ) : null}
                {secondaryCta ? (
                  <Link
                    href={secondaryCta.href}
                    className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/70 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
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
