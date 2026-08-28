import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";
import { MarketingStorySection } from "@/components/marketing/MarketingStorySection";
import { Reveal } from "@/components/motion/Reveal";
import { INSPECTIONS_STORY } from "@/lib/content/marketing-pages";
import {
  COMMODITY_INSPECTION_CATEGORIES,
  DOCUMENTARY_TRADE,
  INSPECTION_CTA,
  INSPECTIONS_HERO,
  INSPECTION_NETWORK,
  INSPECTION_PROCESS_STEPS,
  INSPECTION_SERVICES,
  ORIGIN_DESTINATION,
  WHY_INDEPENDENT_INSPECTION,
} from "@/lib/content/inspections-content";

export const metadata: Metadata = {
  title: "Independent Commodity Inspection Services",
  description:
    "Finekarts coordinates independent inspection, testing, and verification at origin and destination — supplier verification, quality, quantity, loading supervision, and laboratory analysis.",
};

const GALLERY = [
  { src: "/images/inspections/sampling-grain.png", alt: "Inspector sampling bulk grain at port" },
  { src: "/images/inspections/cargo-inspector-loading.png", alt: "Cargo inspector supervising vessel loading" },
  { src: "/images/inspections/sugar-bags-hold.png", alt: "Quantity verification of bagged sugar in vessel hold" },
  { src: "/images/inspections/tank-sampling.png", alt: "Tank sampling on vessel deck" },
];

