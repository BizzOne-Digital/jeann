import { revalidatePath } from "next/cache";
import { getRegistryPage } from "@/lib/content/page-registry";

/** Bust cached HTML for one public URL (and the marketing layout when needed). */
export function revalidateMarketingPath(path: string, options?: { includeHome?: boolean }): void {
  if (!path) return;
  revalidatePath(path, "page");
  if (options?.includeHome && path !== "/") {
    revalidatePath("/", "page");
  }
}

/** Footer, header, and other global settings appear on every marketing page. */
export function revalidateMarketingSite(): void {
  revalidatePath("/", "layout");
}

/** Bust static cache for a CMS registry page after save. */
export function revalidateMarketingPage(slug: string): void {
  const entry = getRegistryPage(slug);
  if (!entry?.path) return;
  const includeHome = slug === "home" || slug === "testimonials";
  revalidateMarketingPath(entry.path, { includeHome });
}

export function revalidateTestimonialsPublic(): void {
  revalidateMarketingPath("/testimonials", { includeHome: true });
}

export function revalidateFaqPublic(): void {
  revalidateMarketingPath("/faq");
}

export function revalidateProductCatalog(categorySlug: string, productSlug?: string): void {
  revalidateMarketingPath("/products");
  if (categorySlug) {
    revalidateMarketingPath(`/products/${categorySlug}`);
    if (productSlug) {
      revalidateMarketingPath(`/products/${categorySlug}/${productSlug}`);
    }
  }
  revalidateMarketingPath("/");
}
