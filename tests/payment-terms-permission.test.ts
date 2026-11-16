import { describe, expect, it } from "vitest";
import { ROLE_PERMISSIONS } from "@/lib/authorization/permissions";

describe("payment terms permission", () => {
  it("is held by senior managers only", () => {
    expect(ROLE_PERMISSIONS.ceo_super_admin).toContain("payment_terms:decide");
    expect(ROLE_PERMISSIONS.general_manager).toContain("payment_terms:decide");
    expect(ROLE_PERMISSIONS.trade_manager).not.toContain("payment_terms:decide");
    expect(ROLE_PERMISSIONS.employee_operations).not.toContain("payment_terms:decide");
  });
});
