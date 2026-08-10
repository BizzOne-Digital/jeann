import {
  BUYER_WORKFLOW_STEPS,
  type WorkflowStepDef,
} from "@/lib/workflows/transitions";

export type WorkflowSide = "buyer" | "supplier";

export type WorkflowStepStatus = WorkflowStepDef["status"];

export interface WorkflowStepDefinition {
  key: string;
  order: number;
  title: string;
  description: string;
  prerequisiteKeys: string[];
}

export interface WorkflowTemplateDefinition {
  key: string;
  side: WorkflowSide;
  name: string;
  version: number;
  steps: WorkflowStepDefinition[];
}

export const BUYER_WORKFLOW_KEY = "buyer_default_v1";

const DESCRIPTIONS: Record<string, string> = {
  sco_fco:
    "Seller/Finekarts sends SCO or FCO. Authorized staff may skip with a recorded reason when parties began through another agreed route.",
  icpo: "Buyer submits or replies with ICPO.",
  psa_lc: "Finekarts sends PSA/SPA draft and approved LC wording references.",
  buyer_sign: "Buyer signs/stamps PSA/SPA and submits authorized-signer documents.",
  finekarts_sign: "Finekarts signs/stamps and returns the fully executed counterpart.",
  banking:
    "Buyer proceeds with the agreed banking instrument (e.g. approved LC structure), subject to bank and contract requirements.",
};

export const BUYER_WORKFLOW: WorkflowTemplateDefinition = {
  key: BUYER_WORKFLOW_KEY,
  side: "buyer",
  name: "Buyer transaction workflow",
  version: 1,
  steps: BUYER_WORKFLOW_STEPS.map((s, index, arr) => ({
    key: s.key,
    order: s.order,
    title: s.title,
    description: DESCRIPTIONS[s.key] ?? s.title,
    prerequisiteKeys: index === 0 ? [] : [arr[index - 1].key],
  })),
};

export function getBuyerStep(key: string): WorkflowStepDefinition | undefined {
  return BUYER_WORKFLOW.steps.find((s) => s.key === key);
}

export function buyerStepKeys(): string[] {
  return BUYER_WORKFLOW.steps.map((s) => s.key);
}
