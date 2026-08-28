import { describe, expect, it } from "vitest";
import {
  hasPermission,
  resolvePermissionAlias,
  type Permission,
} from "@/lib/authorization/permissions";
import { validateKybUpload } from "@/lib/files/kyb-upload";
import { isAccountLocked, lockoutUntilFromAttempts, rolesRequireMfa } from "@/lib/auth/login-policy";

describe("Phase 2 permission aliases", () => {
  it("resolves dot-notation permissions", () => {
    expect(resolvePermissionAlias("kyb.review")).toBe("orgs:verify");
    expect(resolvePermissionAlias("audit.view")).toBe("audit:read");
  });

  it("buyer cannot access admin via alias", () => {
    const buyerPerms: Permission[] = ["buyer:access", "orgs:read"];
    expect(hasPermission(buyerPerms, "users.view")).toBe(false);
    expect(hasPermission(buyerPerms, "admin:access")).toBe(false);
  });
});

describe("Login policy", () => {
  it("locks account after threshold", () => {
    const until = lockoutUntilFromAttempts(5);
    expect(until).toBeInstanceOf(Date);
    expect(isAccountLocked(until)).toBe(true);
  });

  it("requires MFA for sensitive roles", () => {
    expect(rolesRequireMfa(["ceo_super_admin"])).toBe(true);
    expect(rolesRequireMfa(["buyer_member"])).toBe(false);
  });
});

describe("KYB upload validation", () => {
  const pdfHeader = Buffer.from([0x25, 0x50, 0x44, 0x46]);

  it("accepts valid PDF", () => {
    const result = validateKybUpload({
      filename: "cert.pdf",
      mimeType: "application/pdf",
      size: pdfHeader.length,
      buffer: pdfHeader,
    });
    expect(result.ok).toBe(true);
  });

  it("rejects executable renamed as PDF", () => {
    const exe = Buffer.from([0x4d, 0x5a, 0x90, 0x00]);
    const result = validateKybUpload({
      filename: "evil.pdf",
      mimeType: "application/pdf",
      size: exe.length,
      buffer: exe,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects oversized files", () => {
    const result = validateKybUpload({
      filename: "big.pdf",
      mimeType: "application/pdf",
      size: 11 * 1024 * 1024,
      buffer: pdfHeader,
    });
    expect(result.ok).toBe(false);
  });
});
