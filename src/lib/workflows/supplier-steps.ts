import { SUPPLIER_WORKFLOW_STEPS } from "@/lib/workflows/transitions";
import type { WorkflowStepDefinition, WorkflowTemplateDefinition } from "@/lib/workflows/buyer-steps";

export const SUPPLIER_WORKFLOW_KEY = "supplier_default_v1";

const DESCRIPTIONS: Record<string, string> = {
  supplier_sco_fco:
    "Finekarts receives SCO/FCO from supplier, or an authorized manager skips with a recorded reason.",
  finekarts_icpo: "Finekarts sends ICPO.",
  supplier_psa_lc: "Supplier replies with PSA/SPA and LC wording.",
  finekarts_sign: "Finekarts signs/stamps and submits authorized-signer materials.",
  supplier_sign: "Supplier signs/stamps and returns its counterpart.",
  banking:
    "Finekarts proceeds with the agreed banking instrument and subsequent fulfillment workflow.",
};

export const SUPPLIER_WORKFLOW: WorkflowTemplateDefinition = {
  key: SUPPLIER_WORKFLOW_KEY,
  side: "supplier",
  name: "Supplier transaction workflow",
  version: 1,
  steps: SUPPLIER_WORKFLOW_STEPS.map((s, index, arr) => ({
    key: s.key,
    order: s.order,
    title: s.title,
    description: DESCRIPTIONS[s.key] ?? s.title,
    prerequisiteKeys: index === 0 ? [] : [arr[index - 1].key],
  })),
};

export function getSupplierStep(key: string): WorkflowStepDefinition | undefined {
  return SUPPLIER_WORKFLOW.steps.find((s) => s.key === key);
}

export function supplierStepKeys(): string[] {
  return SUPPLIER_WORKFLOW.steps.map((s) => s.key);
}
