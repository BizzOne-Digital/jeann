import {
  SEED_CATEGORIES,
  SITE,
  type SeedCategory,
  type SeedProduct,
} from "./seed-catalog";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";

/** Legacy Mongo-only catalogue rows replaced by canonical seed slugs. */
export const DEPRECATED_PRODUCT_SLUGS = new Set([
  "cashews-and-nuts",
  "cinnamon",
  "seed",
]);

function isPublicProductStatus(status: string): boolean {
  return status === "published" || status === "pending_verification";
}

function mongoProductToSeed(
  product: {
    slug: string;
    name: string;
    overview?: string;
    status: string;
    availabilityText?: string;
    originOptions?: string[];
    gradeSummary?: string;
    inspectionOptions?: string[];
    incotermOptions?: string[];
    minOrderText?: string;
    gallery?: { storageKey: string }[];
  },
  seedFallback?: SeedProduct,
): SeedProduct | null {
  if (!isPublicProductStatus(product.status)) return null;

  const image = seedFallback?.image || product.gallery?.[0]?.storageKey;

  return {
    slug: product.slug,
    name: product.name,
    overview: product.overview ?? seedFallback?.overview ?? "",
    description: seedFallback?.description,
    availabilityText: product.availabilityText ?? seedFallback?.availabilityText ?? "",
    originOptions: product.originOptions?.length
      ? product.originOptions
      : (seedFallback?.originOptions ?? []),
    gradeSummary: product.gradeSummary ?? seedFallback?.gradeSummary ?? "",
    packaging: seedFallback?.packaging ?? [],
    inspectionOptions: product.inspectionOptions?.length
      ? product.inspectionOptions
      : (seedFallback?.inspectionOptions ?? []),
    incotermOptions: product.incotermOptions?.length
      ? product.incotermOptions
      : (seedFallback?.incotermOptions ?? []),
    documentCategories: seedFallback?.documentCategories ?? [],
    minOrderText: product.minOrderText ?? seedFallback?.minOrderText ?? "",
    status: product.status as SeedProduct["status"],
    image,
    youtubeVideoId: seedFallback?.youtubeVideoId,
    highlights: seedFallback?.highlights,
  };
}

export async function getMergedCategories(): Promise<SeedCategory[]> {
  if (!isMongoConfigured()) return SEED_CATEGORIES;
  const conn = await tryConnectMongo();
  if (!conn) return SEED_CATEGORIES;

  const { Product, ProductCategory } = await import("@/models");
  const [mongoCategories, mongoProducts] = await Promise.all([
    ProductCategory.find({ deletedAt: null, status: "published" })
      .sort({ displayOrder: 1 })
      .lean(),
    Product.find({ deletedAt: null }).sort({ displayOrder: 1 }).lean(),
  ]);

  if (mongoCategories.length === 0) return SEED_CATEGORIES;

  const categoryById = new Map(mongoCategories.map((c) => [String(c._id), c]));
  const productsByCategorySlug = new Map<string, typeof mongoProducts>();

  for (const product of mongoProducts) {
    const category = categoryById.get(String(product.categoryId));
    if (!category) continue;
    const list = productsByCategorySlug.get(category.slug) ?? [];
    list.push(product);
    productsByCategorySlug.set(category.slug, list);
  }

  return SEED_CATEGORIES.map((seedCategory) => {
    const mongoCategory = mongoCategories.find((c) => c.slug === seedCategory.slug);
    const mongoForCategory = productsByCategorySlug.get(seedCategory.slug) ?? [];
    const seedBySlug = new Map(seedCategory.products.map((p) => [p.slug, p]));

    const mergedProducts: SeedProduct[] = [];
    const seen = new Set<string>();

    for (const seedProduct of seedCategory.products) {
      const mongoProduct = mongoForCategory.find((p) => p.slug === seedProduct.slug);
      if (mongoProduct) {
        const merged = mongoProductToSeed(mongoProduct, seedProduct);
        if (merged) {
          mergedProducts.push(merged);
          seen.add(seedProduct.slug);
        }
      } else {
        mergedProducts.push(seedProduct);
        seen.add(seedProduct.slug);
      }
    }

    for (const mongoProduct of mongoForCategory) {
      if (seen.has(mongoProduct.slug)) continue;
      if (DEPRECATED_PRODUCT_SLUGS.has(mongoProduct.slug)) continue;
      const merged = mongoProductToSeed(mongoProduct);
      if (merged) mergedProducts.push(merged);
    }

    return {
      slug: seedCategory.slug,
      name: mongoCategory?.name ?? seedCategory.name,
      summary: mongoCategory?.summary ?? seedCategory.summary,
      products: mergedProducts,
    };
  });
}

export async function getMergedSite() {
  if (!isMongoConfigured()) return SITE;
  const conn = await tryConnectMongo();
  if (!conn) return SITE;

  const { SiteSettings } = await import("@/models");
  const { SITE_SETTINGS_KEY } = await import("@/models/SiteSettings");
  const doc = await SiteSettings.findOne({ key: SITE_SETTINGS_KEY }).lean();
  if (!doc) return SITE;

  return {
    name: doc.companyName || SITE.name,
    headline: SITE.headline,
    email: doc.email || SITE.email,
    phone: doc.phone || SITE.phone,
    phoneDisplay: doc.phone || SITE.phoneDisplay,
    addressLine1: doc.address?.line1 || SITE.addressLine1,
    addressLine2: [doc.address?.city, doc.address?.country].filter(Boolean).join(", ") || SITE.addressLine2,
    positioning: SITE.positioning,
  };
}

export async function getCategoryCoverFromDb(slug: string): Promise<string | null> {
  if (!isMongoConfigured()) return null;
  const conn = await tryConnectMongo();
  if (!conn) return null;

  const { ProductCategory } = await import("@/models");
  const doc = await ProductCategory.findOne({ slug, deletedAt: null, status: "published" }).lean();
  return doc?.coverImage ?? null;
}
