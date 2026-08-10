import { describe, expect, it } from "vitest";
import {
  hasPermission,
  permissionsForRoles,
  ROLE_PERMISSIONS,
} from "@/lib/authorization/permissions";
import { normalizeCompanyName, generateTransactionNumber } from "@/lib/db/ids";

describe("RBAC and tenancy helpers", () => {
  it("buyer cannot access admin permissions", () => {
    const buyer = permissionsForRoles(["buyer_member"]);
    expect(hasPermission(buyer, "buyer:access")).toBe(true);
    expect(hasPermission(buyer, "admin:access")).toBe(false);
    expect(hasPermission(buyer, "finance:export")).toBe(false);
  });

  it("banking advisor is scoped", () => {
    const perms = ROLE_PERMISSIONS.banking_advisor;
    expect(perms).toContain("banking:review");
    expect(perms).not.toContain("admin:access");
    expect(perms).not.toContain("settings:manage");
  });

  it("normalizes company identity beyond raw string match", () => {
    expect(normalizeCompanyName("Finekarts Inc.")).toBe(
      normalizeCompanyName("FINEKARTS INCORPORATED"),
    );
  });

  it("generates non-guessable transaction numbers", () => {
    const a = generateTransactionNumber();
    const b = generateTransactionNumber();
    expect(a).toMatch(/^FK-\d{4}-[A-Z0-9]{6}$/);
    expect(a).not.toBe(b);
  });
});
