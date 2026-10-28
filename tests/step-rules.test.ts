import { describe, expect, it } from "vitest";
import {
  canSkipStepOne,
  checkDocumentAction,
  checkSignAction,
  findPath,
  shouldApply,
  stepUpdateForEvent,
  targetWorkflowStatus,
  transitionTable,
  whitelistBuyerTerms,
} from "@/lib/transactions/step-rules";
import { BUYER_WORKFLOW_STEPS, SUPPLIER_WORKFLOW_STEPS, type StepStatus } from "@/lib/workflows/transitions";

const buyerSteps = (statuses: StepStatus[]) =>
  BUYER_WORKFLOW_STEPS.map((s, i) => ({ ...s, status: statuses[i] ?? "not_started" }));
const supplierSteps = (statuses: StepStatus[]) =>
  SUPPLIER_WORKFLOW_STEPS.map((s, i) => ({ ...s, status: statuses[i] ?? "not_started" }));

describe("step advance rules", () => {
  it("staff-authored SCO completes step 1 only when sent", () => {
    expect(stepUpdateForEvent("buyer", "sco", "approved")).toEqual({ stepKey: "sco_fco", status: "approved" });
    expect(stepUpdateForEvent("buyer", "sco", "sent")).toEqual({ stepKey: "sco_fco", status: "completed" });
  });
  it("buyer ICPO completes step 2 when approved", () => {
    expect(stepUpdateForEvent("buyer", "icpo", "approved")).toEqual({ stepKey: "icpo", status: "completed" });
  });
  it("supplier flow is reversed: supplier SCO completes on approval, Finekarts ICPO on send", () => {
    expect(stepUpdateForEvent("supplier", "sco", "approved")).toEqual({ stepKey: "supplier_sco_fco", status: "completed" });
    expect(stepUpdateForEvent("supplier", "icpo", "sent")).toEqual({ stepKey: "finekarts_icpo", status: "completed" });
  });
  it("LC wording and proforma never complete step 3", () => {
    expect(stepUpdateForEvent("buyer", "proforma_invoice", "sent")?.status).toBe("in_progress");
    expect(stepUpdateForEvent("buyer", "proposed_lc_wording", "approved")?.status).toBe("in_progress");
    expect(stepUpdateForEvent("buyer", "spa", "sent")).toEqual({ stepKey: "psa_lc", status: "completed" });
  });
  it("signatures map to the right sign step per side", () => {
    expect(stepUpdateForEvent("buyer", "spa", "signed", "external")?.stepKey).toBe("buyer_sign");
    expect(stepUpdateForEvent("buyer", "spa", "signed", "staff")?.stepKey).toBe("finekarts_sign");
    expect(stepUpdateForEvent("supplier", "spa", "signed", "external")?.stepKey).toBe("supplier_sign");
    expect(stepUpdateForEvent("buyer", "icpo", "signed", "external")).toBeNull();
  });
  it("never moves a step backwards", () => {
    expect(shouldApply("completed", "submitted")).toBe(false);
    expect(shouldApply("ready", "in_progress")).toBe(true);
    expect(shouldApply("changes_requested", "in_progress")).toBe(true);
  });
  it("walks the state machine toward the target status", () => {
    const path = findPath(transitionTable("buyer"), "icpo_pending", "icpo_approved");
    expect(path?.at(-1)).toBe("icpo_approved");
    expect(findPath(transitionTable("buyer"), "contract_executed", "offer_sent")).toBeNull();
    expect(targetWorkflowStatus("buyer", "finekarts_sign", "completed")).toBe("contract_executed");
    expect(findPath(transitionTable("supplier"), "icpo_approved", "icpo_sent")).toEqual(["icpo_sent"]);
  });
});

