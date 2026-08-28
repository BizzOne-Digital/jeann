import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { getCategories, getProduct } from "@/lib/content/catalog";
import { buyerQuoteHref } from "@/lib/marketing/cta-links";
import { getCategoryCover } from "@/lib/content/product-images";
import { MarketingStorySection } from "@/components/marketing/MarketingStorySection";
import { SpiceProductDetailSections } from "@/components/marketing/SpiceSections";
import { RiceProductDetailSections } from "@/components/marketing/RiceSections";
import { PulseProductDetailSections } from "@/components/marketing/PulseSections";
import { OilProductDetailSections } from "@/components/marketing/OilSections";
import { SugarGradeDetailSections } from "@/components/marketing/SugarSections";
import {
  getOilProductDetail,
  getOilProductMarketing,
} from "@/lib/content/oil-product-content";
import {
  getPulseProductDetail,
  getPulseProductMarketing,
} from "@/lib/content/pulse-product-content";
import {
  getRiceProductDetail,
  getRiceProductMarketing,
} from "@/lib/content/rice-product-content";
import {
  getSpiceProductDetail,
  getSpiceProductMarketing,
} from "@/lib/content/spice-product-content";
import {
  getDefaultProductMarketing,
  getSugarGradeDetail,
  getSugarProductMarketing,
} from "@/lib/content/sugar-product-content";

type Props = { params: Promise<{ categorySlug: string; productSlug: string }> };

