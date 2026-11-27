import { SUPPLIER_WORKFLOW_STEPS } from "@/lib/workflows/transitions";
import type { WorkflowStepDefinition, WorkflowTemplateDefinition } from "@/lib/workflows/buyer-steps";

export const SUPPLIER_WORKFLOW_KEY = "supplier_default_v1";

// The step titles are the client's own wording and are complete sentences, so they are also the descriptions.
const DESCRIPTIONS: Record<string, string> = {};

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
