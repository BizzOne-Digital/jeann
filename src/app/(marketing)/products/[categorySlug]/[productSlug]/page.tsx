import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/marketing/PageHero";
import {
  ProductDetailEnquiryCta,
  ProductDetailHub,
} from "@/components/marketing/ProductDetailHub";
import { getCategories } from "@/lib/content/catalog";
import { getPublicProduct } from "@/lib/content/catalog-server";
import { resolveImageSrc } from "@/lib/media/resolve-image-src";
import { buyerOrderHref } from "@/lib/marketing/cta-links";
import { getBulkMinOrderText } from "@/lib/marketing/bulk-order-minimums";
import { BulkOrderBox } from "@/components/marketing/BulkOrderBox";
import { getCategoryCover } from "@/lib/content/product-images";
import type { ProductDetailContent } from "@/lib/content/product-detail-shared";
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
  getCoffeeProductDetail,
  getCoffeeProductMarketing,
} from "@/lib/content/coffee-product-content";
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
  const result = await getPublicProduct(categorySlug, productSlug);
  if (!result) return { title: "Product not found" };
  return {
    title: result.product.name,
    description: result.product.overview,
  };
}

export default async function ProductPage({ params }: Props) {
  const { categorySlug, productSlug } = await params;
  const result = await getPublicProduct(categorySlug, productSlug);
  if (!result) notFound();

  const { category, product } = result;
  const cover = getCategoryCover(category.slug);
  const related = category.products.filter((p) => p.slug !== product.slug).slice(0, 3);
  const orderHref = buyerOrderHref(product.slug);
  const sugarMarketing = getSugarProductMarketing(product.slug);
  const sugarGrade = getSugarGradeDetail(product.slug);
  const oilMarketing = getOilProductMarketing(product.slug);
  const oilProduct = getOilProductDetail(product.slug);
  const pulseMarketing = getPulseProductMarketing(product.slug);
  const pulseProduct = getPulseProductDetail(product.slug);
  const riceMarketing = getRiceProductMarketing(product.slug);
  const riceProduct = getRiceProductDetail(product.slug);
  const coffeeMarketing = getCoffeeProductMarketing(product.slug);
  const coffeeProduct = getCoffeeProductDetail(product.slug);
  const spiceMarketing = getSpiceProductMarketing(product.slug);
  const spiceProduct = getSpiceProductDetail(product.slug);
  const marketing =
    sugarMarketing ??
    oilMarketing ??
    pulseMarketing ??
    riceMarketing ??
    spiceMarketing ??
    coffeeMarketing ??
    getDefaultProductMarketing(product.name, category.name);

  const heroImage = resolveImageSrc(
    product.image ??
      sugarGrade?.heroImage ??
      oilProduct?.heroImage ??
      pulseProduct?.heroImage ??
      riceProduct?.heroImage ??
      spiceProduct?.heroImage ??
      coffeeProduct?.heroImage ??
      cover.image,
  );

  const heroImageAlt =
    sugarGrade?.images?.[0]?.alt ??
    oilProduct?.images?.[0]?.alt ??
    pulseProduct?.images?.[0]?.alt ??
    riceProduct?.images?.[0]?.alt ??
    spiceProduct?.images?.[0]?.alt ??
    coffeeProduct?.images?.[0]?.alt ??
    `${product.name} reference`;

  const contentBoxes =
    sugarMarketing?.contentBoxes ??
    oilMarketing?.contentBoxes ??
    pulseMarketing?.contentBoxes ??
    riceMarketing?.contentBoxes ??
    spiceMarketing?.contentBoxes ??
    coffeeMarketing?.contentBoxes ??
    marketing.contentBoxes;

  const detailContent = buildDetailContent({
    productName: product.name,
    productDescription: product.description ?? marketing.description,
    productHighlights: product.highlights ?? marketing.highlights,
    sugarGrade,
    oilProduct,
    pulseProduct,
    riceProduct,
    spiceProduct,
    coffeeProduct,
  });

  const youtubeUrl =
    sugarGrade?.youtubeVideoId || product.youtubeVideoId
      ? `https://www.youtube.com/watch?v=${sugarGrade?.youtubeVideoId ?? product.youtubeVideoId}`
      : marketing.youtubeVideoId
        ? `https://www.youtube.com/watch?v=${marketing.youtubeVideoId}`
        : undefined;

  return (
    <>
      <PageHero
        title={product.name}
        description={product.overview}
        imageSrc={heroImage}
        imageAlt={heroImageAlt}
        primaryCta={{ href: orderHref, label: "Click here to ORDER →" }}
        secondaryCta={{ href: `/products/${category.slug}`, label: `Back to ${cover.shortName}` }}
      />

      <section className="border-b border-[#d5d0c8] bg-white py-8">
        <div className="container-page">
          <BulkOrderBox categorySlug={category.slug} productSlug={product.slug} />
        </div>
      </section>

      <ProductDetailHub
        productName={product.name}
        categoryName={cover.shortName}
        categorySlug={category.slug}
        content={detailContent}
        trade={{
          gradeSummary: product.gradeSummary,
          originOptions: product.originOptions ?? [],
          incotermOptions: product.incotermOptions ?? [],
          packaging: product.packaging ?? [],
          inspectionOptions: product.inspectionOptions ?? [],
          documentCategories: product.documentCategories ?? [],
          availabilityText: product.availabilityText,
          minOrderText: getBulkMinOrderText(category.slug, product.slug),
          status: product.status,
        }}
        pillars={contentBoxes}
        heroImage={heroImage}
        heroImageAlt={heroImageAlt}
        quoteHref={orderHref}
        youtubeUrl={youtubeUrl}
        videoTitle={`${product.name} overview`}
      />

      {related.length > 0 ? (
        <section className="bg-[#f3f1ec] marketing-section">
          <div className="container-page">
            <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
              Related products
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-[#001a3d]">More in {cover.shortName}</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/products/${category.slug}/${p.slug}`}
                  className="group marketing-box marketing-box-interactive block rounded-lg p-5 shadow-sm"
                >
                  <h3 className="text-base font-semibold text-[#001a3d] group-hover:text-[#c88e4a]">
                    {p.name}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#666666]">{p.overview}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#c88e4a]">
                    View details <span aria-hidden>→</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <ProductDetailEnquiryCta productName={product.name} orderHref={orderHref} />
    </>
  );
}

function buildDetailContent({
  productName,
  productDescription,
  productHighlights,
  sugarGrade,
  oilProduct,
  pulseProduct,
  riceProduct,
  spiceProduct,
  coffeeProduct,
}: {
  productName: string;
  productDescription: string;
  productHighlights: string[];
  sugarGrade: ReturnType<typeof getSugarGradeDetail>;
  oilProduct: ReturnType<typeof getOilProductDetail>;
  pulseProduct: ReturnType<typeof getPulseProductDetail>;
  riceProduct: ReturnType<typeof getRiceProductDetail>;
  spiceProduct: ReturnType<typeof getSpiceProductDetail>;
  coffeeProduct: ReturnType<typeof getCoffeeProductDetail>;
}): ProductDetailContent {
  if (sugarGrade) {
    return {
      grade: sugarGrade.code,
      subtitle: sugarGrade.subtitle,
      description: sugarGrade.description,
      applications: sugarGrade.applications,
      characteristics: sugarGrade.characteristics,
      packaging: sugarGrade.packaging,
      note: sugarGrade.note,
      highlights: sugarGrade.highlights,
      images: sugarGrade.images,
    };
  }

  const rich = oilProduct ?? pulseProduct ?? riceProduct ?? spiceProduct ?? coffeeProduct;
  if (rich) {
    return {
      grade: rich.grade,
      subtitle: rich.subtitle,
      description: rich.description,
      applications: rich.applications,
      characteristics: rich.characteristics,
      packaging: rich.packaging,
      note: rich.note,
      highlights: rich.highlights,
      images: rich.images,
    };
  }

  return {
    grade: productName,
    subtitle: "Structured for qualified buyers",
    description: productDescription,
    applications: [],
    characteristics: [],
    packaging: [],
    highlights: productHighlights,
  };
}
