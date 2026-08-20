import { z } from "zod";

export const adminTeamSchema = z.object({
  name: z.string().trim().min(2).max(200),
  roleTitle: z.string().trim().min(2).max(200),
  bio: z.string().trim().max(3000).optional().default(""),
  photo: z.string().trim().max(500).optional().default(""),
  displayOrder: z.number().int().min(0).optional().default(0),
  status: z.enum(["published", "unpublished"]).default("unpublished"),
});
