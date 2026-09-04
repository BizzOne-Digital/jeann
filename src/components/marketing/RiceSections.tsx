import Image from "next/image";
import Link from "next/link";
import {
  RICE_SUBCATEGORIES,
  type RiceSubcategoryId,
} from "@/lib/content/rice-catalog";
import {
  getRiceProductDetail,
  RICE_CATEGORY,
  type RiceProductDetail,
} from "@/lib/content/rice-product-content";
import { Reveal } from "@/components/motion/Reveal";
import { getProductListingImage } from "@/lib/content/product-images";

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-[#001a3d]">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-[#555555]">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a84b]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RiceSpecTable({ product }: { product: RiceProductDetail }) {
  return (
    <div className="mt-8 rounded-lg border border-[#d5d0c8] bg-[#f9f8f5] p-6">
      <h3 className="text-sm font-semibold tracking-[0.12em] text-[#001a3d] uppercase">
        Illustrative specifications
      </h3>
      <div className="mt-3 h-0.5 w-12 bg-[#c88e4a]" aria-hidden />
      <ul className="mt-5 space-y-2.5">
        {product.specs.map((spec) => (
          <li key={spec.label} className="flex gap-2 text-sm text-[#444444]">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c88e4a]" />
            <span>
              <span className="font-medium text-[#001a3d]">{spec.label}:</span> {spec.value}
            </span>
          </li>
        ))}
        {product.origin ? (
          <li className="flex gap-2 text-sm text-[#444444]">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c88e4a]" />
            <span>
              <span className="font-medium text-[#001a3d]">Origin:</span> {product.origin}
            </span>
          </li>
        ) : null}
      </ul>
      {product.note ? (
        <p className="mt-5 text-xs leading-relaxed text-[#777777]">{product.note}</p>
      ) : null}
    </div>
  );
}

export function RiceProductDetailSections({ product }: { product: RiceProductDetail }) {
  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-[#c88e4a] uppercase">
              {product.grade}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#001a3d]">{product.subtitle}</h2>
            <div className="mt-3 h-0.5 w-16 bg-[#c88e4a]" aria-hidden />
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#555555]">
              {product.description}
            </p>
            <RiceSpecTable product={product} />
          </div>

          {product.images && product.images.length > 0 ? (
            <div className="relative aspect-square overflow-hidden rounded-lg border border-[#d5d0c8] bg-[#e4e0d8] lg:sticky lg:top-28">
              <Image
                src={product.images[0].src}
                alt={product.images[0].alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 480px"
              />
            </div>
          ) : null}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <DetailList title="Typical applications" items={product.applications} />
          <DetailList title="Product characteristics" items={product.characteristics} />
        </div>

        <div className="mt-10 rounded-lg border border-[#d5d0c8] bg-[#f9f8f5] p-6">
          <h3 className="text-sm font-semibold text-[#001a3d]">Packaging options</h3>
          <p className="mt-3 text-sm text-[#555555]">{product.packaging.join(" • ")}</p>
        </div>
      </div>
    </section>
  );
}

type CatalogProduct = {
  slug: string;
  name: string;
  overview: string;
  image?: string;
};

function RiceProductCard({
  product,
  categorySlug,
  index,
}: {
  product: CatalogProduct;
  categorySlug: string;
  index: number;
}) {
  const detail = getRiceProductDetail(product.slug);

  return (
    <Reveal delay={Math.min(index * 0.03, 0.18)}>
      <Link
        href={`/products/${categorySlug}/${product.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-lg border border-[#d5d0c8] bg-white shadow-sm transition hover:border-[#c88e4a]/50 hover:shadow-md"
      >
        <div className="relative aspect-square overflow-hidden bg-[#e4e0d8]">
          <Image
            src={getProductListingImage(product, categorySlug)}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 1024px) 50vw, 280px"
          />
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <h3 className="text-base font-bold tracking-wide text-[#001a3d] uppercase group-hover:text-[#c88e4a]">
            {product.name}
          </h3>
          <div className="mt-2 h-0.5 w-10 bg-[#c88e4a]" aria-hidden />
          {detail ? (
            <ul className="mt-3 space-y-1">
              {detail.specs.slice(0, 4).map((spec) => (
                <li key={spec.label} className="text-xs text-[#666666]">
                  <span className="text-[#444444]">{spec.label}:</span> {spec.value}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 line-clamp-2 text-sm text-[#666666]">{product.overview}</p>
          )}
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#c88e4a]">
            View details <span aria-hidden>→</span>
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

export function RiceCategoryProductGrid({
  products,
  categorySlug,
}: {
  products: CatalogProduct[];
  categorySlug: string;
}) {
  const subcategoryOrder = (Object.keys(RICE_SUBCATEGORIES) as RiceSubcategoryId[]).sort(
    (a, b) => RICE_SUBCATEGORIES[a].order - RICE_SUBCATEGORIES[b].order,
  );

  const grouped = subcategoryOrder.map((id) => ({
    id,
    meta: RICE_SUBCATEGORIES[id],
    products: products.filter((p) => getRiceProductDetail(p.slug)?.subcategory === id),
  }));

  return (
    <div className="space-y-16">
      {grouped.map((group) =>
        group.products.length === 0 ? null : (
          <div key={group.id} id={`rice-${group.id}`} className="scroll-mt-24">
            <Reveal>
              <h2 className="text-xl font-semibold text-[#001a3d] sm:text-2xl">{group.meta.title}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#666666]">
                {group.meta.description}
              </p>
            </Reveal>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {group.products.map((product, i) => (
                <RiceProductCard
                  key={product.slug}
                  product={product}
                  categorySlug={categorySlug}
                  index={i}
                />
              ))}
            </div>
          </div>
        ),
      )}
    </div>
  );
}

export function RiceCategorySections() {
  const cat = RICE_CATEGORY;

  return (
    <section className="border-b border-[#d5d0c8] bg-white py-10 lg:py-12">
      <div className="container-page">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(RICE_SUBCATEGORIES) as RiceSubcategoryId[])
            .sort((a, b) => RICE_SUBCATEGORIES[a].order - RICE_SUBCATEGORIES[b].order)
            .map((id) => (
              <a
                key={id}
                href={`#rice-${id}`}
                className="rounded-full border border-[#d5d0c8] bg-[#f9f8f5] px-4 py-2 text-sm font-medium text-[#001a3d] transition hover:border-[#c88e4a] hover:text-[#c88e4a]"
              >
                {RICE_SUBCATEGORIES[id].title}
              </a>
            ))}
        </div>
        <p className="mt-6 text-xs leading-relaxed text-[#777777]">{cat.disclaimer}</p>
      </div>
    </section>
  );
}
