import { describe, expect, it } from "vitest";
import { describeBlockers } from "@/lib/onboarding/blocker-labels";
import { ICPO_SPECIFICATION_NOTE } from "@/lib/content/buyer-portal-guidance";

describe("onboarding blockers", () => {
  it("shows readable labels and removes duplicates", () => {
    const text = describeBlockers([
      "email_verification",
      "organization_not_approved",
      "cis_kyb_not_approved",
      "email_verification",
      "terms_acceptance",
      "cis_kyb",
      "admin_review",
    ]);
    expect(text).not.toMatch(/_/);
    expect(text.match(/verify your email/g)?.length).toBe(1);
    expect(text).toContain("accept the required terms");
  });
});

describe("ICPO specification note", () => {
  it("contains the wording the client asked for", () => {
    expect(ICPO_SPECIFICATION_NOTE).toContain("Indicative commercial specifications only");
    expect(ICPO_SPECIFICATION_NOTE).toContain("Certificate of Analysis (CoA)");
    expect(ICPO_SPECIFICATION_NOTE).toContain("signed SPA");
  });
});
