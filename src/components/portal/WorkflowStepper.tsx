"use client";

import { BUYER_WORKFLOW_STEPS, SUPPLIER_WORKFLOW_STEPS } from "@/lib/workflows/transitions";

export type WorkflowStepView = {
  key: string;
  order: number;
  title: string;
  status: string;
  skipReason?: string;
};

function stepDefs(mode: "buyer" | "supplier") {
  return mode === "buyer" ? BUYER_WORKFLOW_STEPS : SUPPLIER_WORKFLOW_STEPS;
}

function statusClass(status: string, active: boolean): string {
  if (status === "skipped") return "border-amber-300 bg-amber-50 text-amber-900";
  if (status === "completed" || status === "approved") {
    return "border-[var(--forest)] bg-[var(--forest)] text-white";
  }
  if (active) return "border-[var(--navy)] bg-[var(--navy)] text-white";
  return "border-[var(--line)] bg-white text-[var(--stone)]";
}

export function WorkflowStepper({
  mode,
  steps,
  currentStepKey,
}: {
  mode: "buyer" | "supplier";
  steps?: WorkflowStepView[];
  currentStepKey?: string;
}) {
  const defs = stepDefs(mode);
  const merged = defs.map((def) => {
    const live = steps?.find((s) => s.key === def.key);
    return {
      ...def,
      status: live?.status ?? "not_started",
      skipReason: live?.skipReason,
    };
  });

  return (
    <ol className="grid gap-2 lg:grid-cols-6">
      {merged.map((step) => {
        const active = step.key === currentStepKey;
        return (
          <li
            key={step.key}
            className={`rounded-md border p-3 text-xs font-medium leading-snug ${statusClass(step.status, active)}`}
            title={step.skipReason ? `Skipped: ${step.skipReason}` : step.title}
          >
            <span className="mr-1 opacity-70">{step.order}.</span>
            {step.title}
            {step.status === "skipped" ? (
              <span className="mt-1 block text-[10px] opacity-80">Skipped</span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
