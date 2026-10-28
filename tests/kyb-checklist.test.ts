import { describe, expect, it } from "vitest";
import {
  KYB_SECTIONS,
  canRecordOutcome,
  checklistProgress,
  evaluateApprovalGate,
  kybSearchReadiness,
  submissionProgress,
  validateWaiver,
  VALIDATION_CHECKS,
} from "@/lib/kyb/checklist";

const allVerified = VALIDATION_CHECKS.map((c) => ({ key: c.key, status: "verified" as const }));

describe("checklist progress", () => {
  it("counts only fully verified sections", () => {
    const sections = KYB_SECTIONS.map((s, i) => ({
      sectionKey: s.key,
      items: s.items.map(() => ({ status: i < 3 ? ("verified" as const) : ("received" as const) })),
    }));
    const p = checklistProgress(sections);
    expect(p.label).toBe("3 of 8 complete");
    expect(p.withIssues).toBe(0);
  });
  it("flags issues and ignores partially verified sections", () => {
    const first = KYB_SECTIONS[0];
    const p = checklistProgress([
      { sectionKey: first.key, items: [{ status: "verified" }, { status: "issue" }] },
    ]);
    expect(p.complete).toBe(0);
    expect(p.withIssues).toBe(1);
  });
});

describe("submission progress (org-facing)", () => {
  it("is derived from submitted data and documents only", () => {
    const p = submissionProgress({
      hasLegalIdentity: true,
      hasOperatingAddress: true,
      hasDirectorsOrSigners: false,
      hasOwners: true,
      hasBusinessInfo: false,
      documentTypes: ["certificate_of_incorporation", "bank_reference"],
    });
    expect(p.total).toBe(7);
    expect(p.complete).toBe(4);
    expect(p.sections.find((s) => s.key === "compliance_reputation")).toBeUndefined();
  });
});

describe("search readiness", () => {
  it("needs legal name and country only", () => {
    expect(kybSearchReadiness({ legalName: "Acme", country: "CA" }).ready).toBe(true);
    expect(kybSearchReadiness({ legalName: " ", country: "" }).missing).toHaveLength(2);
  });
});

describe("approval gate", () => {
  it("blocks suppliers without validation", () => {
    const r = evaluateApprovalGate({ orgType: "supplier", actorIsCeoOrGm: true });
    expect(r.allowed).toBe(false);
  });
  it("allows suppliers validated, partially validated or waived", () => {
    for (const outcome of ["validated", "partially_validated"] as const) {
      expect(evaluateApprovalGate({ orgType: "supplier", outcome, actorIsCeoOrGm: false }).allowed).toBe(true);
    }
    expect(evaluateApprovalGate({ orgType: "supplier", waived: true, actorIsCeoOrGm: false }).allowed).toBe(true);
  });
  it("does not let override approve an unvalidated supplier", () => {
    const r = evaluateApprovalGate({
      orgType: "supplier",
      outcome: "unable_to_validate",
      actorIsCeoOrGm: true,
      overrideReason: "trust them",
    });
    expect(r.allowed).toBe(false);
  });
  it("warns for buyers with no outcome", () => {
    const r = evaluateApprovalGate({ orgType: "buyer", actorIsCeoOrGm: false });
    expect(r.allowed && r.warning).toBeTruthy();
  });
  it("blocks buyers with unable/escalated unless CEO/GM override with reason", () => {
    const base = { orgType: "buyer", outcome: "escalated_for_review" as const };
    expect(evaluateApprovalGate({ ...base, actorIsCeoOrGm: false, overrideReason: "x" }).allowed).toBe(false);
    const noReason = evaluateApprovalGate({ ...base, actorIsCeoOrGm: true });
    expect(noReason.allowed).toBe(false);
    if (!noReason.allowed) expect(noReason.code).toBe("override_reason_required");
    const ok = evaluateApprovalGate({ ...base, actorIsCeoOrGm: true, overrideReason: "Verified by phone with registry" });
    expect(ok.allowed && ok.overridden).toBe(true);
  });
});

describe("waiver rules", () => {
  it("requires supplier, CEO/GM and a reason", () => {
    expect(validateWaiver({ orgType: "buyer", actorIsCeoOrGm: true, reason: "long enough reason" }).ok).toBe(false);
    expect(validateWaiver({ orgType: "supplier", actorIsCeoOrGm: false, reason: "long enough reason" }).ok).toBe(false);
    expect(validateWaiver({ orgType: "supplier", actorIsCeoOrGm: true, reason: "short" }).ok).toBe(false);
    expect(validateWaiver({ orgType: "supplier", actorIsCeoOrGm: true, reason: "Long-standing supplier since 2019" }).ok).toBe(true);
  });
});

describe("outcome recording", () => {
  it("requires a report", () => {
    expect(canRecordOutcome({ outcome: "unable_to_validate", checks: [], report: " " }).ok).toBe(false);
  });
  it("requires all five checks verified for validated", () => {
    expect(canRecordOutcome({ outcome: "validated", checks: allVerified.slice(1), report: "r" }).ok).toBe(false);
    expect(canRecordOutcome({ outcome: "validated", checks: allVerified, report: "r" }).ok).toBe(true);
    expect(canRecordOutcome({ outcome: "partially_validated", checks: [], report: "r" }).ok).toBe(true);
  });
});

describe("buyer KYB is optional unless staff require it", () => {
  it("allows a buyer without an outcome by default", () => {
    expect(evaluateApprovalGate({ orgType: "buyer", actorIsCeoOrGm: false }).allowed).toBe(true);
  });

  it("blocks a buyer marked as KYB-required until validated, with CEO/GM override possible", () => {
    const blocked = evaluateApprovalGate({ orgType: "buyer", kybRequired: true, actorIsCeoOrGm: true });
    expect(blocked.allowed).toBe(false);
    expect(
      evaluateApprovalGate({ orgType: "buyer", kybRequired: true, outcome: "validated", actorIsCeoOrGm: false })
        .allowed,
    ).toBe(true);
  });
});
