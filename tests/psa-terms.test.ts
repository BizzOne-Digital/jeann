import { describe, expect, it } from "vitest";
import {
  LC_DEADLINE_HOURS,
  PSA_MANDATORY_CLAUSES,
  lcDeadlineLabel,
  missingPsaClauses,
  resolveLcDeadline,
} from "@/lib/contracts/psa-terms";

describe("PSA mandatory clauses", () => {
  it("adds every clause when the PSA has none", () => {
    expect(missingPsaClauses([])).toHaveLength(PSA_MANDATORY_CLAUSES.length);
  });

  it("states the LC deadline from the single source value", () => {
    const text = missingPsaClauses([]).join("\n");
    expect(LC_DEADLINE_HOURS).toBe(48);
    expect(text).toContain("within 48 business hours");
    expect(text).toContain("an amendment fee set by the bank applies");
  });

  it("defaults to 48 business hours but keeps what staff already set", () => {
    expect(resolveLcDeadline(undefined)).toEqual({ hours: 48, business: true });
    expect(resolveLcDeadline({})).toEqual({ hours: 48, business: true });
    // set earlier in plain hours: stays in plain hours
    expect(resolveLcDeadline({ lcDeadlineHours: 24 })).toEqual({ hours: 24, business: false });
    expect(resolveLcDeadline({ lcDeadlineHours: 72, lcDeadlineBusinessHours: true })).toEqual({ hours: 72, business: true });
  });

  it("writes business hours into the clause wording", () => {
    expect(lcDeadlineLabel(48, true)).toBe("48 business");
    expect(missingPsaClauses([], lcDeadlineLabel(72, true)).join("\n")).toContain("within 72 business hours");
    expect(missingPsaClauses([], lcDeadlineLabel(24, false)).join("\n")).toContain("within 24 hours");
  });

  it("does not repeat a clause that is already in the template or clauses", () => {
    const existing = ["Letter of Credit deadline: custom wording", "Amendments: custom wording"];
    const missing = missingPsaClauses(existing);
    expect(missing).toHaveLength(1);
    expect(missing[0]).toContain("Execution:");
  });
});
