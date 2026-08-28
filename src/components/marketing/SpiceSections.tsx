import Image from "next/image";
import { SPICES_CATEGORY, type SpiceProductDetail } from "@/lib/content/spice-product-content";

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

export function SpiceProductDetailSections({ product }: { product: SpiceProductDetail }) {
  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="container-page">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#c88e4a] uppercase">{product.grade}</p>
        <h2 className="mt-2 text-2xl font-semibold text-[#001a3d]">{product.subtitle}</h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#555555]">{product.description}</p>
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <DetailList title="Typical applications" items={product.applications} />
          <DetailList title="Product characteristics" items={product.characteristics} />
        </div>
        <div className="mt-10 rounded-lg border border-[#d5d0c8] bg-[#f9f8f5] p-6">
          <h3 className="text-sm font-semibold text-[#001a3d]">Packaging options</h3>
          <p className="mt-3 text-sm text-[#555555]">{product.packaging.join(" • ")}</p>
          {product.note ? (
            <p className="mt-4 text-xs leading-relaxed text-[#777777]">{product.note}</p>
          ) : null}
        </div>
        {product.images && product.images.length > 0 ? (
          <div className="mt-10">
            <h3 className="text-sm font-semibold text-[#001a3d]">Product gallery</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {product.images.map((image) => (
                <div
                  key={image.src}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#d5d0c8] bg-[#e4e0d8]"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function SpicesCategorySections() {
  const cat = SPICES_CATEGORY;

  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="container-page">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#c88e4a] uppercase">{cat.eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold text-[#001a3d] sm:text-3xl">{cat.title}</h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#555555]">{cat.lead}</p>
        <p className="mt-4 text-sm font-medium text-[#001a3d]">Products in this category include:</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {cat.products.map((product) => (
            <span
              key={product}
              className="rounded-full border border-[#d5d0c8] bg-[#f9f8f5] px-3 py-1 text-sm text-[#444444]"
            >
              {product}
            </span>
          ))}
        </div>
        <p className="mt-6 text-xs leading-relaxed text-[#777777]">{cat.disclaimer}</p>
      </div>
    </section>
  );
}
