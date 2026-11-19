import { stepNumberFor } from "@/lib/transactions/document-steps";

/** Trade document types in steps 1-6 that the banking adviser must receive. */
export const ADVISER_DOCUMENT_TYPES = [
  "sco",
  "fco",
  "icpo",
  "spa",
  "proposed_lc_wording",
  "proforma_invoice",
  "letter_of_credit",
  "commercial_invoice",
  "rwa",
  "fis",
  "cis",
] as const;

/**
 * The file that goes to the bank has labelled, numbered tabs in a fixed order. The Letter of Credit
 * issued by the buyer's bank is its own tab and is not the LC wording sent with the PSA.
 */
export const BANK_FILE_TABS: { types: string[]; label: string }[] = [
  { types: ["sco", "fco"], label: "Soft / Full Corporate Offer (SCO / FCO)" },
  { types: ["icpo", "loi"], label: "Irrevocable Corporate Purchase Order (ICPO)" },
  { types: ["spa"], label: "Sales and Purchase Agreement (PSA)" },
  { types: ["proposed_lc_wording"], label: "Proposed LC Wording" },
  { types: ["proforma_invoice"], label: "Proforma Invoice" },
  { types: ["letter_of_credit"], label: "Letter of Credit (LC)" },
  { types: ["rwa", "cis", "fis", "passport_copy"], label: "Supporting documents (RWA, CIS, FIS, passports)" },
  { types: ["commercial_invoice"], label: "Commercial Invoice" },
];

/** Tab number (starting at 1) and label of a document in the bank file. Unknown types go last, in "Other documents". */
export function bankFileTab(documentType: string | undefined): { tabNumber: number; tabLabel: string } {
  const i = BANK_FILE_TABS.findIndex((t) => t.types.includes(String(documentType)));
  if (i < 0) return { tabNumber: BANK_FILE_TABS.length + 1, tabLabel: "Other documents" };
  return { tabNumber: i + 1, tabLabel: BANK_FILE_TABS[i].label };
}

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
  /** Position and label of the tab in the file sent to the bank. */
  tabNumber: number;
  tabLabel: string;
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
  const tab = bankFileTab(doc.documentType);
  return {
    tabNumber: tab.tabNumber,
    tabLabel: tab.tabLabel,
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
