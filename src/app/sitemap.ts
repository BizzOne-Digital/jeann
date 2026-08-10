import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.APP_URL || "http://localhost:3000";
  return ["", "/about", "/contact", "/products", "/request-quote", "/trade-offer"].map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: "weekly", priority: path ? 0.7 : 1 }));
}
