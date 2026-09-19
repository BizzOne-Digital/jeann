import type { Metadata } from "next";
import { getPublishedPage } from "@/lib/content/page-content";

export async function cmsPageMetadata(
  slug: string,
  fallback: { title: string; description: string },
): Promise<Metadata> {
  const page = await getPublishedPage(slug);
  const title = page?.seoTitle?.trim() || fallback.title;
  const description = page?.seoDescription?.trim() || fallback.description;
  return { title, description };
}
