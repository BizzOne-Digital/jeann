import { describe, expect, it } from "vitest";
import { hasQualifyingCis, hasQualifyingFis, hasQualifyingRwa, isRwaRequired } from "@/lib/banking/rwa";

describe("LC document rules", () => {
  it("requires documents only for LC style payment terms", () => {
    expect(isRwaRequired("Irrevocable transferable LC at sight")).toBe(true);
    expect(isRwaRequired("standby_lc")).toBe(true);
    expect(isRwaRequired("Telegraphic transfer")).toBe(false);
  });

  it("counts a document unless it was rejected, replaced or deleted", () => {
    const docs = [
      { documentType: "cis", workflowStatus: "submitted" },
      { documentType: "fis", workflowStatus: "changes_requested" },
      { documentType: "rwa", workflowStatus: "submitted", deletedAt: new Date() },
    ];
    expect(hasQualifyingCis(docs)).toBe(true);
    expect(hasQualifyingFis(docs)).toBe(false);
    expect(hasQualifyingRwa(docs)).toBe(false);
  });
});
