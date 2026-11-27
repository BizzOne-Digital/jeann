import type { TradeDocumentType } from "@/models/Document";

export type DocStepSide = "buyer" | "supplier";

/**
 * A transaction opened after 2026-11-28 follows the client's two-stage workflow (8 steps in the buyer portal, 9 in the
 * supplier portal). Older transactions keep the six steps they were created with. Which one a transaction follows is
 * read from its own step keys, so both keep working side by side.
 */
export function usesStageSteps(side: DocStepSide, keys?: readonly string[]): boolean {
  if (!keys) return false;
  return side === "buyer" ? keys.includes("psa_prepare") : keys.includes("supplier_verification");
}

/** Default workflow step (key + number) for a trade document type. Signing steps are chosen by the caller. */
export function defaultStepForDocument(
  type: TradeDocumentType | string | undefined,
  side: DocStepSide,
  keys?: readonly string[],
): { stepKey: string; stepNumber: number } | undefined {
  const b = side === "buyer";
  const staged = usesStageSteps(side, keys);
  switch (type) {
    case "sco":
    case "fco":
      return { stepKey: b ? "sco_fco" : "supplier_sco_fco", stepNumber: 1 };
    case "icpo":
      return { stepKey: b ? "icpo" : "finekarts_icpo", stepNumber: 2 };
    case "spa":
    case "proposed_lc_wording":
      return staged
        ? { stepKey: b ? "psa_prepare" : "supplier_psa_lc", stepNumber: 4 }
        : { stepKey: b ? "psa_lc" : "supplier_psa_lc", stepNumber: 3 };
    case "proforma_invoice":
      // Buyer portal: the Proforma goes out with the copy of the signed contract (step 7).
      // Supplier portal: the supplier sends it with the completed contract (step 6).
      return staged
        ? { stepKey: b ? "contract_copy" : "supplier_sign", stepNumber: b ? 7 : 6 }
        : { stepKey: b ? "psa_lc" : "supplier_psa_lc", stepNumber: 3 };
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
const STAGE_STEP_NUMBERS: Record<string, number> = {
  sco_fco: 1, icpo: 2, verification: 3, psa_prepare: 4, psa_lc: 5, finekarts_sign: 6, contract_copy: 7, amendments: 8,
};
const SUPPLIER_STAGE_STEP_NUMBERS: Record<string, number> = {
  supplier_sco_fco: 1, finekarts_icpo: 2, supplier_verification: 3, supplier_psa_lc: 4, finekarts_sign: 5,
  supplier_sign: 6, contract_check: 7, lc_to_supplier: 8, trade_documents: 9,
};

export function stepNumberFor(
  stepKey: string | undefined,
  side: DocStepSide,
  keys?: readonly string[],
): number | undefined {
  if (!stepKey) return undefined;
  const staged = usesStageSteps(side, keys);
  const map =
    side === "buyer"
      ? staged ? STAGE_STEP_NUMBERS : STEP_NUMBERS
      : staged ? SUPPLIER_STAGE_STEP_NUMBERS : SUPPLIER_STEP_NUMBERS;
  // A key that only exists in the two-stage workflow (for example psa_prepare) has its number there.
  return map[stepKey] ?? (side === "buyer" ? STAGE_STEP_NUMBERS : SUPPLIER_STAGE_STEP_NUMBERS)[stepKey];
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
