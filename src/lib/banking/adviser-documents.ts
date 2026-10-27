import { stepNumberFor } from "@/lib/transactions/document-steps";

/** Trade document types in steps 1-6 that the banking adviser must receive. */
export const ADVISER_DOCUMENT_TYPES = [
  "sco",
  "fco",
  "icpo",
  "spa",
  "proposed_lc_wording",
  "proforma_invoice",
] as const;

const RELEASED = ["approved", "sent", "viewed", "signed"];

export function isBankingAdviserDocument(doc: {
  documentType?: string;
  stepKey?: string;
  bankingVisible?: boolean;
  workflowStatus?: string;
}): boolean {
  if (!RELEASED.includes(String(doc.workflowStatus))) return false;
  if (doc.bankingVisible) return true;
  if (doc.stepKey) return true;
  return (ADVISER_DOCUMENT_TYPES as readonly string[]).includes(String(doc.documentType));
}

export type AdviserDocumentRow = {
  id: string;
  transactionId: string;
  transactionNumber?: string;
  side: "buyer_sale" | "supplier_purchase";
  stepNumber?: number;
  stepKey?: string;
  documentType: string;
  title: string;
  status: string;
  signed: boolean;
  filename?: string;
  mimeType?: string;
  isPdf: boolean;
  downloadHref: string;
};

export function buildAdviserDocumentRow(
  doc: {
    _id: unknown;
    transactionId?: unknown;
    documentType?: string;
    stepKey?: string;
    title: string;
    workflowStatus: string;
    shippingDocumentType?: string;
    category?: string;
  },
  ctx: {
    side: "buyer_sale" | "supplier_purchase";
    transactionNumber?: string;
    filename?: string;
    mimeType?: string;
  },
): AdviserDocumentRow {
  const stepNumber = stepNumberFor(doc.stepKey, ctx.side === "buyer_sale" ? "buyer" : "supplier");
  return {
    id: String(doc._id),
    transactionId: String(doc.transactionId),
    transactionNumber: ctx.transactionNumber,
    side: ctx.side,
    stepNumber,
    stepKey: doc.stepKey,
    documentType: doc.documentType ?? doc.shippingDocumentType ?? doc.category ?? "other",
    title: doc.title,
    status: doc.workflowStatus,
    signed: doc.workflowStatus === "signed",
    filename: ctx.filename,
    mimeType: ctx.mimeType,
    isPdf:
      ctx.mimeType === "application/pdf" || Boolean(ctx.filename?.toLowerCase().endsWith(".pdf")),
    downloadHref: `/api/banking/documents/${String(doc._id)}/download`,
  };
}
