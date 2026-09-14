"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { MotionImageFrame } from "@/components/motion/MotionImageFrame";
import {
  LOGISTICS_GALLERY_IMAGES,
  type LogisticsImage,
} from "@/lib/content/logistics-images";
import { HERO_PAGE_OVERLAY_HORIZONTAL } from "@/lib/marketing/hero-layout";

export function LogisticsPhotoGallery({ className = "" }: { className?: string }) {
  return (
    <div className={`grid grid-cols-1 gap-3 sm:grid-cols-3 ${className}`}>
      {LOGISTICS_GALLERY_IMAGES.map((img, index) => (
        <Reveal key={img.src} delay={index * 0.07} variant={index % 2 === 0 ? "zoom" : "blur-up"} bounce>
          <MotionImageFrame delay={index * 0.05}>
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-[#d5d0c8] shadow-md">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>
          </MotionImageFrame>
        </Reveal>
      ))}
    </div>
  );
}

export function LogisticsFullBleedBand({
  image,
  heightClass = "h-44 sm:h-52 lg:h-60",
}: {
  image?: LogisticsImage;
  heightClass?: string;
}) {
  if (!image) {
    return (
      <Reveal
        variant="blur-up"
        y={0}
        className={`relative ${heightClass} w-full overflow-hidden bg-gradient-to-r from-[#071525] via-[#1b3a5c] to-[#071525]`}
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,154,45,0.15),transparent_65%)]" />
      </Reveal>
    );
  }

  return (
    <Reveal variant="blur-up" y={0} className={`relative ${heightClass} w-full overflow-hidden`}>
      <Image src={image.src} alt={image.alt} fill className="object-cover object-center" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#071525]/25 via-transparent to-[#071525]/25" />
    </Reveal>
  );
}

export function LogisticsSplitPanel({
  image,
  reversed = false,
  children,
  aspectClassName = "aspect-[4/3] lg:aspect-[5/4]",
}: {
  image: LogisticsImage;
  reversed?: boolean;
  children: ReactNode;
  aspectClassName?: string;
}) {
  return (
    <div
      className={`grid gap-8 lg:grid-cols-2 lg:items-center ${
        reversed ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      <MotionImageFrame
        className={`relative ${aspectClassName} overflow-hidden rounded-xl border border-[#d5d0c8] bg-[#e4e0d8] shadow-md`}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </MotionImageFrame>
      <Reveal variant={reversed ? "left" : "right"} delay={0.08} bounce>
        <div>{children}</div>
      </Reveal>
    </div>
  );
}

export function LogisticsPhotoBackdropSection({
  children,
  image,
}: {
  children: ReactNode;
  image: LogisticsImage;
}) {
  return (
    <section className="relative overflow-hidden py-12 text-white lg:py-16">
      <div className="absolute inset-0">
        <Image
          src={image.src}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          aria-hidden
        />
      </div>
      <div className="absolute inset-0" style={{ background: HERO_PAGE_OVERLAY_HORIZONTAL }} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#071525]/92 via-[#071525]/72 to-[#071525]/55" />
      <div className="absolute inset-0 bg-[#071525]/25" />
      <div className="container-page relative">
        <Reveal variant="blur-up" delay={0.1}>{children}</Reveal>
      </div>
    </section>
  );
}
