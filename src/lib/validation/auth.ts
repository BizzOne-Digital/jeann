import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
  rememberMe: z.boolean().optional(),
});

export const registerBuyerSchema = z
  .object({
    legalName: z.string().trim().min(2).max(200),
    registrationNumber: z.string().trim().max(80).optional(),
    country: z.string().trim().min(2).max(120),
    domain: z.string().trim().max(120).optional(),
    contactName: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().min(7).max(40),
    password: z
      .string()
      .min(12, "Password must be at least 12 characters")
      .max(128)
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/[a-z]/, "Password must include a lowercase letter")
      .regex(/[0-9]/, "Password must include a number"),
    confirmPassword: z.string().min(12).max(128),
    acceptBuyerTerms: z.literal(true, { message: "Buyer terms must be accepted." }),
    acceptPrivacy: z.literal(true, { message: "Privacy policy must be accepted." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterBuyerInput = z.infer<typeof registerBuyerSchema>;
