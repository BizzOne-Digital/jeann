/** Local marketing images under public/images (png assets currently in repo). */
import { HOME_PAGE_ONLY_IMAGES } from "@/lib/content/home-page-images";

export function getHomeSectionImages() {
  return {
    home1: "/images/home-1.png",
    home2: "/images/home-2.png",
    home3: HOME_PAGE_ONLY_IMAGES.sourcedSection.src,
  };
}

export function getCommodityProductImages() {
  return [1, 2, 3, 4, 5].map((n) => `/images/products/product-${n}.png`);
}

/** Home insights row only — not reused on `/insights` or article pages. */
export const HOME_INSIGHTS_CARD_IMAGES = [
  {
    src: "/images/products/sugar/icumsa-45-white-sugar-3.png",
    alt: "Refined white sugar — home insights teaser",
  },
  {
    src: "/images/products/rice/jasmine-rice.jpg",
    alt: "Jasmine rice — home insights teaser",
  },
  {
    src: "/images/products/beans/beans-variety-bowls.png",
    alt: "Dry bean varieties — home insights teaser",
  },
] as const;
