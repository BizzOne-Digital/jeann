/** Category cover images from public/images/products (product-1 … product-5). */
export const CATEGORY_COVERS: Record<string, { image: string; shortName: string; alt: string }> = {
  "edible-oils": {
    shortName: "Edible Oils",
    image: "/images/products/product-1.png",
    alt: "Edible oils commodity",
  },
  sugar: {
    shortName: "Sugar",
    image: "/images/products/product-2.png",
    alt: "Sugar commodity",
  },
  "rice-and-grains": {
    shortName: "Rice & Grains",
    image: "/images/products/product-3.png",
    alt: "Rice and grains commodity",
  },
  "beans-and-pulses": {
    shortName: "Beans & Pulses",
    image: "/images/products/product-4.png",
    alt: "Beans and pulses commodity",
  },
  "other-commodities": {
    shortName: "Coffee & Spices",
    image: "/images/products/product-5.png",
    alt: "Coffee, nuts, and spices",
  },
};

export function getCategoryCover(slug: string) {
  return (
    CATEGORY_COVERS[slug] ?? {
      shortName: slug,
      image: "/images/products/product-1.png",
      alt: "Agricultural commodity",
    }
  );
}