describe("document gating", () => {
  it("buyers cannot upload documents issued by Finekarts", () => {
    for (const t of ["sco", "fco", "spa", "proforma_invoice", "proposed_lc_wording"]) {
      expect(
        checkDocumentAction({ side: "buyer", isInternal: false, documentType: t, steps: buyerSteps(["skipped"]), action: "upload" }),
      ).toMatch(/issued by Finekarts/);
    }
  });
  it("buyer ICPO needs step 1 satisfied", () => {
    expect(checkDocumentAction({ side: "buyer", isInternal: false, documentType: "icpo", steps: buyerSteps(["ready"]), action: "upload" })).toMatch(/not open/);
    expect(checkDocumentAction({ side: "buyer", isInternal: false, documentType: "icpo", steps: buyerSteps(["skipped", "ready"]), action: "upload" })).toBeNull();
  });
  it("staff cannot send SPA before ICPO is approved", () => {
    expect(checkDocumentAction({ side: "buyer", isInternal: true, documentType: "spa", steps: buyerSteps(["completed", "submitted"]), action: "send" })).toMatch(/not open/);
    expect(checkDocumentAction({ side: "buyer", isInternal: true, documentType: "spa", steps: buyerSteps(["completed", "completed"]), action: "send" })).toBeNull();
  });
  it("supplier side: supplier cannot upload ICPO, but can upload SCO", () => {
    expect(checkDocumentAction({ side: "supplier", isInternal: false, documentType: "icpo", steps: supplierSteps(["ready"]), action: "upload" })).toMatch(/issued by Finekarts/);
    expect(checkDocumentAction({ side: "supplier", isInternal: false, documentType: "sco", steps: supplierSteps(["ready"]), action: "upload" })).toBeNull();
  });
  it("passport copies are allowed at any time", () => {
    expect(checkDocumentAction({ side: "buyer", isInternal: false, documentType: "passport_copy", steps: buyerSteps([]), action: "upload" })).toBeNull();
  });
  it("signing order: buyer first on buyer side, Finekarts first on supplier side", () => {
    expect(checkSignAction({ side: "buyer", signer: "external", steps: buyerSteps(["completed", "completed", "submitted"]) })).toMatch(/not open/);
    expect(checkSignAction({ side: "buyer", signer: "external", steps: buyerSteps(["completed", "completed", "completed"]) })).toBeNull();
    expect(checkSignAction({ side: "buyer", signer: "staff", steps: buyerSteps(["completed", "completed", "completed", "ready"]) })).toMatch(/not open/);
    expect(checkSignAction({ side: "supplier", signer: "external", steps: supplierSteps(["completed", "completed", "completed", "ready"]) })).toMatch(/not open/);
  });
});

describe("skip step 1 rules", () => {
  const base = { side: "buyer" as const, workflowStatus: "qualified", step1Status: "ready" as StepStatus, hasReleasedOffer: false, alreadySkipped: false };
  it("allows early states", () => {
    expect(canSkipStepOne(base)).toBeNull();
  });
  it("blocks once an offer was sent or the workflow moved on", () => {
    expect(canSkipStepOne({ ...base, hasReleasedOffer: true })).toMatch(/already been sent/);
    expect(canSkipStepOne({ ...base, workflowStatus: "contract_draft" })).toMatch(/early stage/);
    expect(canSkipStepOne({ ...base, step1Status: "completed" })).toMatch(/already past/);
    expect(canSkipStepOne({ ...base, alreadySkipped: true })).toMatch(/already skipped/);
  });
  it("applies on the supplier side too", () => {
    expect(canSkipStepOne({ ...base, side: "supplier", workflowStatus: "offer_pending" })).toBeNull();
    expect(canSkipStepOne({ ...base, side: "supplier", workflowStatus: "icpo_draft" })).toMatch(/early stage/);
  });
});

describe("buyer field whitelisting", () => {
  const terms = {
    productName: "Sunflower oil",
    unitPrice: "900",
    currency: "USD",
    approvalStatus: "approved",
    internalNotes: "margin 12%",
    productId: "abc",
    organizationId: "org",
  };
  it("hides terms until approved", () => {
    expect(whitelistBuyerTerms({ ...terms, approvalStatus: "draft" })).toBeNull();
    expect(whitelistBuyerTerms(null)).toBeNull();
  });
  it("drops internal and unknown fields", () => {
    const out = whitelistBuyerTerms(terms)!;
    expect(out.productName).toBe("Sunflower oil");
    expect(out).not.toHaveProperty("internalNotes");
    expect(out).not.toHaveProperty("organizationId");
    expect(out).not.toHaveProperty("productId");
  });
});
