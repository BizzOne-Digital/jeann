import { canOpenStep, isStepSatisfied, type StepStatus, type WorkflowStepDef } from "@/lib/workflows/transitions";
import { WORKFLOW_TRANSITIONS, type WorkflowTransition } from "@/lib/transactions/workflow";
import { PROCUREMENT_TRANSITIONS } from "@/lib/transactions/procurement-workflow";
import { defaultStepForDocument, type DocStepSide } from "@/lib/transactions/document-steps";

/** Pure step-advance rules for both portals. No database access here. */

export type DocEvent = "created" | "submitted" | "approved" | "sent" | "signed";

/** Document types authored by Finekarts staff (the counterparty only receives them). */
const STAFF_AUTHORED: Record<DocStepSide, string[]> = {
  buyer: ["sco", "fco", "spa", "proposed_lc_wording", "proforma_invoice"],
  supplier: ["icpo"],
};

/** Types the external party (buyer or supplier) may upload without staff. */
const EXTERNAL_UPLOAD: Record<DocStepSide, string[]> = {
  buyer: ["icpo", "passport_copy", "loi", "rwa", "other"],
  supplier: ["sco", "fco", "spa", "proposed_lc_wording", "proforma_invoice", "passport_copy", "loi", "other"],
};

/** Documents that can be uploaded at any time (supporting material, no step). */
const FREE_TYPES = ["passport_copy", "loi", "rwa", "other", "contract_amendment"];

const RANK: Record<string, number> = {
  not_started: 0,
  ready: 1,
  in_progress: 2,
  changes_requested: 2,
  submitted: 3,
  approved: 4,
  completed: 5,
  skipped: 5,
};

export function isStaffAuthored(side: DocStepSide, type: string): boolean {
  return STAFF_AUTHORED[side].includes(type);
}

export function externalMayUpload(side: DocStepSide, type: string): boolean {
  return EXTERNAL_UPLOAD[side].includes(type);
}

export type StepUpdate = { stepKey: string; status: StepStatus };

/**
 * Which step status should result from a document event.
 * Staff-authored documents complete their step when SENT; counterparty-authored ones when APPROVED.
 * Step 3 completes only on the PSA/SPA (LC wording and proforma are supporting documents).
 */
export function stepUpdateForEvent(
  side: DocStepSide,
  documentType: string,
  event: DocEvent,
  signer?: "external" | "staff",
): StepUpdate | null {
  if (event === "signed") {
    if (documentType !== "spa") return null;
    if (side === "buyer") {
      return signer === "staff"
        ? { stepKey: "finekarts_sign", status: "completed" }
        : { stepKey: "buyer_sign", status: "completed" };
    }
    return signer === "staff"
      ? { stepKey: "finekarts_sign", status: "completed" }
      : { stepKey: "supplier_sign", status: "completed" };
  }
  const def = defaultStepForDocument(documentType, side);
  if (!def) return null;
  const staff = isStaffAuthored(side, documentType);
  const completesStep = documentType !== "proposed_lc_wording" && documentType !== "proforma_invoice";
  let status: StepStatus;
  switch (event) {
    case "created":
      status = "in_progress";
      break;
    case "submitted":
      status = "submitted";
      break;
    case "approved":
      status = staff || !completesStep ? "approved" : "completed";
      break;
    case "sent":
      status = completesStep ? "completed" : "in_progress";
      break;
    default:
      return null;
  }
  if (!staff && event === "sent") return null;
  if (!completesStep && (status === "completed" || status === "approved")) status = "in_progress";
  return { stepKey: def.stepKey, status };
}

/** Never move a step backwards. */
export function shouldApply(current: StepStatus, next: StepStatus): boolean {
  return (RANK[next] ?? 0) > (RANK[current] ?? 0) || (current === "changes_requested" && next === "in_progress");
}

/** Returns an error message when a document action is not allowed for the current step state, else null. */
export function checkDocumentAction(input: {
  side: DocStepSide;
  isInternal: boolean;
  documentType: string;
  steps: WorkflowStepDef[];
  action: "upload" | "create" | "send";
}): string | null {
  const { side, isInternal, documentType, steps } = input;
  if (!isInternal && !externalMayUpload(side, documentType)) {
    return "This document type is issued by Finekarts and cannot be uploaded here.";
  }
  if (FREE_TYPES.includes(documentType) || steps.length === 0) return null;
  const def = defaultStepForDocument(documentType, side);
  if (!def) return null;
  if (!canOpenStep(steps, def.stepKey)) {
    return `Step ${def.stepNumber} is not open yet. Earlier steps must be completed or skipped first.`;
  }
  const current = steps.find((s) => s.key === def.stepKey);
  if (current && !isInternal && isStepSatisfied(current.status)) {
    return `Step ${def.stepNumber} is already completed.`;
  }
  return null;
}

/** Whether a signature may be recorded now (buyer signs first on buyer side; Finekarts first on supplier side). */
export function checkSignAction(input: {
  side: DocStepSide;
  signer: "external" | "staff";
  steps: WorkflowStepDef[];
}): string | null {
  if (input.steps.length === 0) return null;
  const key =
    input.side === "buyer"
      ? input.signer === "staff" ? "finekarts_sign" : "buyer_sign"
      : input.signer === "staff" ? "finekarts_sign" : "supplier_sign";
  if (!canOpenStep(input.steps, key)) {
    return "Signing is not open yet. The previous steps must be completed first.";
  }
  const cur = input.steps.find((s) => s.key === key);
  if (cur && isStepSatisfied(cur.status)) return "This signing step is already completed.";
  return null;
}

