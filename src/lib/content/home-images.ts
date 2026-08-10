/** Local marketing images under public/images (png assets currently in repo). */
export function getHomeSectionImages() {
  return {
    home1: "/images/home-1.png",
    home2: "/images/home-2.png",
    home3: "/images/home-3.png",
  };
}

export function getCommodityProductImages() {
  return [1, 2, 3, 4, 5].map((n) => `/images/products/product-${n}.png`);
}
