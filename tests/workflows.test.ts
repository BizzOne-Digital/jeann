import { describe, expect, it } from "vitest";
import {
  BUYER_WORKFLOW_STEPS,
  canOpenStep,
  transitionStep,
  type WorkflowStepDef,
} from "@/lib/workflows/transitions";

function readySteps(): WorkflowStepDef[] {
  return BUYER_WORKFLOW_STEPS.map((s, i) => ({
    ...s,
    status: i === 0 ? "ready" : "not_started",
  }));
}

describe("buyer workflow transitions", () => {
  it("has six steps", () => {
    expect(BUYER_WORKFLOW_STEPS).toHaveLength(6);
  });

  it("locks later steps until prerequisites satisfied", () => {
    const steps = readySteps();
    expect(canOpenStep(steps, "icpo")).toBe(false);
    expect(() => transitionStep(steps, "icpo", "in_progress")).toThrow(/Prerequisites/);
  });

  it("requires skip reason", () => {
    const steps = readySteps();
    expect(() => transitionStep(steps, "sco_fco", "skipped", { skipReason: "short" })).toThrow(
      /reason/i,
    );
    const next = transitionStep(steps, "sco_fco", "skipped", {
      skipReason: "Parties began through an agreed alternate route",
    });
    expect(next[0].status).toBe("skipped");
    expect(canOpenStep(next, "icpo")).toBe(true);
  });
});
