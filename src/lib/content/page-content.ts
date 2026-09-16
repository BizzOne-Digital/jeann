import type { PageSection } from "@/models/Page";
import { cmsField } from "@/lib/content/cms-field";
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
  const payload: StoredSectionPayload[] = sections.map((section) => ({
    id: section.id,
    label: section.label,
    fields: section.defaults,
  }));
  return [
    {
      type: "richText" as const,
      content: JSON.stringify(payload),
    },
  ];
}

function decodeSections(blocks: PageSection[], registry: PageRegistryEntry): PageSectionDef[] {
  const parsed = new Map<string, Record<string, string>>();

  for (const block of blocks) {
    const content = "content" in block ? block.content : undefined;
    if (!content) continue;
    try {
      const data = JSON.parse(content) as StoredSectionPayload | StoredSectionPayload[];
      if (Array.isArray(data)) {
        for (const item of data) {
          if (item?.id && item.fields) parsed.set(item.id, item.fields);
        }
        continue;
      }
      if (data.id && data.fields) parsed.set(data.id, data.fields);
    } catch {
      // ignore invalid blocks
    }
  }

  return registry.sections.map((section) => ({
    ...section,
    defaults: mergeStoredSectionFields(section.defaults, parsed.get(section.id)),
  }));
}

/** Ignore blank stored values so registry defaults stay what the live site shows. */
function mergeStoredSectionFields(
  registryDefaults: Record<string, string>,
  stored?: Record<string, string>,
): Record<string, string> {
  const merged = { ...registryDefaults };
  if (!stored) return merged;
  for (const [key, value] of Object.entries(stored)) {
    const trimmed = value?.trim();
    if (trimmed) merged[key] = trimmed;
  }
  return merged;
}

/** Values as rendered on the public site (same rules as `cmsField` + registry fallbacks). */
function displaySectionDefaults(
  registrySection: PageSectionDef,
  mergedFields: Record<string, string>,
): Record<string, string> {
  const keys = new Set([
    ...Object.keys(registrySection.defaults),
    ...Object.keys(mergedFields),
  ]);
  const out: Record<string, string> = {};
  for (const key of keys) {
    const fallback = registrySection.defaults[key] ?? "";
    out[key] = cmsField(mergedFields, key, fallback);
  }
  return out;
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

/**
 * Admin editor: section fields match what visitors see on the live site; status/SEO/title
 * still reflect the saved document so you can publish or revise.
 */
export async function getAdminPageForEditor(slug: string): Promise<EditablePage | null> {
  const registry = getRegistryPage(slug);
  if (!registry) return null;

  const live = await getPublishedPage(slug);
  const stored = await getEditablePage(slug);
  const base = live ?? (stored ?? mergePage(registry));

  const registryBySection = new Map(registry.sections.map((s) => [s.id, s]));

  return {
    ...base,
    title: stored?.title ?? base.title,
    seoTitle: stored?.seoTitle ?? base.seoTitle,
    seoDescription: stored?.seoDescription ?? base.seoDescription,
    status: stored?.status ?? base.status,
    sections: base.sections.map((section) => {
      const reg = registryBySection.get(section.id) ?? section;
      return {
        ...section,
        defaults: displaySectionDefaults(reg, section.defaults),
      };
    }),
  };
}

export function getSectionFields(
  page: EditablePage | null | undefined,
  sectionId: string,
): Record<string, string> {
  return page?.sections.find((s) => s.id === sectionId)?.defaults ?? {};
}

/** Section fields as shown on the live site (registry fallbacks when CMS value is blank). */
export function getEffectiveSectionFields(
  page: EditablePage | null | undefined,
  sectionId: string,
): Record<string, string> {
  const slug = page?.slug;
  const registrySection = slug
    ? getRegistryPage(slug)?.sections.find((s) => s.id === sectionId)
    : undefined;
  const merged = getSectionFields(page, sectionId);
  if (!registrySection) return merged;
  return displaySectionDefaults(registrySection, merged);
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

  return getAdminPageForEditor(input.slug);
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

/** Overwrite CMS page copy from the in-repo registry (run after messaging updates). */
export async function refreshMarketingPagesFromRegistry(): Promise<number> {
  if (!isMongoConfigured() || !(await tryConnectMongo())) return 0;

  const { Page } = await import("@/models");
  let count = 0;
  for (const entry of listRegistryPages()) {
    await Page.findOneAndUpdate(
      { slug: entry.slug, locale: "en" },
      {
        slug: entry.slug,
        locale: "en",
        title: entry.title,
        status: "published",
        seo: { title: entry.seoTitle, description: entry.seoDescription },
        sections: encodeSections(entry.sections),
      },
      { upsert: true },
    );
    count += 1;
  }
  return count;
}
