import { describe, expect, it } from "vitest";
import { signBuyerDecisionToken, verifyBuyerDecisionToken } from "@/lib/admin/buyer-decision-token";

describe("buyer decision token", () => {
  it("round-trips the organization id", () => {
    const token = signBuyerDecisionToken("6b0888b8ceabe5c52459c7e3");
    expect(verifyBuyerDecisionToken(token)).toEqual({ ok: true, orgId: "6b0888b8ceabe5c52459c7e3" });
  });

  it("rejects an expired token", () => {
    const token = signBuyerDecisionToken("abc", 14, Date.now() - 15 * 24 * 60 * 60 * 1000);
    expect(verifyBuyerDecisionToken(token)).toEqual({ ok: false, reason: "expired" });
  });

  it("rejects a token whose organization was changed", () => {
    const token = signBuyerDecisionToken("org-one");
    const [, signature] = token.split(".");
    const forged = Buffer.from(JSON.stringify({ o: "org-two", e: Date.now() + 100000 })).toString("base64url") + "." + signature;
    expect(verifyBuyerDecisionToken(forged)).toEqual({ ok: false, reason: "invalid" });
  });

  it("rejects missing and malformed tokens", () => {
    expect(verifyBuyerDecisionToken(undefined)).toEqual({ ok: false, reason: "invalid" });
    expect(verifyBuyerDecisionToken("not-a-token")).toEqual({ ok: false, reason: "invalid" });
  });
});
