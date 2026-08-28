import { describe, expect, it } from "vitest";
import {
  findTransition,
  allowedTransitionsFrom,
  WORKFLOW_STATUS_LABELS,
} from "@/lib/transactions/workflow";
import { parseTransactionNumber } from "@/lib/transactions/number";
import { validateTransactionConsistency } from "@/lib/transactions/consistency";

describe("Phase 3 workflow", () => {
  it("defines labels for all workflow statuses", () => {
    expect(WORKFLOW_STATUS_LABELS.submitted).toBe("Submitted");
    expect(WORKFLOW_STATUS_LABELS.banking_setup).toBe("Banking Setup");
  });

  it("allows submitted to qualification for trade manager", () => {
    const t = findTransition("submitted", "qualification");
    expect(t?.permission).toBe("transactions:approve");
  });

  it("blocks arbitrary transitions", () => {
    expect(findTransition("draft", "contract_executed")).toBeUndefined();
  });

  it("lists allowed transitions from qualified", () => {
    const next = allowedTransitionsFrom("qualified");
    expect(next.some((t) => t.to === "offer_draft")).toBe(true);
  });

  it("parses FK-S transaction numbers", () => {
    const parsed = parseTransactionNumber("FK-S-2026-000001");
    expect(parsed?.year).toBe(2026);
    expect(parsed?.sequence).toBe(1);
  });
});

describe("Consistency checker without DB", () => {
  it("returns empty when mongo unavailable in test", async () => {
    const result = await validateTransactionConsistency("000000000000000000000000");
    expect(result.blocking.length).toBe(0);
  });
});
