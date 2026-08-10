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

export const BUYER_WORKFLOW_STEPS: Omit<WorkflowStepDef, "status">[] = [
  { key: "sco_fco", order: 1, title: "Seller/Finekarts sends SCO or FCO" },
  { key: "icpo", order: 2, title: "Buyer submits/replies with ICPO" },
  { key: "psa_lc", order: 3, title: "Finekarts sends PSA/SPA draft and LC wording" },
  { key: "buyer_sign", order: 4, title: "Buyer signs/stamps PSA/SPA and signer documents" },
  { key: "finekarts_sign", order: 5, title: "Finekarts returns fully executed counterpart" },
  { key: "banking", order: 6, title: "Buyer proceeds with agreed banking instrument" },
];

export const SUPPLIER_WORKFLOW_STEPS: Omit<WorkflowStepDef, "status">[] = [
  { key: "supplier_sco_fco", order: 1, title: "Supplier SCO/FCO received (or skip with reason)" },
  { key: "finekarts_icpo", order: 2, title: "Finekarts sends ICPO" },
  { key: "supplier_psa_lc", order: 3, title: "Supplier replies with PSA/SPA and LC wording" },
  { key: "finekarts_sign", order: 4, title: "Finekarts signs/stamps and submits signer materials" },
  { key: "supplier_sign", order: 5, title: "Supplier returns executed counterpart" },
  { key: "banking", order: 6, title: "Finekarts proceeds with agreed banking instrument" },
];
