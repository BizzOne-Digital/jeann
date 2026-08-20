import type { MetadataRoute } from "next";
import { getCategories, SEED_INSIGHTS } from "@/lib/content/catalog";

const STATIC_PATHS = [
  "",
  "/about",
  "/contact",
  "/products",
  "/packaging",
  "/shipping",
  "/partners",
  "/inspections",
  "/resources",
  "/insights",
  "/faq",
  "/testimonials",
  "/team",
  "/booking",
  "/register/buyer",
  "/login",
  "/privacy",
  "/terms",
  "/cookies",
  "/buyer-terms",
  "/accessibility",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.APP_URL || "http://localhost:3000";
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = getCategories().flatMap((category) => [
    {
      url: `${base}/products/${category.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...category.products.map((product) => ({
      url: `${base}/products/${category.slug}/${product.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ]);

  const insightEntries: MetadataRoute.Sitemap = SEED_INSIGHTS.map((post) => ({
    url: `${base}/insights/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...productEntries, ...insightEntries];
}
