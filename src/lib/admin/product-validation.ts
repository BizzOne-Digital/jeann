import { z } from "zod";

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
  image: z.string().trim().max(500).optional().default(""),
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
    gallery: input.image
      ? [{ storageKey: input.image, alt: input.name, displayOrder: 0 }]
      : [],
    displayOrder: input.displayOrder,
    deletedAt: null,
  };
}