export default function InspectionsPage() {
  const story = INSPECTIONS_STORY;

  return (
    <>
      <PageHero
        tone="light"
        title={INSPECTIONS_HERO.title}
        brand={INSPECTIONS_HERO.eyebrow}
        description={INSPECTIONS_HERO.description}
        imageSrc={story.imageSrc}
        imageAlt={story.imageAlt}
        primaryCta={INSPECTIONS_HERO.primaryCta}
        secondaryCta={INSPECTIONS_HERO.secondaryCta}
      />

      <MarketingStorySection
        eyebrow={story.eyebrow}
        title={story.title}
        lead={story.lead}
        boxes={story.boxes}
        imageSrc="/images/inspections/tank-sampling.png"
        imageAlt="Tank sampling on vessel deck"
        youtubeUrl={story.youtubeUrl}
        videoTitle="Inspection overview"
      />

      <section id="our-services" className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-semibold text-[#001a3d] sm:text-3xl">Our inspection services</h2>
          <p className="mt-3 max-w-3xl text-base text-[#555555]">
            Finekarts can help arrange professional third-party inspection across the transaction lifecycle.
          </p>
          <div className="mt-10 space-y-4">
            {INSPECTION_SERVICES.map((service, index) => (
              <Reveal key={service.n} delay={index * 0.03}>
                <article className="rounded-lg border border-[#d5d0c8] bg-[#f9f8f5] p-6 sm:p-8">
                  <p className="text-xs font-semibold tracking-[0.2em] text-[#c88e4a] uppercase">
                    Service {service.n}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[#001a3d]">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#444444]">{service.summary}</p>
                  {"body" in service && service.body ? (
                    <p className="mt-4 text-sm leading-relaxed text-[#555555]">{service.body}</p>
                  ) : null}
                  {service.intro && service.items.length > 0 ? (
                    <p className="mt-4 text-sm font-medium text-[#001a3d]">{service.intro}</p>
                  ) : null}
                  {service.items.length > 0 ? (
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {service.items.map((item) => (
                        <li key={item} className="flex gap-2 text-sm text-[#555555]">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a84b]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {service.note ? (
                    <p className="mt-4 text-xs leading-relaxed text-[#777777]">{service.note}</p>
                  ) : null}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f3f1ec] py-16 lg:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-semibold text-[#001a3d]">
            Inspection across major commodity categories
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-[#555555]">
            Specifications are established according to commodity, contract, origin, destination and regulatory
            requirements.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COMMODITY_INSPECTION_CATEGORIES.map((cat) => (
              <article key={cat.title} className="rounded-lg border border-[#d5d0c8] bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-[#001a3d]">{cat.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#555555]">{cat.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="inspection-scope" className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-semibold text-[#001a3d]">Independent third-party inspection network</h2>
          <p className="mt-3 max-w-3xl text-base text-[#555555]">{INSPECTION_NETWORK.lead}</p>
          <p className="mt-4 text-sm text-[#555555]">
            Depending on commodity, location and scope, clients may request organizations such as:
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {INSPECTION_NETWORK.organizations.map((org) => (
              <span
                key={org}
                className="rounded-full border border-[#d5d0c8] bg-[#f9f8f5] px-4 py-2 text-sm font-medium text-[#001a3d]"
              >
                {org}
              </span>
            ))}
          </div>
          <p className="mt-6 text-sm text-[#555555]">{INSPECTION_NETWORK.selectionNote}</p>
          <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-950">
            <strong>Important:</strong> {INSPECTION_NETWORK.disclaimer}
          </p>
        </div>
      </section>

      <section className="bg-[#f3f1ec] py-16 lg:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <article className="rounded-lg border border-[#d5d0c8] bg-white p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#001a3d]">{ORIGIN_DESTINATION.origin.title}</h2>
            <p className="mt-3 text-sm text-[#555555]">{ORIGIN_DESTINATION.origin.intro}</p>
            <ul className="mt-4 space-y-2">
              {ORIGIN_DESTINATION.origin.places.map((place) => (
                <li key={place} className="flex gap-2 text-sm text-[#555555]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a84b]" />
                  {place}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-[#555555]">{ORIGIN_DESTINATION.origin.note}</p>
          </article>
          <article className="rounded-lg border border-[#d5d0c8] bg-white p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#001a3d]">{ORIGIN_DESTINATION.destination.title}</h2>
            <p className="mt-3 text-sm text-[#555555]">{ORIGIN_DESTINATION.destination.intro}</p>
            <ul className="mt-4 space-y-2">
              {ORIGIN_DESTINATION.destination.places.map((place) => (
                <li key={place} className="flex gap-2 text-sm text-[#555555]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a84b]" />
                  {place}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-[#555555]">{ORIGIN_DESTINATION.destination.note}</p>
          </article>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-semibold text-[#001a3d]">{DOCUMENTARY_TRADE.title}</h2>
          <p className="mt-3 max-w-3xl text-base text-[#555555]">{DOCUMENTARY_TRADE.lead}</p>
          <p className="mt-4 text-sm font-medium text-[#001a3d]">Where applicable, the contract should identify:</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {DOCUMENTARY_TRADE.contractItems.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-[#555555]">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a84b]" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-[#555555]">{DOCUMENTARY_TRADE.note}</p>
        </div>
      </section>

      <section className="bg-[#071525] py-16 text-white lg:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-semibold sm:text-3xl">Our inspection process</h2>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INSPECTION_PROCESS_STEPS.map((step) => (
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

      <section className="bg-[#f3f1ec] py-16 lg:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-semibold text-[#001a3d]">Why use independent inspection?</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {WHY_INDEPENDENT_INSPECTION.map((item) => (
              <article key={item.title} className="rounded-lg border border-[#d5d0c8] bg-white p-5">
                <h3 className="font-semibold text-[#001a3d]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#555555]">{item.text}</p>
              </article>
            ))}
          </div>
          <p className="mt-10 max-w-3xl text-base leading-relaxed text-[#555555]">
            Finekarts supports international commodity transactions from supplier qualification and sourcing
            through inspection, documentation, logistics and delivery — designed for buyers who require greater
            visibility and confidence when purchasing commodities internationally.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-semibold text-[#001a3d]">Field inspection gallery</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GALLERY.map((img) => (
              <div key={img.src} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#e4e0d8]">
                <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="request-inspection" className="relative overflow-hidden py-16 text-white lg:py-20">
        <Image src="/images/hero-commodities.png" alt="" fill className="object-cover" sizes="100vw" aria-hidden />
        <div className="absolute inset-0 bg-[#071525]/88" />
        <div className="container-page relative">
          <p className="text-sm font-semibold tracking-[0.18em] text-[#d4a84b] uppercase">
            {INSPECTION_CTA.tagline}
          </p>
          <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">{INSPECTION_CTA.title}</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80">{INSPECTION_CTA.lead}</p>
          <p className="mt-4 text-sm text-white/70">
            Include: {INSPECTION_CTA.fields.join(" · ")}
          </p>
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
          </div>
        </div>
      </section>
    </>
  );
}
