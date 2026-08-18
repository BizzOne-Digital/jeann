import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { getCategories, getCategory } from "@/lib/content/catalog";
import { buyerQuoteHref } from "@/lib/marketing/cta-links";
import { getCategoryCover } from "@/lib/content/product-images";

type Props = { params: Promise<{ categorySlug: string }> };

export async function generateStaticParams() {
  return getCategories().map((c) => ({ categorySlug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = getCategory(categorySlug);
  if (!category) return { title: "Category not found" };
  return {
    title: getCategoryCover(category.slug).shortName,
    description: category.summary,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { categorySlug } = await params;
  const category = getCategory(categorySlug);
  if (!category) notFound();

  const cover = getCategoryCover(category.slug);

  return (
    <>
      <PageHero
        title={cover.shortName}
        description={category.summary}
        imageSrc={cover.image}
        imageAlt={cover.alt}
        primaryCta={{ href: buyerQuoteHref(), label: "Request a Quote →" }}
        secondaryCta={{ href: "/products", label: "All categories" }}
      />

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
                      src={product.image || cover.image}
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
