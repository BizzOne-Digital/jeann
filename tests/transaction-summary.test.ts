import { describe, expect, it } from "vitest";
import {
  buildTransactionFinanceRow,
  computeCanadaHst,
  matchesSearch,
  periodKey,
  rollupRows,
} from "@/lib/finance/transaction-summary";

const base = {
  transactionId: "1",
  transactionNumber: "TX-001",
  status: "active",
  periodDate: new Date("2026-02-10T00:00:00Z"),
  contractTotal: "10000.00",
  purchasingCost: "7000.00",
  bankingFees: "100.00",
  agentFees: "200.00",
};

describe("canada HST", () => {
  it("computes 13% only for canadian suppliers", () => {
    expect(computeCanadaHst("7000.00", true)).toBe("910.00");
    expect(computeCanadaHst("7000.00", false)).toBe("0.00");
  });
  it("deducts HST from profit", () => {
    expect(buildTransactionFinanceRow({ ...base, canadianSupplier: true }).profit).toBe("1790.00");
    expect(buildTransactionFinanceRow({ ...base, canadianSupplier: false }).profit).toBe("2700.00");
  });
});

describe("rollups and search", () => {
  it("groups by month, quarter, year", () => {
    const a = buildTransactionFinanceRow({ ...base, canadianSupplier: false });
    const b = buildTransactionFinanceRow({
      ...base,
      transactionId: "2",
      periodDate: new Date("2026-03-05T00:00:00Z"),
      canadianSupplier: true,
    });
    expect(periodKey(new Date("2026-05-01T00:00:00Z"), "quarter")).toBe("2026-Q2");
    expect(rollupRows([a, b], "month")).toHaveLength(2);
    const q = rollupRows([a, b], "quarter");
    expect(q).toHaveLength(1);
    expect(q[0].profit).toBe("4490.00");
    expect(rollupRows([a, b], "year")[0].transactions).toBe(2);
  });
  it("searches by buyer name", () => {
    const a = buildTransactionFinanceRow({ ...base, buyerName: "Acme", canadianSupplier: false });
    expect(matchesSearch(a, "acme")).toBe(true);
    expect(matchesSearch(a, "zzz")).toBe(false);
  });
});

import { applyModuleChange } from "@/lib/authorization/modules";

describe("employee modules", () => {
  it("add grants and un-denies, remove denies", () => {
    const added = applyModuleChange({ custom: [], denied: ["finance:read"] }, "finance", "add");
    expect(added.custom).toContain("finance:read");
    expect(added.denied).not.toContain("finance:read");
    const removed = applyModuleChange(added, "finance", "remove");
    expect(removed.denied).toContain("finance:write");
    expect(removed.custom).not.toContain("finance:write");
  });
});

import { normalizeRate } from "@/lib/finance/transaction-summary";

describe("rate normalization and currency grouping", () => {
  it("normalizes tax rates", () => {
    expect(normalizeRate("0.13")).toBe("0.13");
    expect(normalizeRate("13")).toBe("0.13");
    expect(normalizeRate("13%")).toBe("0.13");
    expect(normalizeRate("abc")).toBeNull();
    expect(normalizeRate("0")).toBeNull();
  });
  it("never adds different currencies together", () => {
    const usd = buildTransactionFinanceRow({ ...base, currency: "USD", canadianSupplier: false });
    const cad = buildTransactionFinanceRow({ ...base, transactionId: "2", currency: "CAD", canadianSupplier: false });
    const r = rollupRows([usd, cad], "year");
    expect(r).toHaveLength(2);
    expect(r.map((x) => x.currency).sort()).toEqual(["CAD", "USD"]);
  });
  it("uses a custom HST rate", () => {
    expect(computeCanadaHst("1000.00", true, "0.15")).toBe("150.00");
  });
});
