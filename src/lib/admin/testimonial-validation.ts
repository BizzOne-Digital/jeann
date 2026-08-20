import { z } from "zod";

export const adminTestimonialSchema = z.object({
  quote: z.string().trim().min(10).max(2000),
  attribution: z.string().trim().min(2).max(200),
  company: z.string().trim().max(200).optional().default(""),
  status: z.enum(["published", "unpublished"]).default("unpublished"),
  isPlaceholder: z.boolean().optional().default(false),
});

export type AdminTestimonialInput = z.infer<typeof adminTestimonialSchema>;
