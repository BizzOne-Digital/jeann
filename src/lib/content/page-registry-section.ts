export type PageFieldType = "text" | "textarea" | "url" | "image";

export type PageFieldDef = {
  key: string;
  label: string;
  type: PageFieldType;
};

export type PageSectionDef = {
  id: string;
  label: string;
  fields: PageFieldDef[];
  defaults: Record<string, string>;
};

export type PageRegistryEntry = {
  slug: string;
  title: string;
  path: string;
  seoTitle: string;
  seoDescription: string;
  sections: PageSectionDef[];
};

export type EditablePage = {
  slug: string;
  title: string;
  path: string;
  seoTitle: string;
  seoDescription: string;
  status: "draft" | "published" | "archived";
  sections: PageSectionDef[];
};

export function buildPageSection(
  id: string,
  label: string,
  defaultsIn: Record<string, string>,
): PageSectionDef {
  const defaults =
    id === "hero"
      ? {
          heroImage: "",
          youtubeVideoId: "",
          ...defaultsIn,
        }
      : defaultsIn;

  const fields: PageFieldDef[] = Object.keys(defaults).map((key) => ({
    key,
    label: key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (c) => c.toUpperCase())
      .replace(/Cta/g, "CTA")
      .replace(/Hero image/i, "Hero background image")
      .replace(/Youtube video id/i, "YouTube video link or ID")
      .replace(/([0-9]+)/g, " $1")
      .trim(),
    type:
      /image|photo|heroImage|thumbnail|cover/i.test(key)
        ? "image"
        : /youtube/i.test(key)
          ? "url"
          : key.includes("description") ||
              key.includes("body") ||
              key.includes("note") ||
              key.includes("lead") ||
              key.includes("content") ||
              key.includes("paragraph") ||
              key.includes("items") ||
              key.includes("points") ||
              key.includes("bullets")
            ? "textarea"
            : key.includes("Href") || key === "path"
              ? "url"
              : "text",
  }));
  return { id, label, fields, defaults };
}

export function joinLines(items: string[]): string {
  return items.join("\n");
}

export function joinParagraphs(items: string[]): string {
  return items.join("\n\n");
}
