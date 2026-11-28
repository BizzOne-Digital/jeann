import { z } from "zod";
import { TRANSACTION_FEE_KINDS, TRANSACTION_FEE_STATUSES } from "@/models/TransactionFee";

export const feeBodySchema = z.object({
  kind: z.enum(TRANSACTION_FEE_KINDS),
  description: z.string().trim().max(300).optional(),
  currency: z.string().trim().length(3, "Use a 3-letter currency such as USD.").transform((v) => v.toUpperCase()),
  amount: z.number().min(0, "The amount cannot be negative.").max(1e12),
  status: z.enum(TRANSACTION_FEE_STATUSES).optional(),
  dueDate: z.string().trim().nullable().optional(),
  reference: z.string().trim().max(120).optional(),
  notes: z.string().trim().max(1000).optional(),
});
