import { resolveImageSrc } from "@/lib/media/resolve-image-src";
import { AGRICULTURE_IMAGES } from "@/lib/content/agriculture-images";

/** Category and product listing images from client photo folders. */

export const CATEGORY_COVERS: Record<string, { image: string; shortName: string; alt: string }> = {
  "edible-oils": {
    shortName: "Edible Oils",
    image: AGRICULTURE_IMAGES.tractorPlowing.src,
    alt: AGRICULTURE_IMAGES.tractorPlowing.alt,
  },
  sugar: {
    shortName: "Sugar",
    image: AGRICULTURE_IMAGES.combineHarvest.src,
    alt: AGRICULTURE_IMAGES.combineHarvest.alt,
  },
  "rice-and-grains": {
    shortName: "Rice & Grains",
    image: AGRICULTURE_IMAGES.riceTerraces.src,
    alt: AGRICULTURE_IMAGES.riceTerraces.alt,
  },
  "beans-and-pulses": {
    shortName: "Beans",
    image: AGRICULTURE_IMAGES.greenGrainField.src,
    alt: AGRICULTURE_IMAGES.greenGrainField.alt,
  },
  coffee: {
    shortName: "Coffee",
    image: AGRICULTURE_IMAGES.teaPlantation.src,
    alt: "Coffee and plantation crops at origin",
  },
  spices: {
    shortName: "Spices",
    image: AGRICULTURE_IMAGES.teaPlantation.src,
    alt: AGRICULTURE_IMAGES.teaPlantation.alt,
  },
};

export function getCategoryCover(slug: string) {
  return (
    CATEGORY_COVERS[slug] ?? {
      shortName: slug,
      image: AGRICULTURE_IMAGES.greenGrainField.src,
      alt: AGRICULTURE_IMAGES.greenGrainField.alt,
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
