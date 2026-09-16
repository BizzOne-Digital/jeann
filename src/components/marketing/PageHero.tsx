"use client";

import Image from "next/image";
import { ImageTriptych } from "@/components/marketing/ImageTriptych";
import Link from "next/link";
import { MaskedHeadline, Reveal } from "@/components/motion/Reveal";
import {
  HERO_DARK_OVERLAY_BOTTOM,
  HERO_DARK_OVERLAY_WASH,
  HERO_PAGE_OVERLAY_HORIZONTAL,
  MARKETING_HERO_INNER_CLASS,
  MARKETING_HERO_SECTION_CLASS,
} from "@/lib/marketing/hero-layout";
import { HeroVideoBackground } from "@/components/marketing/HeroVideoBackground";
import { AGRICULTURE_IMAGES } from "@/lib/content/agriculture-images";
import { isStoredUploadUrl, resolveImageSrc } from "@/lib/media/resolve-image-src";

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
  /** Single full-bleed image (default) or one image split into three hero panels */
  backgroundLayout?: "default" | "triptych";
  imageSrc?: string;
  imageAlt?: string;
  imageClassName?: string;
  priority?: boolean;
  /** YouTube URL or video ID — optional background video over the hero image. */
  youtubeVideoId?: string;
};

export function PageHero({
  title,
  description,
  brand = "Finekarts Incorporated",
  primaryCta,
  secondaryCta,
  tone = "dark",
  imageSrc = AGRICULTURE_IMAGES.combineHarvest.src,
  imageAlt = "",
  imageClassName = "object-cover object-center",
  backgroundLayout = "default",
  priority = true,
  youtubeVideoId,
}: Props) {
  const resolvedImageSrc = resolveImageSrc(imageSrc);
  const uploadImage = isStoredUploadUrl(resolvedImageSrc);
  const light = tone === "light";
  const triptych = backgroundLayout === "triptych" && !light;

  return (
    <section
      className={`${MARKETING_HERO_SECTION_CLASS} ${
        light ? "bg-[var(--cream)] text-[var(--ink)]" : "bg-[var(--navy)] text-white"
      }`}
    >
      {!light ? (
        <div className="absolute inset-0">
          {triptych ? (
            <ImageTriptych
              src={resolvedImageSrc}
              alt={imageAlt}
              priority={priority}
              variant="fill"
              rounded={false}
            />
          ) : youtubeVideoId ? (
            <HeroVideoBackground
              youtubeInput={youtubeVideoId}
              posterSrc={resolvedImageSrc}
              posterAlt={imageAlt}
            />
          ) : (
            <Image
              src={resolvedImageSrc}
              alt={imageAlt}
              fill
              priority={priority}
              sizes="100vw"
              unoptimized={uploadImage}
              className={imageClassName}
              aria-hidden={!imageAlt}
            />
          )}
          <div className={`absolute inset-0 ${HERO_DARK_OVERLAY_WASH}`} />
          <div
            className="absolute inset-0"
            style={{ background: HERO_PAGE_OVERLAY_HORIZONTAL }}
          />
          <div className={`absolute inset-0 ${HERO_DARK_OVERLAY_BOTTOM}`} />
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

          <MaskedHeadline
            text={title}
            as="h1"
            immediate
            className={`mt-4 break-words font-semibold leading-tight tracking-tight ${
              light ? "text-[var(--navy)]" : ""
            } text-[1.75rem] sm:text-4xl lg:text-[2.85rem]`}
          />

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
                    className="focus-ring inline-flex w-full items-center justify-center gap-2 marketing-btn-primary px-6 py-3.5 text-base font-semibold sm:w-auto"
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
