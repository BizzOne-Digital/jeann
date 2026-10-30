import { describe, expect, it } from "vitest";
import { hasQualifyingRwa, isRwaRequired, isRwaRequiredFor } from "@/lib/banking/rwa";

describe("isRwaRequired", () => {
  it.each([
    "irrevocable_documentary_lc",
    "standby_lc",
    "Irrevocable LC at Sight",
    "Irrevocable Transferable Revolving LC at Sight",
    "Confirmed LC",
    "SBLC only",
    "Letter of Credit at sight",
    "LC + Performance Guarantee",
  ])("requires RWA for %s", (v) => expect(isRwaRequired(v)).toBe(true));

  it.each(["bank_guarantee", "documentary_collection", "TT in advance", "", undefined, null, "Black"])(
    "does not require RWA for %s",
    (v) => expect(isRwaRequired(v)).toBe(false),
  );

  it("checks several inputs", () => {
    expect(isRwaRequiredFor("bank_guarantee", "Irrevocable LC at Sight")).toBe(true);
    expect(isRwaRequiredFor(undefined, "bank_guarantee")).toBe(false);
  });
});

describe("hasQualifyingRwa", () => {
  it("ignores rejected, archived and deleted", () => {
    expect(hasQualifyingRwa([{ documentType: "rwa", workflowStatus: "changes_requested" }])).toBe(false);
    expect(hasQualifyingRwa([{ documentType: "rwa", workflowStatus: "draft", deletedAt: new Date() }])).toBe(false);
    expect(hasQualifyingRwa([{ documentType: "spa", workflowStatus: "approved" }])).toBe(false);
  });
  it("accepts submitted RWA", () => {
    expect(hasQualifyingRwa([{ documentType: "rwa", workflowStatus: "under_review" }])).toBe(true);
  });
});
