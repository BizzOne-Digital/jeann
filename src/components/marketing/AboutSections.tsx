"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { buyerQuoteHref } from "@/lib/marketing/cta-links";
import { cmsField } from "@/lib/content/cms-field";
import { PageHero } from "@/components/marketing/PageHero";
import { getPageHeroImage } from "@/lib/marketing/page-hero-images";

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
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-[#d4a84b] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#c4983f] ${className}`}
    >
      {children}
    </Link>
  );
}

export function AboutHero({
  positioning,
  cms,
}: {
  positioning: string;
  cms?: Record<string, string>;
}) {
  const aboutHero = getPageHeroImage("about");
  return (
    <PageHero
      title={cmsField(cms, "title", "Your connection to global commodity markets")}
      description={cmsField(cms, "description", positioning)}
      imageSrc={aboutHero.src}
      imageAlt={aboutHero.alt}
      backgroundLayout="triptych"
      imageClassName="object-cover object-[72%_center] sm:object-[78%_center]"
      primaryCta={{
        href: cmsField(cms, "primaryCtaHref", buyerQuoteHref()),
        label: cmsField(cms, "primaryCtaLabel", "Request a Quote →"),
      }}
      secondaryCta={{
        href: cmsField(cms, "secondaryCtaHref", "/contact"),
        label: cmsField(cms, "secondaryCtaLabel", "Contact the desk"),
      }}
    />
  );
}

export function AboutCta({
  email,
  phone,
  phoneDisplay,
  cms,
}: {
  email: string;
  phone: string;
  phoneDisplay: string;
  cms?: Record<string, string>;
}) {
  return (
    <section className="relative overflow-hidden bg-[#f3f1ec] py-16 lg:py-20">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-2xl border border-[#d5d0c8] shadow-xl">
          <Image
            src="/images/agriculture/rice-terraces.png"
            alt=""
            fill
            className="object-cover object-center"
            sizes="(max-width: 1280px) 100vw, 1200px"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071525]/95 via-[#071525]/88 to-[#071525]/75" />

          <div className="relative grid gap-10 p-8 text-white sm:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14 lg:p-14">
            <div>
              <Reveal>
                <p className="text-xs font-semibold tracking-[0.22em] text-[#d4a84b] uppercase">
                  Get started
                </p>
              </Reveal>
              <Reveal delay={0.06}>
                <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">
                  {cmsField(cms, "title", "Ready to discuss an enquiry?")}
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-white/70">
                  {cmsField(
                    cms,
                    "body",
                    "Share specifications and destination details. Submission does not guarantee acceptance or pricing.",
                  )}
                </p>
              </Reveal>
              <Reveal delay={0.14}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <GoldButton href={cmsField(cms, "primaryCtaHref", buyerQuoteHref())}>
                    {cmsField(cms, "primaryCtaLabel", "Request a Quote")} <span aria-hidden>→</span>
                  </GoldButton>
                  <Link
                    href="/booking"
                    className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-white/70 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Book a consultation
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.12}>
              <div className="rounded-xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm sm:p-7">
                <p className="text-xs font-semibold tracking-[0.16em] text-[#d4a84b] uppercase">
                  Direct contact
                </p>
                <p className="mt-4 text-sm text-white/65">
                  Trade desk enquiries and documentation questions
                </p>
                <div className="mt-5 space-y-3">
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-[#d4a84b]/50 hover:bg-white/10"
                  >
                    <span className="text-[#d4a84b]" aria-hidden>✉</span>
                    {email}
                  </a>
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-[#d4a84b]/50 hover:bg-white/10"
                  >
                    <span className="text-[#d4a84b]" aria-hidden>☎</span>
                    {phoneDisplay}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
