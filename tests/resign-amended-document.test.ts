import { describe, expect, it } from "vitest";
import { checkSignAction } from "@/lib/transactions/step-rules";
import type { WorkflowStepDef } from "@/lib/workflows/transitions";

const steps = (status: WorkflowStepDef["status"]): WorkflowStepDef[] => [
  { key: "sco_fco", order: 1, title: "SCO", status: "completed" },
  { key: "icpo", order: 2, title: "ICPO", status: "completed" },
  { key: "psa_lc", order: 3, title: "PSA", status: "completed" },
  { key: "buyer_sign", order: 4, title: "Buyer signs", status },
  { key: "finekarts_sign", order: 5, title: "Finekarts signs", status: "completed" },
];

describe("signing an amended document", () => {
  it("blocks a second signature of the same version once the step is completed", () => {
    expect(checkSignAction({ side: "buyer", signer: "external", steps: steps("completed") })).toMatch(/already completed/);
  });

  it("allows an amended version to be signed again after the step was completed", () => {
    expect(checkSignAction({ side: "buyer", signer: "external", steps: steps("completed"), allowResign: true })).toBeNull();
  });

  it("still requires the earlier steps to be done", () => {
    const early: WorkflowStepDef[] = [
      { key: "sco_fco", order: 1, title: "SCO", status: "ready" },
      { key: "icpo", order: 2, title: "ICPO", status: "not_started" },
      { key: "psa_lc", order: 3, title: "PSA", status: "not_started" },
      { key: "buyer_sign", order: 4, title: "Buyer signs", status: "not_started" },
    ];
    expect(checkSignAction({ side: "buyer", signer: "external", steps: early, allowResign: true })).toMatch(/not open yet/);
  });
});
