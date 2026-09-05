import { COFFEE_CATEGORY } from "@/lib/content/coffee-product-content";

export function CoffeeCategorySections() {
  const cat = COFFEE_CATEGORY;

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
