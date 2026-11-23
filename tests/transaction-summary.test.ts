import { describe, expect, it } from "vitest";
import {
  buildTransactionFinanceRow,
  computeCanadaHst,
  computeCanadaHstReceived,
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

describe("canada HST received from a Canadian buyer", () => {
  it("receives 13% on the contract total only when the buyer is in Canada", () => {
    expect(computeCanadaHstReceived("10000.00", true)).toBe("1300.00");
    expect(computeCanadaHstReceived("10000.00", false)).toBe("0.00");
  });
  it("shows what is paid and what is received without changing profit", () => {
    const both = buildTransactionFinanceRow({ ...base, canadianSupplier: true, canadianBuyer: true });
    expect(both.hstAmount).toBe("910.00");
    expect(both.hstReceived).toBe("1300.00");
    expect(both.profit).toBe("1790.00");
    const buyerOnly = buildTransactionFinanceRow({ ...base, canadianSupplier: false, canadianBuyer: true });
    expect(buyerOnly.hstAmount).toBe("0.00");
    expect(buyerOnly.hstReceived).toBe("1300.00");
    expect(buyerOnly.profit).toBe("2700.00");
    const neither = buildTransactionFinanceRow({ ...base, canadianSupplier: false, canadianBuyer: false });
    expect(neither.hstReceived).toBe("0.00");
    expect(neither.hstRate).toBe("0");
  });
});
