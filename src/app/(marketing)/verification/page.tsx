import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";
import { getPageHeroImage } from "@/lib/marketing/page-hero-images";
import { VerificationHub } from "@/components/marketing/VerificationHub";
import { VerificationIntro } from "@/components/marketing/VerificationIntro";
import {
  VERIFICATION_CTA,
  VERIFICATION_HERO,
  VERIFICATION_NOT_GUARANTEE,
} from "@/lib/content/verification-content";

export const metadata: Metadata = {
  title: "Global Business Verification & Due Diligence",
  description:
    "Finekarts Verification Services helps bulk buyers obtain independent business intelligence — corporate registration, licenses, supply-chain due diligence, credit assessment, compliance screening, and documented evidence.",
};

export default function VerificationPage() {
  const heroImage = getPageHeroImage("verification");

  return (
    <>
      <PageHero
        title={VERIFICATION_HERO.title}
        brand={VERIFICATION_HERO.eyebrow}
        description={VERIFICATION_HERO.description}
        imageSrc={heroImage.src}
        imageAlt={heroImage.alt}
        primaryCta={VERIFICATION_HERO.primaryCta}
        secondaryCta={{ href: "#verification-hub", label: "Browse diligence topics" }}
      />

      <VerificationIntro />

      <VerificationHub />

      <section className="bg-[#f3f1ec] marketing-section">
        <div className="container-page">
          <h2 className="text-2xl font-semibold text-[#001a3d]">{VERIFICATION_NOT_GUARANTEE.title}</h2>
          <p className="mt-3 max-w-3xl text-base text-[#555555]">{VERIFICATION_NOT_GUARANTEE.lead}</p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {VERIFICATION_NOT_GUARANTEE.items.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-[#555555]">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a84b]" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-[#555555]">{VERIFICATION_NOT_GUARANTEE.note}</p>
          <p className="mt-8 max-w-3xl text-base leading-relaxed text-[#444444]">
            In global commodity markets, trust should be supported by evidence. Finekarts helps businesses move
            beyond documents and representations by combining corporate verification, regulatory information,
            commercial intelligence, credit assessment, supply-chain analysis and independent inspection where
            appropriate.
          </p>
        </div>
      </section>

      <section id="request-verification" className="relative overflow-hidden py-16 text-white lg:py-20">
        <Image src="/images/inspections/sugar-bags-hold.png" alt="" fill className="object-cover" sizes="100vw" aria-hidden />
        <div className="absolute inset-0 bg-[#071525]/88" />
        <div className="container-page relative">
          <p className="text-sm font-semibold tracking-[0.18em] text-[#d4a84b] uppercase">
            {VERIFICATION_CTA.tagline}
          </p>
          <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">{VERIFICATION_CTA.title}</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80">{VERIFICATION_CTA.lead}</p>
          <p className="mt-4 text-sm text-white/70">Include: {VERIFICATION_CTA.fields.join(" · ")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="focus-ring inline-flex items-center gap-2 marketing-btn-primary px-6 py-3.5 text-sm font-semibold"
            >
              Buyer portal — submit request <span aria-hidden>→</span>
            </Link>
            <Link
              href="/contact"
              className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/70 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Contact trade desk
            </Link>
            <Link
              href="/inspections"
              className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/40 px-6 py-3.5 text-sm font-semibold text-white/90 transition hover:bg-white/10"
            >
              Inspection services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
