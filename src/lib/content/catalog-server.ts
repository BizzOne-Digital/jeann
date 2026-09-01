import type { SeedCategory, SeedProduct } from "./seed-catalog";
import { getMergedCategories } from "./products-catalog";
import { getPublicSiteSettings } from "./site-settings-public";

export async function getPublicSite() {
  const settings = await getPublicSiteSettings();
  return settings;
}

export { getPublicSiteSettings };

export async function getPublicCategories(): Promise<SeedCategory[]> {
  return getMergedCategories();
}

export async function getPublicCategory(slug: string): Promise<SeedCategory | undefined> {
  const categories = await getMergedCategories();
  return categories.find((c) => c.slug === slug);
}

export async function getPublicProduct(
  categorySlug: string,
  productSlug: string,
): Promise<{ category: SeedCategory; product: SeedProduct } | undefined> {
  const category = await getPublicCategory(categorySlug);
  if (!category) return undefined;
  const product = category.products.find((p) => p.slug === productSlug);
  if (!product) return undefined;
  return { category, product };
}

export async function getAllPublicProducts(): Promise<
  Array<SeedProduct & { categorySlug: string; categoryName: string }>
> {
  const categories = await getMergedCategories();
  return categories.flatMap((c) =>
    c.products.map((p) => ({ ...p, categorySlug: c.slug, categoryName: c.name })),
  );
}
