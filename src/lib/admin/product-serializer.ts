import type { ProductCategoryLean, ProductLean } from "@/models";
import { getBuiltInContentBoxes } from "@/lib/content/product-content-boxes";

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
  internalPrice: string;
  image: string;
  /** Photos after the main image. */
  galleryImages: string[];
  description: string;
  highlights: string[];
  youtubeVideoId: string;
  packagingOptionIds: string[];
  /** Sections saved by an admin (empty when the built-in sections are in use). */
  contentBoxes: { title: string; body: string }[];
  /** The sections live on the product page by default, shown so the admin can read and edit them. */
  builtInContentBoxes: { title: string; body: string }[];
  code: string;
  hsCode: string;
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
    internalPrice: product.internalPrice ?? "",
    image: product.gallery?.[0]?.storageKey ?? "",
    galleryImages: (product.gallery ?? []).slice(1).map((g) => g.storageKey),
    description: product.description ?? "",
    highlights: product.highlights ?? [],
    youtubeVideoId: product.youtubeVideoId ?? "",
    packagingOptionIds: (product.packagingOptionIds ?? []).map(String),
    contentBoxes: (product.contentBoxes ?? []).map((b) => ({ title: b.title, body: b.body })),
    builtInContentBoxes: getBuiltInContentBoxes(product.slug, product.name, category?.name ?? "").map((b) => ({
      title: b.title,
      body: b.body,
    })),
    code: product.code ?? "",
    hsCode: product.hsCode ?? "",
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
