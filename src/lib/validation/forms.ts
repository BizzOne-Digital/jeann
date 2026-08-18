import { z } from "zod";

export const purchaseRequestLineSchema = z.object({
  productName: z.string().min(2).max(200),
  quantity: z.string().min(1).max(80),
  unit: z.string().min(1).max(40),
  packaging: z.string().min(1).max(200),
});

export const purchaseRequestSchema = z.object({
  companyName: z.string().min(2).max(200),
  contactName: z.string().min(2).max(120),
  email: z.email(),
  phone: z.string().min(7).max(40),
  productSlug: z.string().optional(),
  productName: z.string().min(2).max(200).optional(),
  lineItems: z.array(purchaseRequestLineSchema).min(1).max(20),
  specification: z.string().max(10000).optional(),
  quantity: z.string().max(80).optional(),
  unit: z.string().max(40).optional(),
  frequency: z.string().max(120).optional(),
  destinationCountry: z.string().min(2).max(120),
  destinationPort: z.string().max(120).optional(),
  incoterm: z.enum(["FOB", "CIF", "Other / to discuss"]),
  packaging: z.string().max(200).optional(),
  inspection: z.string().max(200).optional(),
  timeline: z.string().max(200).optional(),
  paymentPreference: z.string().max(200).optional(),
  notes: z.string().max(4000).optional(),
  acceptTerms: z.literal(true, { error: "You must accept the submission terms." }),
}).superRefine((data, ctx) => {
  const first = data.lineItems[0];
  if (!first?.productName) {
    ctx.addIssue({ code: "custom", message: "At least one product line is required.", path: ["lineItems"] });
  }
});

export const tradeOfferSchema = z.object({
  companyName: z.string().min(2).max(200),
  contactName: z.string().min(2).max(120),
  email: z.email(),
  phone: z.string().min(7).max(40),
  productName: z.string().min(2).max(200),
  originCountry: z.string().max(120).optional(),
  quantity: z.string().min(1).max(80),
  unit: z.string().min(1).max(40),
  packaging: z.string().max(200).optional(),
  incoterm: z.enum(["FOB", "CIF", "Other / to discuss"]),
  notes: z.string().max(4000).optional(),
  acceptTerms: z.literal(true, { error: "You must accept the submission terms." }),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.email(),
  phone: z.string().max(40).optional(),
  department: z.enum(["Trade desk", "General", "Careers", "Compliance"]),
  message: z.string().min(10).max(4000),
  consent: z.literal(true, { error: "Consent is required." }),
  website: z.string().max(0).optional(),
});

export const bookingSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.email(),
  phone: z.string().min(7).max(40),
  organization: z.string().min(2).max(200),
  topic: z.string().min(2).max(200),
  commodityInterest: z.string().max(200).optional(),
  estimatedVolume: z.string().max(120).optional(),
  destination: z.string().max(200).optional(),
  timezone: z.string().min(2).max(80),
  preferredSlot: z.string().min(2).max(120),
  notes: z.string().max(4000).optional(),
  consent: z.literal(true, { error: "Consent is required." }),
});

export const newsletterSchema = z.object({
  email: z.email(),
  consent: z.literal(true, { error: "Consent is required." }),
});

export const registerBuyerSchema = z.object({
  legalName: z.string().min(2).max(200),
  registrationNumber: z.string().max(80).optional(),
  country: z.string().min(2).max(120),
  domain: z.string().max(120).optional(),
  contactName: z.string().min(2).max(120),
  email: z.email(),
  phone: z.string().min(7).max(40),
  password: z.string().min(12).max(128),
  acceptBuyerTerms: z.literal(true, { error: "Buyer terms acceptance is required." }),
  acceptPrivacy: z.literal(true, { error: "Privacy policy acceptance is required." }),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export type PurchaseRequestInput = z.infer<typeof purchaseRequestSchema>;
export type TradeOfferInput = z.infer<typeof tradeOfferSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type RegisterBuyerInput = z.infer<typeof registerBuyerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
