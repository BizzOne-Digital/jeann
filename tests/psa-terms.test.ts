import { describe, expect, it } from "vitest";
import { LC_DEADLINE_HOURS, PSA_MANDATORY_CLAUSES, missingPsaClauses } from "@/lib/contracts/psa-terms";

describe("PSA mandatory clauses", () => {
  it("adds every clause when the PSA has none", () => {
    expect(missingPsaClauses([])).toHaveLength(PSA_MANDATORY_CLAUSES.length);
  });

  it("states the LC deadline from the single source value", () => {
    const text = missingPsaClauses([]).join("\n");
    expect(text).toContain("within " + LC_DEADLINE_HOURS + " hours");
    expect(text).toContain("an amendment fee set by the bank applies");
  });

  it("does not repeat a clause that is already in the template or clauses", () => {
    const existing = ["Letter of Credit deadline: custom wording", "Amendments: custom wording"];
    const missing = missingPsaClauses(existing);
    expect(missing).toHaveLength(1);
    expect(missing[0]).toContain("Execution:");
  });
});
