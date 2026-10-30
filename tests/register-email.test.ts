import { describe, expect, it } from "vitest";
import { registerBuyerSchema } from "@/lib/validation/auth";

const base = {
  legalName: "Demo Trading Ltd",
  registrationNumber: "REG-12345",
  taxNumber: "TAX-12345",
  previousHsCode: "1512",
  country: "Canada",
  addressLine1: "1 Main Street",
  addressCity: "Toronto",
  managerName: "Test Buyer",
  phone: "+14165550100",
  password: "StrongPassw0rd!",
  confirmPassword: "StrongPassw0rd!",
  acceptBuyerTerms: true as const,
  acceptPrivacy: true as const,
};

describe("buyer registration email", () => {
  it.each(["buyer@gmail.com", "buyer@yahoo.com", "buyer@outlook.com", "buyer@hotmail.com", "ceo@acme-trading.com"])(
    "accepts %s",
    (email) => {
      const parsed = registerBuyerSchema.safeParse({ ...base, email });
      expect(parsed.success).toBe(true);
    },
  );

  it("still rejects an invalid address", () => {
    expect(registerBuyerSchema.safeParse({ ...base, email: "not-an-email" }).success).toBe(false);
  });
});
