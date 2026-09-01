import type { SeedProduct } from "./seed-catalog";

export type CatalogProduct = SeedProduct & { categorySlug: string; categoryName: string };

export function searchCatalogProducts(
  products: CatalogProduct[],
  query: string,
  categorySlug?: string,
) {
  const q = query.trim().toLowerCase();
  return products.filter((p) => {
    if (categorySlug && p.categorySlug !== categorySlug) return false;
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.overview.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q)
    );
  });
}
