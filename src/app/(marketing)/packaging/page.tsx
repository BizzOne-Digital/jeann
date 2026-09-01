import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import {
  getOrderedPackagingTypes,
  isHomepageFeaturedPackaging,
  PACKAGING_CTA,
  PACKAGING_HERO,
  PACKAGING_PAGE_INTRO,
  PACKAGING_SELECTION,
} from "@/lib/content/packaging-content";
import { PackagingTypeIndex } from "@/components/marketing/PackagingTypeIndex";
import { PACKAGING_IMAGES } from "@/lib/content/packaging-images";
import { buyerPortalHref } from "@/lib/marketing/cta-links";

export const metadata: Metadata = {
  title: "Packaging types",
  description:
    "Packaging and transport modes for international commodity trade — flexitank, tanker vessel, containerized cargo, bulk truck, bulk vessel, bulk railcar, ISO tanks, IBC totes, drums, FIBCs, bulk liners and woven bags.",
};

const CATEGORY_LABELS = {
  transport: "Transport & logistics modes",
  product: "Product packaging formats",
} as const;

const MODE_LABELS = {
  dry: "Dry bulk",
  liquid: "Liquid bulk",
  unpackaged: "Unpackaged / vessel",
} as const;

export default function PackagingPage() {
  const packagingTypes = getOrderedPackagingTypes();

  return (
    <>
      <PageHero
        tone="light"
        title={PACKAGING_HERO.title}
        brand={PACKAGING_HERO.eyebrow}
        description={PACKAGING_HERO.description}
        imageSrc={PACKAGING_IMAGES.containerizedCargoPort.src}
        imageAlt={PACKAGING_IMAGES.containerizedCargoPort.alt}
        primaryCta={PACKAGING_HERO.primaryCta}
        secondaryCta={PACKAGING_HERO.secondaryCta}
      />

      <section className="bg-[#f3f1ec] py-16 lg:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-semibold text-[#001a3d] sm:text-3xl">
            {PACKAGING_PAGE_INTRO.title}
          </h2>
          <p className="mt-3 max-w-3xl text-base text-[#555555]">
            {PACKAGING_PAGE_INTRO.description}
          </p>
          <PackagingTypeIndex />
        </div>
      </section>

      <section id="packaging-types" className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-semibold text-[#001a3d] sm:text-3xl">Detailed specifications</h2>
          <p className="mt-3 max-w-3xl text-base text-[#555555]">
            Each packaging type below includes typical applications, advantages, suitable commodities
            and notes where corridor or product confirmation is required.
          </p>

          <div className="mt-12 space-y-16">
            {packagingTypes.map((type, index) => {
              const prev = packagingTypes[index - 1];
              const showCategoryHeader = !prev || prev.category !== type.category;
              const featured = isHomepageFeaturedPackaging(type.slug);

              return (
              <Reveal key={type.slug} delay={index * 0.03}>
                {showCategoryHeader ? (
                  <h3
                    className={`text-lg font-semibold text-[#001a3d] ${
                      index === 0 ? "" : "mt-4 border-t border-[#e8e4dc] pt-12"
                    }`}
                  >
                    {CATEGORY_LABELS[type.category]}
                  </h3>
                ) : null}
                <article
                  id={type.slug}
                  className={`scroll-mt-28 border-t border-[#e8e4dc] pt-12 ${
                    showCategoryHeader && index > 0 ? "mt-8" : index === 0 ? "" : ""
                  }`}
                >
                  <div
                    className={`grid items-start gap-10 lg:grid-cols-2 ${
                      index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    <div>
                      <p className="text-xs font-semibold tracking-[0.2em] text-[#c88e4a] uppercase">
                        {String(type.order).padStart(2, "0")} · {MODE_LABELS[type.mode]}
                        {featured ? (
                          <span className="ml-2 rounded bg-[#001a3d] px-1.5 py-0.5 text-[0.6rem] tracking-wide text-white normal-case">
                            Also on homepage
                          </span>
                        ) : null}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-[#001a3d]">{type.name}</h3>
                      <p className="mt-1 text-sm font-medium text-[#777777]">{type.summary}</p>
                      <p className="mt-4 text-sm leading-relaxed text-[#555555]">{type.description}</p>

                      <div className="mt-6 grid gap-6 sm:grid-cols-2">
                        <div>
                          <h4 className="text-xs font-semibold tracking-wide text-[#001a3d] uppercase">
                            Typical applications
                          </h4>
                          <ul className="mt-3 space-y-2">
                            {type.applications.map((item) => (
                              <li key={item} className="flex gap-2 text-sm text-[#555555]">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a84b]" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold tracking-wide text-[#001a3d] uppercase">
                            Advantages
                          </h4>
                          <ul className="mt-3 space-y-2">
                            {type.advantages.map((item) => (
                              <li key={item} className="flex gap-2 text-sm text-[#555555]">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a84b]" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <p className="mt-5 text-xs text-[#888888]">
                        <span className="font-semibold text-[#001a3d]">Commodities:</span>{" "}
                        {type.commodities.join(" · ")}
                      </p>
                      {type.note ? (
                        <p className="mt-4 text-xs leading-relaxed text-[#777777]">{type.note}</p>
                      ) : null}
                    </div>

                    <div className={`grid gap-4 ${type.images.length > 1 ? "sm:grid-cols-2" : ""}`}>
                      {type.images.map((image) => (
                        <div
                          key={image.src}
                          className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#d5d0c8] bg-[#e4e0d8]"
                        >
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 480px"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f3f1ec] py-16 lg:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-semibold text-[#001a3d]">{PACKAGING_SELECTION.title}</h2>
          <p className="mt-3 max-w-3xl text-base text-[#555555]">{PACKAGING_SELECTION.lead}</p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {PACKAGING_SELECTION.factors.map((factor) => (
              <li key={factor} className="flex gap-2 text-sm text-[#555555]">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a84b]" />
                {factor}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="text-sm font-semibold text-[#c88e4a] underline">
              View products
            </Link>
            <span className="text-[#ccc]">·</span>
            <Link href="/logistics" className="text-sm font-semibold text-[#c88e4a] underline">
              Logistics
            </Link>
            <span className="text-[#ccc]">·</span>
            <Link href="/inspections" className="text-sm font-semibold text-[#c88e4a] underline">
              Inspections
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 text-white lg:py-20">
        <Image
          src={PACKAGING_IMAGES.bulkVessel.src}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          aria-hidden
        />
        <div className="absolute inset-0 bg-[#071525]/88" />
        <div className="container-page relative">
          <p className="text-sm font-semibold tracking-[0.18em] text-[#d4a84b] uppercase">
            {PACKAGING_CTA.tagline}
          </p>
          <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">{PACKAGING_CTA.title}</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80">{PACKAGING_CTA.lead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={buyerPortalHref("/portal/buyer/new-request")}
              className="focus-ring inline-flex items-center gap-2 rounded-md bg-[#d4a84b] px-6 py-3.5 text-sm font-semibold text-[#071525] transition hover:bg-[#c4983f]"
            >
              Buyer portal — submit RFQ <span aria-hidden>→</span>
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
