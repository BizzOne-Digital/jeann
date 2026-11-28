import { describe, expect, it } from "vitest";
import { kindAllowedOnSide, summarizeFees } from "@/lib/transactions/fees-service";
import { nextCycleLabel } from "@/lib/transactions/requested-documents-service";
import { INSPECTION_REPORT_TITLE, INSPECTION_STATUS_LABEL } from "@/lib/transactions/inspection-service";

describe("fees and payments", () => {
  it("the supplier payment belongs to the supplier order only", () => {
    expect(kindAllowedOnSide("supplier_payment", "supplier")).toBe(true);
    expect(kindAllowedOnSide("supplier_payment", "buyer")).toBe(false);
    for (const kind of ["lc_fee", "banking_fee", "amendment_fee", "mt101_deposit", "other"] as const) {
      expect(kindAllowedOnSide(kind, "buyer")).toBe(true);
      expect(kindAllowedOnSide(kind, "supplier")).toBe(true);
    }
  });

  it("totals are kept per currency and never added across currencies", () => {
    const totals = summarizeFees([
      { currency: "USD", amount: 100.1, status: "due" },
      { currency: "USD", amount: 50.2, status: "paid" },
      { currency: "USD", amount: 0.2, status: "due" },
      { currency: "EUR", amount: 75, status: "due" },
      { currency: "USD", amount: 10, status: "waived" },
    ]);
    expect(totals.find((t) => t.currency === "USD")).toEqual({ currency: "USD", due: 100.3, paid: 50.2, waived: 10 });
    expect(totals.find((t) => t.currency === "EUR")).toEqual({ currency: "EUR", due: 75, paid: 0, waived: 0 });
  });
});

describe("monthly round of the documents", () => {
  it("starts the month after the latest round", () => {
    expect(nextCycleLabel(["2026-11", "2026-12"])).toBe("2027-01");
    expect(nextCycleLabel(["2026-03"])).toBe("2026-04");
  });

  it("starts the month after today when there is no round yet", () => {
    expect(nextCycleLabel([], new Date(Date.UTC(2026, 10, 28)))).toBe("2026-12");
    expect(nextCycleLabel([], new Date(Date.UTC(2026, 11, 5)))).toBe("2027-01");
  });

  it("ignores labels that are not a month", () => {
    expect(nextCycleLabel(["", "abc", "2026-13"], new Date(Date.UTC(2026, 0, 10)))).toBe("2026-02");
  });
});

describe("inspection request at the loading port", () => {
  it("has a label for every status and a fixed report title for the supplier order", () => {
    expect(Object.keys(INSPECTION_STATUS_LABEL).sort()).toEqual(["declined", "granted", "report_received", "requested"]);
    expect(INSPECTION_REPORT_TITLE).toBe("Inspection report at the loading port");
  });
});
