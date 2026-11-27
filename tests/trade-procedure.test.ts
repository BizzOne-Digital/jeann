import { describe, expect, it } from "vitest";
import { BUYER_WORKFLOW_STEPS } from "@/lib/workflows/transitions";
import { tradeProcedureLines } from "@/lib/contracts/trade-procedure";
import { SCO_SKELETON_BLOCKS } from "@/lib/contracts/sco-skeleton";
import { defaultTemplates } from "@/lib/contracts/default-templates";

describe("trade procedure of the SCO and FCO", () => {
  it("is the stage 1 workflow, step for step, in the same words", () => {
    const lines = tradeProcedureLines();
    expect(lines).toHaveLength(BUYER_WORKFLOW_STEPS.length);
    BUYER_WORKFLOW_STEPS.forEach((step, i) => expect(lines[i]).toBe(step.order + ". " + step.title + "."));
  });

  it("is printed in the SCO and in the FCO", () => {
    const sco = SCO_SKELETON_BLOCKS.map((b) => b.content).join("\n");
    for (const line of tradeProcedureLines()) expect(sco).toContain(line);
    const fco = defaultTemplates().find((t) => t.key === "fco_buyer")!;
    const fcoText = fco.bodyBlocks.map((b) => b.content).join("\n");
    for (const line of tradeProcedureLines()) expect(fcoText).toContain(line);
  });
});
