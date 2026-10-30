import { describe, expect, it } from "vitest";
import { buildCisProgress } from "@/lib/onboarding/cis-progress";

describe("buildCisProgress", () => {
  it("counts completed CIS items and never mentions KYB", () => {
    const p = buildCisProgress({
      hasCompanyDetails: true,
      hasRegisteredAddress: true,
      hasAuthorizedRepresentative: false,
      hasSupportingDocuments: false,
    });
    expect(p.complete).toBe(2);
    expect(p.total).toBe(4);
    expect(JSON.stringify(p)).not.toMatch(/kyb|kyc|aml/i);
  });
});
