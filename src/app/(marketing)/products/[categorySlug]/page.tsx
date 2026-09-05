import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { getCategories } from "@/lib/content/catalog";
import { getPublicCategory } from "@/lib/content/catalog-server";
import { buyerQuoteHref } from "@/lib/marketing/cta-links";
import { getCategoryCover, getProductListingImage } from "@/lib/content/product-images";
import { CoffeeCategorySections } from "@/components/marketing/CoffeeSections";
import { SpicesCategorySections } from "@/components/marketing/SpiceSections";
import { RiceCategorySections } from "@/components/marketing/RiceSections";
import { BeansCategorySections } from "@/components/marketing/PulseSections";
import { EdibleOilsCategorySections } from "@/components/marketing/OilSections";
import { SugarCategorySections } from "@/components/marketing/SugarSections";
import { isEdibleOilsCategory, OIL_CATEGORY } from "@/lib/content/oil-product-content";
import { BEANS_CATEGORY, isBeansCategory } from "@/lib/content/pulse-product-content";
import { isRiceCategory, RICE_CATEGORY } from "@/lib/content/rice-product-content";
import { isCoffeeCategory, COFFEE_CATEGORY } from "@/lib/content/coffee-product-content";
import { isSpicesCategory, SPICES_CATEGORY } from "@/lib/content/spice-product-content";
import { isSugarCategory, SUGAR_CATEGORY } from "@/lib/content/sugar-product-content";

type Props = { params: Promise<{ categorySlug: string }> };

export async function generateStaticParams() {
  return getCategories().map((c) => ({ categorySlug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = await getPublicCategory(categorySlug);
  if (!category) return { title: "Category not found" };
  return {
    title: getCategoryCover(category.slug).shortName,
    description: category.summary,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { categorySlug } = await params;
  const category = await getPublicCategory(categorySlug);
  if (!category) notFound();

  const cover = getCategoryCover(category.slug);
  const isSugar = isSugarCategory(category.slug);
  const isEdibleOils = isEdibleOilsCategory(category.slug);
  const isBeans = isBeansCategory(category.slug);
  const isRice = isRiceCategory(category.slug);
  const isCoffee = isCoffeeCategory(category.slug);
  const isSpices = isSpicesCategory(category.slug);

  return (
    <>
      <PageHero
        title={
          isSugar
            ? SUGAR_CATEGORY.title
            : isEdibleOils
              ? OIL_CATEGORY.title
              : isBeans
                ? BEANS_CATEGORY.title
                : isRice
                  ? RICE_CATEGORY.title
                  : isCoffee
                    ? COFFEE_CATEGORY.title
                    : isSpices
                      ? SPICES_CATEGORY.title
                      : cover.shortName
        }
        brand={
          isSugar
            ? SUGAR_CATEGORY.eyebrow
            : isEdibleOils
              ? OIL_CATEGORY.eyebrow
              : isBeans
                ? BEANS_CATEGORY.eyebrow
                : isRice
                  ? RICE_CATEGORY.eyebrow
                  : isCoffee
                    ? COFFEE_CATEGORY.eyebrow
                    : isSpices
                      ? SPICES_CATEGORY.eyebrow
                      : undefined
        }
        description={
          isSugar
            ? SUGAR_CATEGORY.lead
            : isEdibleOils
              ? OIL_CATEGORY.lead
              : isBeans
                ? BEANS_CATEGORY.lead
                : isRice
                  ? RICE_CATEGORY.lead
                  : isCoffee
                    ? COFFEE_CATEGORY.lead
                    : isSpices
                      ? SPICES_CATEGORY.lead
                      : category.summary
        }
        imageSrc={cover.image}
        imageAlt={cover.alt}
        primaryCta={{ href: buyerQuoteHref(), label: "Request a Quote →" }}
        secondaryCta={{ href: "/products", label: "All categories" }}
      />

      {isSugar ? <SugarCategorySections /> : null}
      {isEdibleOils ? <EdibleOilsCategorySections /> : null}
      {isBeans ? <BeansCategorySections /> : null}
      {isRice ? <RiceCategorySections /> : null}
      {isCoffee ? <CoffeeCategorySections /> : null}
      {isSpices ? <SpicesCategorySections /> : null}

      <section className="bg-[#f3f1ec] py-14 lg:py-20">
        <div className="container-page">
          <nav className="text-sm text-[#666666]" aria-label="Breadcrumb">
            <Link href="/products" className="transition hover:text-[#c88e4a]">
              Products
            </Link>
            <span className="mx-2 text-[#ccc]">/</span>
            <span className="text-[#001a3d]">{cover.shortName}</span>
          </nav>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-2xl font-semibold text-[#001a3d]">Products in this category</h2>
            <p className="text-sm text-[#666666]">
              {category.products.length} listing{category.products.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {category.products.map((product, i) => (
              <Reveal key={product.slug} delay={Math.min(i * 0.04, 0.2)}>
                <Link
                  href={`/products/${category.slug}/${product.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[16/11] overflow-hidden bg-[#e4e0d8]">
                    <Image
                      src={getProductListingImage(product, category.slug)}
                      alt=""
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 50vw, 360px"
                    />
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-[#001a3d] transition group-hover:text-[#c88e4a]">
                    {product.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#666666]">
                    {product.overview}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#c88e4a]">
                    View details <span aria-hidden>→</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
