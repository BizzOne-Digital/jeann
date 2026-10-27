import type { TradeDocumentType } from "@/models/Document";

export type DocStepSide = "buyer" | "supplier";

/** Default workflow step (key + number) for a trade document type. Step 4/5 signing is chosen by the caller. */
export function defaultStepForDocument(
  type: TradeDocumentType | string | undefined,
  side: DocStepSide,
): { stepKey: string; stepNumber: number } | undefined {
  const b = side === "buyer";
  switch (type) {
    case "sco":
    case "fco":
      return { stepKey: b ? "sco_fco" : "supplier_sco_fco", stepNumber: 1 };
    case "icpo":
      return { stepKey: b ? "icpo" : "finekarts_icpo", stepNumber: 2 };
    case "spa":
    case "proposed_lc_wording":
    case "proforma_invoice":
      return { stepKey: b ? "psa_lc" : "supplier_psa_lc", stepNumber: 3 };
    default:
      return undefined;
  }
}

const STEP_NUMBERS: Record<string, number> = {
  sco_fco: 1, icpo: 2, psa_lc: 3, buyer_sign: 4, finekarts_sign: 5, banking: 6,
};
const SUPPLIER_STEP_NUMBERS: Record<string, number> = {
  supplier_sco_fco: 1, finekarts_icpo: 2, supplier_psa_lc: 3, finekarts_sign: 4, supplier_sign: 5, banking: 6,
};

export function stepNumberFor(stepKey: string | undefined, side: DocStepSide): number | undefined {
  if (!stepKey) return undefined;
  return (side === "buyer" ? STEP_NUMBERS : SUPPLIER_STEP_NUMBERS)[stepKey];
}

export function documentFilename(parts: {
  transactionNumber?: string;
  stepNumber?: number;
  documentType?: string;
  version: number;
}): string {
  const clean = (s: string) => s.replace(/[^A-Za-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  return [
    clean(parts.transactionNumber || "TX"),
    parts.stepNumber ? `STEP${parts.stepNumber}` : "DOC",
    clean((parts.documentType || "document").toUpperCase()),
    `v${parts.version}`,
  ].join("_") + ".pdf";
}
