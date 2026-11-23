import { z } from "zod";

/** Accepts a YouTube link (watch, youtu.be, embed, shorts) or a bare 11-character video ID. Returns "" when invalid. */
export function parseYoutubeId(value: string): string {
  const v = value.trim();
  if (!v) return "";
  const fromLink = v.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{11})/);
  if (fromLink) return fromLink[1];
  return /^[A-Za-z0-9_-]{11}$/.test(v) ? v : "";
}

export const adminProductSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only."),
  name: z.string().trim().min(2).max(200),
  categoryId: z.string().trim().min(1),
  overview: z.string().trim().max(5000).optional().default(""),
  status: z
    .enum(["draft", "pending_verification", "published", "archived"])
    .default("draft"),
  availabilityText: z.string().trim().max(500).optional().default(""),
  originOptions: z.array(z.string().trim().max(200)).max(20).default([]),
  gradeSummary: z.string().trim().max(2000).optional().default(""),
  inspectionOptions: z.array(z.string().trim().max(200)).max(20).default([]),
  incotermOptions: z.array(z.string().trim().max(50)).max(20).default([]),
  minOrderText: z.string().trim().max(500).optional().default(""),
  internalPrice: z.string().trim().max(100).optional().default(""),
  image: z.string().trim().max(500).optional().default(""),
  /** "Label: value" lines shown to buyers in the order form. Saved as a new specification version. */
  specification: z.string().max(8000).optional(),
  /** Documents the bank requires at LC presentation for this product, one per line. */
  requiredDocuments: z.array(z.string().trim().min(1).max(300)).max(30).optional(),
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]{2,8}$/, "Use 2 to 8 letters or numbers, for example RSO.")
    .optional()
    .or(z.literal("")),
  hsCode: z.string().trim().max(30).optional().default(""),
  /** Long description for the public product page. Empty keeps the built-in text. */
  description: z.string().trim().max(5000).optional(),
  /** Bullet highlights for the public product page. Empty keeps the built-in list. */
  highlights: z.array(z.string().trim().min(1).max(300)).max(12).optional(),
  /** YouTube link or video ID for the public product page. Empty keeps the built-in video. */
  youtubeVideo: z
    .string()
    .trim()
    .max(300)
    .optional()
    .refine((v) => !v || parseYoutubeId(v) !== "", "Enter a YouTube link or the 11-character video ID."),
  /** Sections at the bottom of the product page. An empty list keeps the built-in sections. */
  contentBoxes: z
    .array(
      z.object({
        title: z.string().trim().min(1, "Each section needs a title.").max(200),
        body: z.string().trim().min(1, "Each section needs text.").max(3000),
      }),
    )
    .max(12)
    .optional(),
  /** Extra photos after the main image, in display order. */
  galleryImages: z.array(z.string().trim().min(1).max(500)).max(11).optional(),
  /** Packaging types offered for this product. When omitted the saved packaging is left unchanged. */
  packagingOptionIds: z.array(z.string().regex(/^[a-f0-9]{24}$/)).max(30).optional(),
  displayOrder: z.number().int().min(0).optional().default(0),
});

export type AdminProductInput = z.infer<typeof adminProductSchema>;

export function productInputToMongo(input: AdminProductInput) {
  return {
    slug: input.slug.toLowerCase(),
    name: input.name,
    categoryId: input.categoryId,
    overview: input.overview || undefined,
    status: input.status,
    availabilityText: input.availabilityText || undefined,
    originOptions: input.originOptions,
    gradeSummary: input.gradeSummary || undefined,
    inspectionOptions: input.inspectionOptions,
    incotermOptions: input.incotermOptions,
    minOrderText: input.minOrderText || undefined,
    internalPrice: input.internalPrice || undefined,
    ...(input.code ? { code: input.code } : {}),
    hsCode: input.hsCode || undefined,
    // The main image is first; the extra photos follow in the order the admin set. The admin form always
    // sends galleryImages, so an omitted list means "main image only".
    gallery: [input.image, ...(input.galleryImages ?? [])]
      .filter((src) => Boolean(src))
      .map((src, i) => ({ storageKey: src, alt: input.name, displayOrder: i })),
    // These are stored as given ("" or [] clears them) so the admin can go back to the built-in content.
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.highlights !== undefined ? { highlights: input.highlights } : {}),
    ...(input.contentBoxes !== undefined ? { contentBoxes: input.contentBoxes } : {}),
    ...(input.youtubeVideo !== undefined ? { youtubeVideoId: parseYoutubeId(input.youtubeVideo) } : {}),
    ...(input.packagingOptionIds !== undefined ? { packagingOptionIds: input.packagingOptionIds } : {}),
    displayOrder: input.displayOrder,
    deletedAt: null,
  };
}
