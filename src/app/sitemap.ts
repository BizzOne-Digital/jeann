import type { MetadataRoute } from "next";

const MARKETING_PATHS = [
  "",
  "/about",
  "/contact",
  "/products",
  "/packaging",
  "/shipping",
  "/inspections",
  "/resources",
  "/insights",
  "/faq",
  "/testimonials",
  "/register/buyer",
  "/login",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.APP_URL || "http://localhost:3000";
  return MARKETING_PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
