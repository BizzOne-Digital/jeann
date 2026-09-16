import { revalidatePath } from "next/cache";
import { getRegistryPage } from "@/lib/content/page-registry";

/** Bust static cache for a marketing page after CMS save. */
export function revalidateMarketingPage(slug: string): void {
  const entry = getRegistryPage(slug);
  if (!entry?.path) return;
  revalidatePath(entry.path);
}
