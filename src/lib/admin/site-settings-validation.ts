import { z } from "zod";

export const adminSiteSettingsSchema = z.object({
  companyName: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(50).optional().default(""),
  addressVisible: z.boolean().default(false),
  addressLine1: z.string().trim().max(200).optional().default(""),
  addressCity: z.string().trim().max(120).optional().default(""),
  addressCountry: z.string().trim().max(2).optional().default(""),
  seoTitle: z.string().trim().max(200).optional().default(""),
  seoDescription: z.string().trim().max(500).optional().default(""),
  aiAssistantEnabled: z.boolean().default(false),
  supplierPortal: z.boolean().default(true),
  bankingPortal: z.boolean().default(true),
  aiAssistantFlag: z.boolean().default(true),
  financeModule: z.boolean().default(true),
  locales: z.string().trim().max(200).optional().default("en"),
});

export type AdminSiteSettingsInput = z.infer<typeof adminSiteSettingsSchema>;

export function siteSettingsInputToMongo(input: AdminSiteSettingsInput) {
  const locales = input.locales
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return {
    key: "default",
    companyName: input.companyName,
    email: input.email.toLowerCase(),
    phone: input.phone || undefined,
    addressVisible: input.addressVisible,
    address:
      input.addressLine1 && input.addressCity && input.addressCountry
        ? {
            line1: input.addressLine1,
            city: input.addressCity,
            country: input.addressCountry.toUpperCase(),
          }
        : undefined,
    seoDefaults: {
      title: input.seoTitle || undefined,
      description: input.seoDescription || undefined,
    },
    featureFlags: {
      supplierPortal: input.supplierPortal,
      bankingPortal: input.bankingPortal,
      aiAssistant: input.aiAssistantFlag,
      financeModule: input.financeModule,
    },
    aiAssistantEnabled: input.aiAssistantEnabled,
    locales: locales.length > 0 ? locales : ["en"],
  };
}
