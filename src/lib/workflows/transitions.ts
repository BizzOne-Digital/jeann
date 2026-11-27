export const STEP_STATUSES = [
  "not_started",
  "ready",
  "in_progress",
  "submitted",
  "changes_requested",
  "approved",
  "rejected",
  "skipped",
  "completed",
  "expired",
] as const;

export type StepStatus = (typeof STEP_STATUSES)[number];

export type WorkflowStepDef = {
  key: string;
  order: number;
  title: string;
  status: StepStatus;
  skipReason?: string;
};

const COMPLETED: StepStatus[] = ["approved", "completed", "skipped"];

export function isStepSatisfied(status: StepStatus): boolean {
  return COMPLETED.includes(status);
}

export function canOpenStep(steps: WorkflowStepDef[], stepKey: string): boolean {
  const ordered = [...steps].sort((a, b) => a.order - b.order);
  const idx = ordered.findIndex((s) => s.key === stepKey);
  if (idx < 0) return false;
  if (idx === 0) return true;
  return ordered.slice(0, idx).every((s) => isStepSatisfied(s.status));
}

export function canSkipStep(reason: string | undefined): boolean {
  return Boolean(reason && reason.trim().length >= 8);
}

export function transitionStep(
  steps: WorkflowStepDef[],
  stepKey: string,
  next: StepStatus,
  opts?: { skipReason?: string },
): WorkflowStepDef[] {
  if (!canOpenStep(steps, stepKey) && next !== "not_started") {
    throw new Error("Prerequisites not satisfied for this step");
  }
  if (next === "skipped" && !canSkipStep(opts?.skipReason)) {
    throw new Error("Skip requires a recorded reason");
  }

  return steps.map((s) =>
    s.key === stepKey
      ? {
          ...s,
          status: next,
          skipReason: next === "skipped" ? opts?.skipReason : s.skipReason,
        }
      : s,
  );
}

/**
 * The workflow of a transaction, as the client defined it (2026-11-28). A transaction has two stages:
 * STAGE 1 starts in the buyer portal, where Finekarts is the supplier, and STAGE 2 ends in the supplier portal,
 * where Finekarts is the buyer and completes the purchase order of stage 1. The SCO/FCO calls the same list the
 * trade procedure; the platform calls it the workflow. The SCO/FCO text is built from the titles below, so the buyer
 * is shown exactly the steps that the workflow follows.
 */
/** STAGE 1, buyer portal (Finekarts is the supplier): 8 steps. */
export const BUYER_WORKFLOW_STEPS: Omit<WorkflowStepDef, "status">[] = [
  { key: "sco_fco", order: 1, title: "Finekarts issues the SCO or FCO, the offer, which carries the trade procedure" },
  { key: "icpo", order: 2, title: "The buyer reviews and accepts the offer and submits the ICPO, an irrevocable purchase order" },
  { key: "verification", order: 3, title: "Finekarts requests the verification documents and the buyer uploads the CIS, RWA and FIS" },
  { key: "psa_prepare", order: 4, title: "Finekarts reviews the verification documents and, if satisfied, prepares the PSA from the buyer's ICPO" },
  { key: "psa_lc", order: 5, title: "Finekarts sends the PSA with the LC wording; the buyer reviews, signs, stamps, attaches a passport copy and returns it, or requests changes" },
  { key: "finekarts_sign", order: 6, title: "Finekarts signs, stamps and attaches the director's passport: the PSA becomes a full contract" },
  { key: "contract_copy", order: 7, title: "Finekarts sends the buyer a final copy of the contract with the Proforma Invoice; the buyer opens the LC account within 48 business hours" },
  { key: "amendments", order: 8, title: "Amendments, as many as are needed; the buyer's inspection request is granted at the loading port" },
];

/** STAGE 2, supplier portal (Finekarts is the buyer): 9 steps. */
export const SUPPLIER_WORKFLOW_STEPS: Omit<WorkflowStepDef, "status">[] = [
  { key: "supplier_sco_fco", order: 1, title: "Finekarts receives the supplier's SCO or FCO, or discusses the opportunity by chat, message, email or WhatsApp, and decides whether to proceed" },
  { key: "finekarts_icpo", order: 2, title: "Finekarts submits its ICPO to the supplier: the buyer's ICPO with Finekarts' company name" },
  { key: "supplier_verification", order: 3, title: "Finekarts uploads the CIS, RWA and FIS, and any other document the supplier asks for" },
  { key: "supplier_psa_lc", order: 4, title: "The supplier prepares the PSA from the terms, conditions and product specification of the purchase order, with the LC wording, and sends it to Finekarts" },
  { key: "finekarts_sign", order: 5, title: "Finekarts reviews the PSA, signs, stamps, attaches the director's passport and returns it to the supplier" },
  { key: "supplier_sign", order: 6, title: "The supplier signs, stamps and attaches the director's passport: the contract is complete and the supplier sends it with a Proforma Invoice" },
  { key: "contract_check", order: 7, title: "Finekarts checks that the contract matches the purchase order and takes the paperwork and the Proforma Invoice to its bank to create the LC account" },
  { key: "lc_to_supplier", order: 8, title: "Finekarts sends the LC to the supplier as agreed in the PSA; the supplier provides the trade documents requested by the buyer's ICPO" },
  { key: "trade_documents", order: 9, title: "Documents are collected and reviewed by the banking advisor, our bank sends the contract and all documents to the buyer's bank, and the final payment is made by MT103" },
];

/**
 * Steps that Finekarts staff complete themselves (there is no single document that completes them): they review and
 * decide. They never block through a hidden rule; staff press the button when they are satisfied, or skip with a reason.
 */
export const STAFF_COMPLETED_STEPS: Record<"buyer" | "supplier", string[]> = {
  buyer: ["verification"],
  supplier: ["supplier_verification", "contract_check", "lc_to_supplier", "trade_documents"],
};

/** The steps that transactions opened before 2026-11-28 were created with. They keep working as they are. */
export const LEGACY_BUYER_WORKFLOW_STEPS: Omit<WorkflowStepDef, "status">[] = [
  { key: "sco_fco", order: 1, title: "Seller/Finekarts sends SCO or FCO" },
  { key: "icpo", order: 2, title: "Buyer submits ICPO or LOI and sends CIS, RWA and FIS" },
  { key: "psa_lc", order: 3, title: "Finekarts sends PSA/SPA draft and LC wording" },
  { key: "buyer_sign", order: 4, title: "Buyer signs/stamps PSA/SPA and signer documents" },
  { key: "finekarts_sign", order: 5, title: "Finekarts returns fully executed counterpart" },
  { key: "banking", order: 6, title: "Buyer proceeds with agreed banking instrument" },
];

export const LEGACY_SUPPLIER_WORKFLOW_STEPS: Omit<WorkflowStepDef, "status">[] = [
  { key: "supplier_sco_fco", order: 1, title: "Supplier SCO/FCO received (or skip with reason)" },
  { key: "finekarts_icpo", order: 2, title: "Finekarts sends ICPO" },
  { key: "supplier_psa_lc", order: 3, title: "Supplier replies with PSA/SPA and LC wording" },
  { key: "finekarts_sign", order: 4, title: "Finekarts signs/stamps and submits signer materials" },
  { key: "supplier_sign", order: 5, title: "Supplier returns executed counterpart" },
  { key: "banking", order: 6, title: "Finekarts proceeds with agreed banking instrument" },
];
