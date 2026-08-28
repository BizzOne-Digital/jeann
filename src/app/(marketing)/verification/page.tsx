import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";
import { MarketingStorySection } from "@/components/marketing/MarketingStorySection";
import { Reveal } from "@/components/motion/Reveal";
import { VERIFICATION_STORY } from "@/lib/content/marketing-pages";
import {
  GLOBAL_VERIFICATION_NETWORK,
  REAL_TIME_INTELLIGENCE,
  VERIFICATION_CTA,
  VERIFICATION_FRAMEWORK_STEPS,
  VERIFICATION_HERO,
  VERIFICATION_NOT_GUARANTEE,
  VERIFICATION_REPORT_SECTIONS,
  VERIFICATION_SERVICES,
} from "@/lib/content/verification-content";

export const metadata: Metadata = {
  title: "Global Business Verification & Due Diligence",
  description:
    "Finekarts Verification Services helps buyers and sellers obtain independent business intelligence — corporate registration, licenses, supplier and buyer due diligence, credit assessment, supply-chain mapping and compliance screening.",
};

export default function VerificationPage() {
  const story = VERIFICATION_STORY;

  return (
    <>
      <PageHero
        tone="light"
        title={VERIFICATION_HERO.title}
        brand={VERIFICATION_HERO.eyebrow}
        description={VERIFICATION_HERO.description}
        imageSrc={story.imageSrc}
        imageAlt={story.imageAlt}
        primaryCta={VERIFICATION_HERO.primaryCta}
        secondaryCta={VERIFICATION_HERO.secondaryCta}
      />

      <MarketingStorySection
        eyebrow={story.eyebrow}
        title={story.title}
        lead={story.lead}
        boxes={story.boxes}
        imageSrc="/images/inspections/sampling-grain.png"
        imageAlt="Sampling for independent commodity verification"
        youtubeUrl={story.youtubeUrl}
        videoTitle="Business verification overview"
      />

      <section className="bg-[#f3f1ec] py-16 lg:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-semibold text-[#001a3d] sm:text-3xl">
            {GLOBAL_VERIFICATION_NETWORK.title}
          </h2>
          <p className="mt-3 max-w-3xl text-base text-[#555555]">{GLOBAL_VERIFICATION_NETWORK.lead}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {GLOBAL_VERIFICATION_NETWORK.regions.map((region) => (
              <span
                key={region}
                className="rounded-full border border-[#d5d0c8] bg-white px-4 py-2 text-sm font-medium text-[#001a3d]"
              >
                {region}
              </span>
            ))}
          </div>
          <p className="mt-6 text-sm text-[#555555]">{GLOBAL_VERIFICATION_NETWORK.note}</p>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-semibold text-[#001a3d]">{REAL_TIME_INTELLIGENCE.title}</h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#555555]">
            {REAL_TIME_INTELLIGENCE.lead}
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#555555]">{REAL_TIME_INTELLIGENCE.note}</p>
          <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-950">
            {REAL_TIME_INTELLIGENCE.disclaimer}
          </p>
        </div>
      </section>

      <section id="our-services" className="bg-[#f3f1ec] py-16 lg:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-semibold text-[#001a3d] sm:text-3xl">Our verification services</h2>
          <p className="mt-3 max-w-3xl text-base text-[#555555]">
            We help verify whether a company is legally established, operational, licensed, commercially credible
            and capable of performing the proposed transaction.
          </p>
          <div className="mt-10 space-y-4">
            {VERIFICATION_SERVICES.map((service, index) => (
              <Reveal key={service.n} delay={index * 0.02}>
                <article className="rounded-lg border border-[#d5d0c8] bg-white p-6 sm:p-8">
                  <p className="text-xs font-semibold tracking-[0.2em] text-[#c88e4a] uppercase">
                    Service {service.n}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[#001a3d]">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#444444]">{service.summary}</p>
                  {"body" in service && service.body ? (
                    <p className="mt-4 text-sm leading-relaxed text-[#555555]">{service.body}</p>
                  ) : null}
                  {"sections" in service && service.sections ? (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {service.sections.map((section) => (
                        <div
                          key={section.title}
                          className="rounded-md border border-[#e8e4dc] bg-[#f9f8f5] p-4"
                        >
                          <h4 className="font-semibold text-[#001a3d]">{section.title}</h4>
                          <p className="mt-2 text-sm leading-relaxed text-[#555555]">{section.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {"items" in service && service.items && service.items.length > 0 ? (
                    <>
                      {service.intro ? (
                        <p className="mt-4 text-sm font-medium text-[#001a3d]">{service.intro}</p>
                      ) : null}
                      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                        {service.items.map((item) => (
                          <li key={item} className="flex gap-2 text-sm text-[#555555]">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a84b]" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                  {"note" in service && service.note ? (
                    <p className="mt-4 text-xs leading-relaxed text-[#777777]">{service.note}</p>
                  ) : null}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#071525] py-16 text-white lg:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-semibold sm:text-3xl">Our verification framework</h2>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VERIFICATION_FRAMEWORK_STEPS.map((step) => (
              <li
                key={step.step}
                className="rounded-lg border border-white/15 bg-white/5 p-5 backdrop-blur-sm"
              >
                <p className="text-xs font-semibold tracking-[0.2em] text-[#d4a84b] uppercase">
                  Step {step.step}
                </p>
                <h3 className="mt-2 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-semibold text-[#001a3d]">Verification reports</h2>
          <p className="mt-3 max-w-3xl text-base text-[#555555]">
            A Finekarts verification report can be structured around the following sections:
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VERIFICATION_REPORT_SECTIONS.map((section) => (
              <article key={section.title} className="rounded-lg border border-[#d5d0c8] bg-[#f9f8f5] p-5">
                <h3 className="font-semibold text-[#001a3d]">{section.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#555555]">{section.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f3f1ec] py-16 lg:py-20">
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
        <Image src="/images/hero-commodities.png" alt="" fill className="object-cover" sizes="100vw" aria-hidden />
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
              className="focus-ring inline-flex items-center gap-2 rounded-md bg-[#d4a84b] px-6 py-3.5 text-sm font-semibold text-[#071525] transition hover:bg-[#c4983f]"
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
