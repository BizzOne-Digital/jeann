import { describe, expect, it } from "vitest";
import { assertResourceOrganization } from "@/lib/authorization/authorize";

describe("cross-tenant isolation", () => {
  it("rejects access when session org does not match resource org", () => {
    expect(() =>
      assertResourceOrganization("org_buyer_a", "org_buyer_b"),
    ).toThrow(/denied|organization|scope/i);
  });

  it("allows access for matching organization", () => {
    expect(() => assertResourceOrganization("org_buyer_a", "org_buyer_a")).not.toThrow();
  });
});
