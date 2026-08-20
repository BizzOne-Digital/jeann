import type { ProductCategoryLean, ProductLean } from "@/models";

export type AdminProductItem = {
  _id: string;
  slug: string;
  name: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  overview: string;
  status: string;
  availabilityText: string;
  originOptions: string[];
  gradeSummary: string;
  inspectionOptions: string[];
  incotermOptions: string[];
  minOrderText: string;
  image: string;
  displayOrder: number;
};

export type AdminCategoryOption = {
  _id: string;
  slug: string;
  name: string;
};

export function serializeProduct(
  product: ProductLean,
  category?: ProductCategoryLean | null,
): AdminProductItem {
  return {
    _id: String(product._id),
    slug: product.slug,
    name: product.name,
    categoryId: String(product.categoryId),
    categorySlug: category?.slug ?? "",
    categoryName: category?.name ?? "Unknown category",
    overview: product.overview ?? "",
    status: product.status,
    availabilityText: product.availabilityText ?? "",
    originOptions: product.originOptions ?? [],
    gradeSummary: product.gradeSummary ?? "",
    inspectionOptions: product.inspectionOptions ?? [],
    incotermOptions: product.incotermOptions ?? [],
    minOrderText: product.minOrderText ?? "",
    image: product.gallery?.[0]?.storageKey ?? "",
    displayOrder: product.displayOrder ?? 0,
  };
}

export function serializeCategory(category: ProductCategoryLean): AdminCategoryOption {
  return {
    _id: String(category._id),
    slug: category.slug,
    name: category.name,
  };
}
