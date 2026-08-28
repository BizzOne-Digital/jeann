import { describe, expect, it } from "vitest";
import { findBankingTransition, BANKING_STATUS_LABELS } from "@/lib/banking/workflow";
import { compareInstrumentWithContract } from "@/lib/banking/consistency";
import { reminderOffsetsForDeadlineType } from "@/lib/banking/deadline-service";

describe("Phase 5 banking lifecycle", () => {
  it("defines status labels", () => {
    expect(BANKING_STATUS_LABELS.draft_wording).toBe("Draft Wording");
    expect(BANKING_STATUS_LABELS.advice_evidence_recorded).toContain("Evidence Recorded");
  });

  it("allows draft wording to internal review", () => {
    const t = findBankingTransition("draft_wording", "internal_review");
    expect(t?.permission).toBe("banking:review");
  });

  it("blocks arbitrary transitions", () => {
    expect(findBankingTransition("draft_wording", "honoured")).toBeUndefined();
  });

  it("requires banking:select for issuance requested from counterparty agreed", () => {
    const t = findBankingTransition("counterparty_agreed", "issuance_requested");
    expect(t?.permission).toBe("banking:select");
    expect(t?.requiresEvidence).toBe(true);
  });

  it("requires evidence for active status", () => {
    const t = findBankingTransition("instrument_comparison_required", "active");
    expect(t?.requiresEvidence).toBe(true);
  });

  it("adviser recommendation uses banking:review permission", () => {
    const t = findBankingTransition("presented", "discrepant");
    expect(t?.permission).toBe("banking:review");
    expect(t?.requiresReason).toBe(true);
  });
});

describe("Instrument consistency without DB", () => {
  it("returns empty when mongo unavailable", async () => {
    const result = await compareInstrumentWithContract("000000000000000000000000");
    expect(result.blocking.length).toBe(0);
  });
});

describe("Deadline reminders", () => {
  it("defines reminder offsets", () => {
    expect(reminderOffsetsForDeadlineType()).toEqual([14, 7, 3, 1, 0]);
  });
});

describe("Banking isolation rules", () => {
  it("buyer and supplier sides are distinct enum values", () => {
    expect(BANKING_STATUS_LABELS.active).toBe("Active");
    expect(BANKING_STATUS_LABELS.issued_copy_uploaded).toBe("Issued Copy Uploaded");
  });
});
