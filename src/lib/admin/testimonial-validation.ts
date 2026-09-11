import { z } from "zod";

export const adminTestimonialSchema = z.object({
  quote: z.string().trim().min(10).max(2000),
  name: z.string().trim().min(2).max(120),
  position: z.string().trim().min(2).max(200),
  company: z.string().trim().max(200).optional().default(""),
  photo: z.string().trim().max(500).optional().default(""),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  reviewedAt: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
  status: z.enum(["published", "unpublished"]).default("unpublished"),
  isPlaceholder: z.boolean().optional().default(false),
});

export type AdminTestimonialInput = z.infer<typeof adminTestimonialSchema>;
