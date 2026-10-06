import { resolveImageSrc } from "@/lib/media/resolve-image-src";
import { SUGAR_CATEGORY_COVER_IMAGE } from "@/lib/content/sugar-product-content";

/** Category and product listing images from client photo folders. */

export const CATEGORY_COVERS: Record<string, { image: string; shortName: string; alt: string }> = {
  "edible-oils": {
    shortName: "Edible Oils",
    image: "/images/products/oils/refined-sunflower-product.png",
    alt: "Refined sunflower oil",
  },
  sugar: {
    shortName: "Sugar",
    image: SUGAR_CATEGORY_COVER_IMAGE,
    alt: "Refined sugar in bulk export warehouse",
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
  coffee: {
    shortName: "Coffee",
    image: "/images/products/coffee/dry-coffee-beans-hero.png",
    alt: "Dry coffee beans — dark dried export grade",
  },
  spices: {
    shortName: "Spices",
    image: "/images/products/spices/spices-category-hero.png",
    alt: "Assorted bulk spices for export programmes",
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
