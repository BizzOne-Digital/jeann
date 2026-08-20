import type { PageSection } from "@/models/Page";
import {
  getRegistryPage,
  listRegistryPages,
  type EditablePage,
  type PageRegistryEntry,
  type PageSectionDef,
} from "@/lib/content/page-registry";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";

export type { EditablePage, PageSectionDef } from "@/lib/content/page-registry";

type StoredSectionPayload = {
  id: string;
  label: string;
  fields: Record<string, string>;
};

function encodeSections(sections: PageSectionDef[]): PageSection[] {
  return sections.map((section) => ({
    type: "richText" as const,
    content: JSON.stringify({
      id: section.id,
      label: section.label,
      fields: section.defaults,
    } satisfies StoredSectionPayload),
  }));
}

function decodeSections(blocks: PageSection[], registry: PageRegistryEntry): PageSectionDef[] {
  const parsed = new Map<string, Record<string, string>>();

  for (const block of blocks) {
    if (block.type !== "richText" || !block.content) continue;
    try {
      const data = JSON.parse(block.content) as StoredSectionPayload;
      if (data.id && data.fields) parsed.set(data.id, data.fields);
    } catch {
      // ignore invalid blocks
    }
  }

  return registry.sections.map((section) => ({
    ...section,
    defaults: {
      ...section.defaults,
      ...(parsed.get(section.id) ?? {}),
    },
  }));
}

function mergePage(registry: PageRegistryEntry, stored?: {
  title?: string;
  sections?: PageSection[];
  seo?: { title?: string; description?: string };
  status?: "draft" | "published" | "archived";
}): EditablePage {
  return {
    slug: registry.slug,
    title: stored?.title ?? registry.title,
    path: registry.path,
    seoTitle: stored?.seo?.title ?? registry.seoTitle,
    seoDescription: stored?.seo?.description ?? registry.seoDescription,
    status: stored?.status ?? "published",
    sections: stored?.sections?.length
      ? decodeSections(stored.sections, registry)
      : registry.sections,
  };
}

export async function listEditablePages(): Promise<EditablePage[]> {
  const registry = listRegistryPages();
  if (!isMongoConfigured() || !(await tryConnectMongo())) {
    return registry.map((entry) => mergePage(entry));
  }

  const { Page } = await import("@/models");
  const docs = await Page.find({ locale: "en" }).lean();
  const bySlug = new Map(docs.map((doc) => [doc.slug, doc]));

  return registry.map((entry) => mergePage(entry, bySlug.get(entry.slug)));
}

export async function getEditablePage(slug: string): Promise<EditablePage | null> {
  const registry = getRegistryPage(slug);
  if (!registry) return null;

  if (!isMongoConfigured() || !(await tryConnectMongo())) {
    return mergePage(registry);
  }

  const { Page } = await import("@/models");
  const doc = await Page.findOne({ slug, locale: "en" }).lean();
  return mergePage(registry, doc ?? undefined);
}

/** Public site: returns published CMS content only. */
export async function getPublishedPage(slug: string): Promise<EditablePage | null> {
  const page = await getEditablePage(slug);
  if (!page || page.status !== "published") {
    const registry = getRegistryPage(slug);
    return registry ? mergePage(registry) : null;
  }
  return page;
}

export function getSectionFields(
  page: EditablePage | null | undefined,
  sectionId: string,
): Record<string, string> {
  return page?.sections.find((s) => s.id === sectionId)?.defaults ?? {};
}

export { cmsField } from "@/lib/content/cms-field";

export async function saveEditablePage(input: {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  status: "draft" | "published" | "archived";
  sections: Array<{ id: string; fields: Record<string, string> }>;
}): Promise<EditablePage | null> {
  const registry = getRegistryPage(input.slug);
  if (!registry) return null;

  const mergedSections = registry.sections.map((section) => {
    const submitted = input.sections.find((s) => s.id === section.id);
    return {
      ...section,
      defaults: {
        ...section.defaults,
        ...(submitted?.fields ?? {}),
      },
    };
  });

  if (!isMongoConfigured() || !(await tryConnectMongo())) {
    throw new Error("Database unavailable");
  }

  const { Page } = await import("@/models");
  await Page.findOneAndUpdate(
    { slug: input.slug, locale: "en" },
    {
      slug: input.slug,
      locale: "en",
      title: input.title,
      status: input.status,
      seo: { title: input.seoTitle, description: input.seoDescription },
      sections: encodeSections(mergedSections),
    },
    { upsert: true, new: true },
  );

  return getEditablePage(input.slug);
}

export async function seedPagesFromRegistry(): Promise<number> {
  if (!isMongoConfigured() || !(await tryConnectMongo())) return 0;

  const { Page } = await import("@/models");
  let count = 0;
  for (const entry of listRegistryPages()) {
    const existing = await Page.findOne({ slug: entry.slug, locale: "en" }).lean();
    if (existing) continue;
    await Page.create({
      slug: entry.slug,
      locale: "en",
      title: entry.title,
      status: "published",
      seo: { title: entry.seoTitle, description: entry.seoDescription },
      sections: encodeSections(entry.sections),
    });
    count += 1;
  }
  return count;
}
