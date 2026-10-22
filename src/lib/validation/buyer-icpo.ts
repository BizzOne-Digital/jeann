import { z } from "zod";

export const buyerIcpoFormSchema = z.object({
  productName: z.string().trim().min(2).max(200),
  quantity: z.string().trim().min(1).max(40),
  unit: z.literal("MT").default("MT"),
  destinationPort: z.string().trim().min(2).max(120),
  destinationCountry: z.string().trim().min(2).max(80).optional(),
  incoterm: z.enum(["FOB", "CIF"]),
  pricePerMt: z.coerce.number().positive().max(1_000_000),
  requestedSpecification: z.string().trim().min(3).max(4000),
  packaging: z.string().trim().min(2).max(200),
  paymentTermId: z.string().trim().optional(),
  paymentPreference: z.string().trim().max(200).optional(),
  notes: z.string().trim().max(4000).optional(),
  icpoLegalAck: z.literal(true, {
    message: "You must acknowledge the ICPO legal notice before submitting.",
  }),
  discussFirst: z.boolean().optional(),
});

export type BuyerIcpoFormInput = z.infer<typeof buyerIcpoFormSchema>;

export const buyerDocumentUploadSchema = z.object({
  submissionKind: z.enum(["icpo_upload", "loi_upload"]),
  productName: z.string().trim().min(2).max(200).optional(),
  notes: z.string().trim().max(2000).optional(),
});
