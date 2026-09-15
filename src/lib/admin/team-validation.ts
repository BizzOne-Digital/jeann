import { z } from "zod";

export const adminTeamSchema = z
  .object({
    name: z.string().trim().min(2).max(200),
    roleTitle: z.string().trim().min(2).max(200),
    department: z.string().trim().max(200).optional().default(""),
    tier: z.enum(["board", "staff"]).default("staff"),
    bio: z.string().trim().max(3000).optional().default(""),
    photo: z.string().trim().max(500).optional().default(""),
    displayOrder: z.number().int().min(0).optional().default(0),
    status: z.enum(["published", "unpublished"]).default("unpublished"),
  })
  .superRefine((data, ctx) => {
    if (data.tier === "board" && data.department.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Department is required for board members.",
        path: ["department"],
      });
    }
  });
