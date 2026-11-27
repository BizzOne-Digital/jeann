import { describe, expect, it } from "vitest";
import {
  BUYER_WORKFLOW_STEPS,
  SUPPLIER_WORKFLOW_STEPS,
  STAFF_COMPLETED_STEPS,
  type StepStatus,
} from "@/lib/workflows/transitions";
import { defaultStepForDocument, stepNumberFor, usesStageSteps } from "@/lib/transactions/document-steps";
import {
  checkDocumentAction,
  checkSignAction,
  stepUpdateForEvent,
  targetWorkflowStatus,
} from "@/lib/transactions/step-rules";

const buyerKeys = BUYER_WORKFLOW_STEPS.map((s) => s.key);
const supplierKeys = SUPPLIER_WORKFLOW_STEPS.map((s) => s.key);
const buyer = (statuses: StepStatus[]) => BUYER_WORKFLOW_STEPS.map((s, i) => ({ ...s, status: statuses[i] ?? "not_started" }));

describe("the client's two-stage workflow (2026-11-28)", () => {
  it("stage 1, buyer portal, has these eight steps in this order", () => {
    expect(buyerKeys).toEqual(["sco_fco", "icpo", "verification", "psa_prepare", "psa_lc", "finekarts_sign", "contract_copy", "amendments"]);
  });

  it("stage 2, supplier portal, has these nine steps in this order", () => {
    expect(supplierKeys).toEqual([
      "supplier_sco_fco", "finekarts_icpo", "supplier_verification", "supplier_psa_lc", "finekarts_sign",
      "supplier_sign", "contract_check", "lc_to_supplier", "trade_documents",
    ]);
  });

  it("recognises which workflow a transaction follows from its own step keys", () => {
    expect(usesStageSteps("buyer", buyerKeys)).toBe(true);
    expect(usesStageSteps("buyer", ["sco_fco", "icpo", "psa_lc", "buyer_sign", "finekarts_sign", "banking"])).toBe(false);
    expect(usesStageSteps("supplier", supplierKeys)).toBe(true);
    expect(usesStageSteps("buyer")).toBe(false);
  });

  it("numbers documents by the transaction's own steps", () => {
    expect(defaultStepForDocument("spa", "buyer", buyerKeys)).toEqual({ stepKey: "psa_prepare", stepNumber: 4 });
    expect(defaultStepForDocument("proforma_invoice", "buyer", buyerKeys)).toEqual({ stepKey: "contract_copy", stepNumber: 7 });
    expect(defaultStepForDocument("spa", "buyer")).toEqual({ stepKey: "psa_lc", stepNumber: 3 });
    expect(stepNumberFor("finekarts_sign", "buyer", buyerKeys)).toBe(6);
    expect(stepNumberFor("finekarts_sign", "supplier", supplierKeys)).toBe(5);
    expect(stepNumberFor("finekarts_sign", "buyer")).toBe(5);
  });

  it("step 4 prepares the PSA, step 5 is the buyer signing it, step 6 is Finekarts signing", () => {
    expect(stepUpdateForEvent("buyer", "spa", "sent", undefined, buyerKeys)).toEqual({ stepKey: "psa_prepare", status: "completed" });
    expect(stepUpdateForEvent("buyer", "proposed_lc_wording", "sent", undefined, buyerKeys)?.status).toBe("in_progress");
    expect(stepUpdateForEvent("buyer", "spa", "signed", "external", buyerKeys)).toEqual({ stepKey: "psa_lc", status: "completed" });
    expect(stepUpdateForEvent("buyer", "spa", "signed", "staff", buyerKeys)).toEqual({ stepKey: "finekarts_sign", status: "completed" });
  });

  it("the Proforma Invoice only counts when it is sent with the signed contract (step 7)", () => {
    expect(stepUpdateForEvent("buyer", "proforma_invoice", "created", undefined, buyerKeys)).toBeNull();
    expect(stepUpdateForEvent("buyer", "proforma_invoice", "approved", undefined, buyerKeys)).toBeNull();
    expect(stepUpdateForEvent("buyer", "proforma_invoice", "sent", undefined, buyerKeys)).toEqual({ stepKey: "contract_copy", status: "completed" });
  });

  it("the PSA cannot be prepared until the verification step is done, but the Proforma can be prepared early", () => {
    const beforeVerification = buyer(["completed", "completed", "ready"]);
    const gate = (type: string, steps = beforeVerification) =>
      checkDocumentAction({ side: "buyer", isInternal: true, documentType: type, steps, action: "create" });
    expect(gate("spa")).toMatch(/Step 4 is not open yet/);
    expect(gate("proforma_invoice")).toBeNull();
    expect(gate("cis")).toBeNull();
    const afterVerification = buyer(["completed", "completed", "completed", "ready"]);
    expect(gate("spa", afterVerification)).toBeNull();
  });

  it("the buyer signs at step 5, after the PSA was sent, and not before", () => {
    const notYet = buyer(["completed", "completed", "completed", "ready"]);
    expect(checkSignAction({ side: "buyer", signer: "external", steps: notYet })).toMatch(/not open yet/);
    const sent = buyer(["completed", "completed", "completed", "completed", "ready"]);
    expect(checkSignAction({ side: "buyer", signer: "external", steps: sent })).toBeNull();
  });

  it("each step moves the transaction to the matching status", () => {
    expect(targetWorkflowStatus("buyer", "psa_prepare", "completed", buyerKeys)).toBe("awaiting_buyer_signature");
    expect(targetWorkflowStatus("buyer", "psa_lc", "completed", buyerKeys)).toBe("awaiting_finekarts_signature");
    expect(targetWorkflowStatus("buyer", "finekarts_sign", "completed", buyerKeys)).toBe("contract_executed");
    expect(targetWorkflowStatus("buyer", "verification", "completed", buyerKeys)).toBeNull();
    // the older workflow still reads psa_lc the way it always did
    expect(targetWorkflowStatus("buyer", "psa_lc", "completed")).toBe("awaiting_buyer_signature");
  });

  it("only review steps are completed by staff, and never one that a document completes", () => {
    expect(STAFF_COMPLETED_STEPS.buyer).toEqual(["verification"]);
    expect(STAFF_COMPLETED_STEPS.supplier).toContain("contract_check");
    expect(STAFF_COMPLETED_STEPS.buyer).not.toContain("psa_lc");
  });
});
