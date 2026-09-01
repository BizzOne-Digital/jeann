"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { buyerQuoteHref } from "@/lib/marketing/cta-links";
import { cmsField } from "@/lib/content/cms-field";
import { PageHero } from "@/components/marketing/PageHero";

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
  return (
    <PageHero
      size="full"
      title={cmsField(cms, "title", "Your connection to global commodity markets")}
      description={cmsField(cms, "description", positioning)}
      imageAlt="Agricultural commodities and global logistics"
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

export function AboutWhoWeAre({
  home1 = "/images/home-1.png",
  home2 = "/images/home-2.png",
  cms,
}: {
  home1?: string;
  home2?: string;
  cms?: Record<string, string>;
}) {
  return (
    <section className="bg-[#f3f1ec] py-16 lg:py-24">
      <div className="container-page grid items-center gap-10 lg:grid-cols-[0.95fr_1.15fr] lg:gap-14">
        <div className="max-w-xl">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
              {cmsField(cms, "eyebrow", "Who We Are")}
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#001a3d] sm:text-4xl lg:text-[2.65rem]">
              {cmsField(cms, "title", "An extension of manufacturers and suppliers")}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-base leading-relaxed text-[#555555]">
              {cmsField(
                cms,
                "body",
                "Finekarts Incorporated connects trusted suppliers with qualified buyers worldwide. We specialize in the sourcing, quality coordination, and logistics of bulk agricultural commodities with integrity and professionalism.",
              )}
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-4 text-base leading-relaxed text-[#555555]">
              {cmsField(
                cms,
                "body2",
                "From origin to destination, our team ensures reliable execution, transparent communication, and consistent value at every step — without inventing volumes, certifications, or guarantees.",
              )}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <Link
              href="/products"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#c88e4a] transition hover:gap-3"
            >
              Discover products <span aria-hidden>→</span>
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

export function AboutCapabilities({ cms }: { cms?: Record<string, string> }) {
  const capabilities = [
    "Specification alignment for edible oils, sugar, rice & grains, beans, and related programmes",
    "Third-party inspection coordination when agreed — agency and scope are transaction-specific",
    "FOB and CIF structures commonly discussed; risk transfer follows the signed Incoterms and contract",
    "Documentation discipline for contracts, shipping papers, and bank-facing checklists",
  ];

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container-page grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
              {cmsField(cms, "eyebrow", "What we coordinate")}
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#001a3d] sm:text-4xl">
              {cmsField(cms, "title", "Global programmes, qualified channels")}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-base leading-relaxed text-[#555555]">
              {cmsField(
                cms,
                "body",
                "We source bulk agricultural commodities for industrial buyers, refiners, and distributors. Origins, grades, and sustainability claims are stated only when verified. Packaging and logistics modes — container, flexitank, ISO tank, or vessel — apply only where product and corridor allow.",
              )}
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-4 text-base leading-relaxed text-[#555555]">
              Buyer relationships begin with enquiry and diligence. Supplier programmes are
              invitation-led after verification. No deal exists until contractual documents are
              agreed.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <ul className="space-y-0 border-t border-[#d5d0c8]">
            {capabilities.map((item) => (
              <li
                key={item}
                className="border-b border-[#d5d0c8] py-5 text-sm leading-relaxed text-[#444444]"
              >
                <span className="mr-3 inline-block h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-[#d4a84b]" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

export function AboutProcess({ cms }: { cms?: Record<string, string> }) {
  const steps = [
    {
      n: "01",
      title: "Submit Request",
      text: "Share product, quantity, destination, and preferred Incoterms through the RFQ form.",
    },
    {
      n: "02",
      title: "Review & Quote",
      text: "Trade desk reviews fit against supplier programmes and workable logistics structures.",
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
    <section className="bg-[#0a1628] py-16 text-white lg:py-24">
      <div className="container-page">
        <Reveal>
          <p className="text-center text-xs font-semibold tracking-[0.22em] text-[#d4a84b] uppercase">
            {cmsField(cms, "eyebrow", "How we work")}
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mx-auto mt-3 max-w-2xl text-center text-3xl font-semibold sm:text-4xl">
            {cmsField(cms, "title", "A clear path from request to delivery")}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-white/65">
            {cmsField(
              cms,
              "body",
              "Our role is to align specifications, inspection, logistics, and documentation — not to guarantee outcomes.",
            )}
          </p>
        </Reveal>

        <div className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
          <div className="pointer-events-none absolute top-8 right-[12%] left-[12%] hidden h-px bg-white/15 md:block" />
          {steps.map((step, i) => (
            <Reveal key={step.n} delay={0.12 + i * 0.06}>
              <div className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#d4a84b] bg-[#0a1628] text-sm font-bold text-[#d4a84b]">
                  {step.n}
                </div>
                <h3 className="mt-5 font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutGlobal({
  home3 = "/images/home-3.png",
  cms,
}: {
  home3?: string;
  cms?: Record<string, string>;
}) {
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
            />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <h2 className="whitespace-pre-line text-3xl font-semibold leading-tight text-[#001a3d] sm:text-4xl">
              {cmsField(cms, "title", "Sourced responsibly.\nDelivered globally.")}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#555555]">
              {cmsField(
                cms,
                "body",
                "Our network of suppliers and logistics partners helps us deliver quality commodities reliably — with transparent communication and documentation discipline at every corridor.",
              )}
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <GoldButton href="/resources" className="mt-10">
              How We Trade <span aria-hidden>→</span>
            </GoldButton>
          </Reveal>
        </div>
      </div>
    </section>
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
            {cmsField(cms, "title", "Ready to discuss an enquiry?")}
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/70">
            {cmsField(
              cms,
              "body",
              "Share specifications and destination details. Submission does not guarantee acceptance or pricing.",
            )}
          </p>
        </Reveal>
        <Reveal delay={0.14}>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
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
        <Reveal delay={0.2}>
          <p className="mt-8 text-sm text-white/55">
            <a href={`mailto:${email}`} className="text-[#d4a84b] transition hover:text-[#e8bc5c]">
              {email}
            </a>
            <span className="mx-3 text-white/25">·</span>
            <a href={`tel:${phone}`} className="text-[#d4a84b] transition hover:text-[#e8bc5c]">
              {phoneDisplay}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