export async function generateStaticParams() {
  return getCategories().flatMap((c) =>
    c.products.map((p) => ({ categorySlug: c.slug, productSlug: p.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug, productSlug } = await params;
  const result = getProduct(categorySlug, productSlug);
  if (!result) return { title: "Product not found" };
  return {
    title: result.product.name,
    description: result.product.overview,
  };
}

export default async function ProductPage({ params }: Props) {
  const { categorySlug, productSlug } = await params;
  const result = getProduct(categorySlug, productSlug);
  if (!result) notFound();

  const { category, product } = result;
  const cover = getCategoryCover(category.slug);
  const related = category.products.filter((p) => p.slug !== product.slug).slice(0, 3);
  const quoteHref = buyerQuoteHref(product.slug);
  const sugarMarketing = getSugarProductMarketing(product.slug);
  const sugarGrade = getSugarGradeDetail(product.slug);
  const oilMarketing = getOilProductMarketing(product.slug);
  const oilProduct = getOilProductDetail(product.slug);
  const pulseMarketing = getPulseProductMarketing(product.slug);
  const pulseProduct = getPulseProductDetail(product.slug);
  const riceMarketing = getRiceProductMarketing(product.slug);
  const riceProduct = getRiceProductDetail(product.slug);
  const spiceMarketing = getSpiceProductMarketing(product.slug);
  const spiceProduct = getSpiceProductDetail(product.slug);
  const marketing =
    sugarMarketing ??
    oilMarketing ??
    pulseMarketing ??
    riceMarketing ??
    spiceMarketing ??
    getDefaultProductMarketing(product.name, category.name);
  const heroImage =
    sugarGrade?.heroImage ??
    oilProduct?.heroImage ??
    pulseProduct?.heroImage ??
    riceProduct?.heroImage ??
    spiceProduct?.heroImage ??
    product.image ??
    cover.image;
  const storyImage =
    sugarGrade?.images?.[0]?.src ??
    oilProduct?.images?.[0]?.src ??
    pulseProduct?.images?.[0]?.src ??
    riceProduct?.images?.[0]?.src ??
    spiceProduct?.images?.[0]?.src ??
    sugarGrade?.heroImage ??
    oilProduct?.heroImage ??
    pulseProduct?.heroImage ??
    riceProduct?.heroImage ??
    spiceProduct?.heroImage ??
    product.image ??
    cover.image;
  const contentBoxes =
    sugarMarketing?.contentBoxes ??
    oilMarketing?.contentBoxes ??
    pulseMarketing?.contentBoxes ??
    riceMarketing?.contentBoxes ??
    spiceMarketing?.contentBoxes ??
    marketing.contentBoxes;
  const storyTitle = sugarGrade
    ? `${sugarGrade.code} — ${sugarGrade.subtitle}`
    : oilProduct
      ? `${oilProduct.grade} — ${oilProduct.subtitle}`
      : pulseProduct
        ? `${pulseProduct.grade} — ${pulseProduct.subtitle}`
        : riceProduct
          ? `${riceProduct.grade} — ${riceProduct.subtitle}`
          : spiceProduct
            ? `${spiceProduct.grade} — ${spiceProduct.subtitle}`
            : `${product.name} — structured for qualified buyers`;

  return (
    <>
      <PageHero
        title={product.name}
        description={product.overview}
        imageSrc={heroImage}
        imageAlt={`${product.name} reference`}
        primaryCta={{ href: quoteHref, label: "Request a Quote →" }}
        secondaryCta={{ href: `/products/${category.slug}`, label: `Back to ${cover.shortName}` }}
      />

      <MarketingStorySection
        eyebrow={category.name}
        title={storyTitle}
        lead={product.description ?? marketing.description}
        boxes={contentBoxes}
        imageSrc={storyImage}
        imageAlt={
          sugarGrade?.images?.[0]?.alt ??
          oilProduct?.images?.[0]?.alt ??
          pulseProduct?.images?.[0]?.alt ??
          riceProduct?.images?.[0]?.alt ??
          spiceProduct?.images?.[0]?.alt ??
          `${product.name} reference`
        }
        youtubeUrl={
          sugarGrade?.youtubeVideoId || product.youtubeVideoId
            ? `https://www.youtube.com/watch?v=${sugarGrade?.youtubeVideoId ?? product.youtubeVideoId}`
            : marketing.youtubeVideoId
              ? `https://www.youtube.com/watch?v=${marketing.youtubeVideoId}`
              : undefined
        }
        videoTitle={`${product.name} overview`}
        background="cream"
      />

      {sugarGrade ? <SugarGradeDetailSections grade={sugarGrade} /> : null}
      {oilProduct ? <OilProductDetailSections product={oilProduct} /> : null}
      {pulseProduct ? <PulseProductDetailSections product={pulseProduct} /> : null}
      {riceProduct ? <RiceProductDetailSections product={riceProduct} /> : null}
      {spiceProduct ? <SpiceProductDetailSections product={spiceProduct} /> : null}

      {(product.highlights ?? marketing.highlights).length > 0 ? (
        <section className="bg-white py-12 lg:py-14">
          <div className="container-page">
            <h2 className="text-xl font-semibold text-[#001a3d]">Why buyers enquire on this grade</h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {(product.highlights ?? marketing.highlights).map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-lg border border-[#d5d0c8] bg-[#f9f8f5] p-4 text-sm leading-relaxed text-[#444444]"
                >
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#d4a84b]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="bg-[#f3f1ec] py-12 lg:py-16">
        <div className="container-page">
          <nav className="text-sm text-[#666666]" aria-label="Breadcrumb">
            <Link href="/products" className="transition hover:text-[#c88e4a]">
              Products
            </Link>
            <span className="mx-2 text-[#ccc]">/</span>
            <Link
              href={`/products/${category.slug}`}
              className="transition hover:text-[#c88e4a]"
            >
              {cover.shortName}
            </Link>
            <span className="mx-2 text-[#ccc]">/</span>
            <span className="text-[#001a3d]">{product.name}</span>
          </nav>

          <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <dl className="grid gap-5 border-t border-[#d5d0c8] pt-8 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold tracking-[0.16em] text-[#888] uppercase">
                  Availability
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-[#444]">
                  {product.availabilityText}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-[0.16em] text-[#888] uppercase">
                  Minimum order
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-[#444]">
                  {product.minOrderText}
                </dd>
              </div>
            </dl>

            <Reveal y={20}>
              <div className="relative aspect-[4/3] overflow-hidden bg-[#e4e0d8]">
                <Image
                  src={heroImage}
                  alt={`${product.name} reference`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 520px"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-2xl font-semibold text-[#001a3d]">Example specifications</h2>
            <p className="mt-2 text-sm text-[#666666]">
              Illustrative only — contract specifications supersede website content.
            </p>
            <div className="table-scroll mt-6">
              <table className="w-full min-w-[280px] text-left text-sm">
                <tbody>
                  <tr className="border-t border-[#d5d0c8]">
                    <th className="py-4 pr-4 align-top font-medium text-[#888]">Grade summary</th>
                    <td className="py-4 break-words text-[#333]">{product.gradeSummary}</td>
                  </tr>
                  <tr className="border-t border-[#d5d0c8]">
                    <th className="py-4 pr-4 align-top font-medium text-[#888]">Origin options</th>
                    <td className="py-4 break-words text-[#333]">
                      {(product.originOptions ?? []).join("; ")}
                    </td>
                  </tr>
                  <tr className="border-t border-[#d5d0c8]">
                    <th className="py-4 pr-4 align-top font-medium text-[#888]">
                      Incoterms discussed
                    </th>
                    <td className="py-4 break-words text-[#333]">
                      {(product.incotermOptions ?? []).join(", ")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <SpecList title="Packaging (examples)" items={product.packaging} />
            <SpecList title="Inspection options" items={product.inspectionOptions} />
            <SpecList title="Document categories" items={product.documentCategories} />
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="bg-[#f3f1ec] py-14 lg:py-20">
          <div className="container-page">
            <h2 className="text-2xl font-semibold text-[#001a3d]">Related products</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/products/${category.slug}/${p.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[16/11] overflow-hidden bg-[#e4e0d8]">
                    <Image
                      src={p.image || cover.image}
                      alt=""
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-[#001a3d] group-hover:text-[#c88e4a]">
                    {p.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="relative overflow-hidden py-16 text-white lg:py-20">
        <Image
          src="/images/hero-commodities.png"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          aria-hidden
        />
        <div className="absolute inset-0 bg-[#071525]/85" />
        <div className="container-page relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Request a quotation</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/65">
              Include destination, quantity, and packaging preference. Submission does not guarantee
              supply or pricing.
            </p>
          </div>
          <Link
            href={quoteHref}
            className="focus-ring inline-flex shrink-0 items-center gap-2 rounded-md bg-[#d4a84b] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#c4983f]"
          >
            Request Quote <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </>
  );
}

function SpecList({ title, items }: { title: string; items?: string[] }) {
  const list = items ?? [];
  return (
    <div>
      <h3 className="text-xs font-semibold tracking-[0.16em] text-[#c88e4a] uppercase">
        {title}
      </h3>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#555555]">
        {list.map((item, index) => (
          <li key={`${title}-${item}-${index}`} className="flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#d4a84b]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
