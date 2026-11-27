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

// The step titles are the client's own wording and are complete sentences, so they are also the descriptions.
const DESCRIPTIONS: Record<string, string> = {};

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
