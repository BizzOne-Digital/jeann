import { z } from "zod";

export const adminFaqSchema = z.object({
  question: z.string().trim().min(5).max(500),
  answer: z.string().trim().min(10).max(5000),
  category: z.string().trim().max(120).optional().default("General"),
  displayOrder: z.number().int().min(0).optional().default(0),
  status: z.enum(["published", "unpublished"]).default("published"),
});

export type AdminFaqInput = z.infer<typeof adminFaqSchema>;