/** Target workflowStatus for a step status (the state machine is walked toward it). */
export function targetWorkflowStatus(
  side: DocStepSide,
  stepKey: string,
  status: StepStatus,
): string | null {
  const b: Record<string, Partial<Record<StepStatus, string>>> = {
    sco_fco: { in_progress: "offer_draft", submitted: "offer_under_review", approved: "offer_approved", completed: "offer_sent" },
    icpo: { in_progress: "icpo_draft", submitted: "icpo_submitted", approved: "icpo_approved", completed: "icpo_approved" },
    psa_lc: { in_progress: "contract_draft", submitted: "contract_under_review", approved: "contract_approved", completed: "awaiting_buyer_signature" },
    buyer_sign: { completed: "awaiting_finekarts_signature" },
    finekarts_sign: { completed: "contract_executed" },
    banking: { in_progress: "banking_setup" },
  };
  const s: Record<string, Partial<Record<StepStatus, string>>> = {
    supplier_sco_fco: { in_progress: "offer_draft", submitted: "offer_under_review", approved: "offer_approved", completed: "offer_approved" },
    finekarts_icpo: { in_progress: "icpo_draft", submitted: "icpo_under_review", approved: "icpo_approved", completed: "icpo_sent" },
    supplier_psa_lc: { in_progress: "contract_draft", submitted: "contract_under_review", approved: "contract_approved", completed: "contract_approved" },
    finekarts_sign: { in_progress: "awaiting_finekarts_signature", completed: "awaiting_supplier_signature" },
    supplier_sign: { completed: "contract_executed" },
    banking: { in_progress: "banking_setup", completed: "instrument_issuance_requested" },
  };
  return (side === "buyer" ? b : s)[stepKey]?.[status] ?? null;
}

/** Breadth-first path through the transition table (permissions ignored: system-driven). */
export function findPath(
  table: WorkflowTransition[],
  from: string,
  to: string,
  maxDepth = 12,
): string[] | null {
  if (from === to) return [];
  const seen = new Set<string>([from]);
  let frontier: Array<{ at: string; path: string[] }> = [{ at: from, path: [] }];
  for (let depth = 0; depth < maxDepth && frontier.length; depth++) {
    const next: typeof frontier = [];
    for (const f of frontier) {
      for (const t of table) {
        if (t.from !== f.at || seen.has(t.to)) continue;
        // never auto-walk into terminal / hold states
        if (["cancelled", "declined", "on_hold"].includes(t.to)) continue;
        const path = [...f.path, t.to];
        if (t.to === to) return path;
        seen.add(t.to);
        next.push({ at: t.to, path });
      }
    }
    frontier = next;
  }
  return null;
}

export function transitionTable(side: DocStepSide): WorkflowTransition[] {
  return side === "buyer" ? WORKFLOW_TRANSITIONS : PROCUREMENT_TRANSITIONS;
}

/** The only early states where Step 1 may still be skipped. */
export const SKIPPABLE_STATES: Record<DocStepSide, string[]> = {
  buyer: ["draft", "submitted", "qualification", "qualified", "offer_draft", "offer_changes_requested"],
  supplier: ["draft", "procurement_need_identified", "supplier_selection", "offer_pending", "offer_draft", "offer_changes_requested"],
};

export function canSkipStepOne(input: {
  side: DocStepSide;
  workflowStatus: string;
  step1Status?: StepStatus;
  hasReleasedOffer: boolean;
  alreadySkipped: boolean;
}): string | null {
  if (input.alreadySkipped) return "Step 1 was already skipped.";
  if (input.hasReleasedOffer) return "An SCO/FCO has already been sent or approved.";
  if (input.step1Status && ["submitted", "approved", "completed", "skipped"].includes(input.step1Status)) {
    return "Step 1 is already past the point where it can be skipped.";
  }
  if (!SKIPPABLE_STATES[input.side].includes(input.workflowStatus)) {
    return "The transaction is past the early stage where Step 1 can be skipped.";
  }
  return null;
}

/** Buyer-visible commercial terms: explicit whitelist, never spread the whole record. */
export const BUYER_TERMS_FIELDS = [
  "productName", "productOrigin", "quantity", "quantityUnit", "quantityTolerance", "currency",
  "unitPrice", "totalEstimatedValue", "incoterm", "namedPortPlace", "loadingPort", "destinationPort",
  "shipmentSchedule", "packaging", "inspectionCompany", "inspectionLocation", "paymentProposal",
  "bankingInstrumentProposal", "offerValidity", "buyerVisibleNotes", "version", "approvalStatus",
] as const;

export function whitelistBuyerTerms(
  terms: Record<string, unknown> | null | undefined,
): Record<string, unknown> | null {
  if (!terms) return null;
  const status = String(terms.approvalStatus ?? "");
  if (status !== "approved") return null;
  const out: Record<string, unknown> = {};
  for (const k of BUYER_TERMS_FIELDS) {
    const v = terms[k];
    if (v === undefined || v === null) continue;
    out[k] = typeof v === "object" && v !== null && "toString" in v ? String(v) : v;
  }
  return out;
}
