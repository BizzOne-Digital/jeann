import { resolveImageSrc } from "@/lib/media/resolve-image-src";

/** Category and product listing images from client photo folders. */

export const CATEGORY_COVERS: Record<string, { image: string; shortName: string; alt: string }> = {
  "edible-oils": {
    shortName: "Edible Oils",
    image: "/images/products/oils/refined-sunflower-product.png",
    alt: "Refined sunflower oil",
  },
  sugar: {
    shortName: "Sugar",
    image: "/images/products/sugar/icumsa-45-white-sugar-3.png",
    alt: "Refined white sugar",
  },
  "rice-and-grains": {
    shortName: "Rice & Grains",
    image: "/images/products/rice/long-grain-bag.png",
    alt: "Long-grain rice in export bags",
  },
  "beans-and-pulses": {
    shortName: "Beans",
    image: "/images/products/beans/beans-category-cover.jpg",
    alt: "Assorted dry bean varieties including pinto, kidney, and speckled grades",
  },
  "other-commodities": {
    shortName: "Coffee & Spices",
    image: "/images/products/coffee/fresh-coffee-harvest.png",
    alt: "Fresh coffee harvest",
  },
};

export function getCategoryCover(slug: string) {
  return (
    CATEGORY_COVERS[slug] ?? {
      shortName: slug,
      image: "/images/products/oils/refined-sunflower-product.png",
      alt: "Agricultural commodity",
    }
  );
}

export function getProductListingImage(
  product: { image?: string },
  categorySlug: string,
): string {
  if (product.image) return resolveImageSrc(product.image);
  return resolveImageSrc(getCategoryCover(categorySlug).image);
}
