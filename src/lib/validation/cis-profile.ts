import { z } from "zod";

const objectIdString = z.string().regex(/^[a-f\d]{24}$/i);

const representativeSchema = z.object({
  name: z.string().trim().min(1).max(120),
  title: z.string().trim().max(120).optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().max(40).optional(),
  nationality: z.string().trim().max(80).optional(),
  ownershipPercent: z.string().trim().max(20).optional(),
});

const addressSchema = z.object({
  label: z.string().trim().max(80).optional(),
  line1: z.string().trim().min(1).max(200),
  line2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(1).max(120),
  region: z.string().trim().max(120).optional(),
  postalCode: z.string().trim().max(32).optional(),
  country: z.string().trim().length(2),
});

export const cisProfileSchema = z.object({
  organizationId: objectIdString,
  legalName: z.string().trim().min(1).max(200),
  tradingName: z.string().trim().max(200).optional(),
  registrationNumber: z.string().trim().max(80).optional(),
  taxId: z.string().trim().max(80).optional(),
  incorporationDate: z.coerce.date().optional(),
  jurisdiction: z.string().trim().max(120).optional(),
  businessType: z.string().trim().max(120).optional(),
  website: z.string().trim().url().max(500).optional().or(z.literal("")),
  representatives: z.array(representativeSchema).max(20).default([]),
  contacts: z
    .array(
      z.object({
        name: z.string().trim().max(120).optional(),
        email: z.string().trim().email().optional(),
        phone: z.string().trim().max(40).optional(),
        title: z.string().trim().max(120).optional(),
      }),
    )
    .max(20)
    .default([]),
  addresses: z.array(addressSchema).min(1).max(10),
  productInterests: z
    .array(
      z.object({
        productId: objectIdString.optional(),
        productName: z.string().trim().max(200).optional(),
        notes: z.string().trim().max(500).optional(),
      }),
    )
    .max(50)
    .default([]),
  authorizedSigners: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(120),
        title: z.string().trim().max(120).optional(),
        email: z.string().trim().email().optional(),
      }),
    )
    .max(20)
    .default([]),
});

export type CisProfileInput = z.infer<typeof cisProfileSchema>;
