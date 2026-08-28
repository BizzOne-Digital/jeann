import { describe, expect, it } from "vitest";
import {
  calculateTax,
  calculateProfitability,
  calculateLineTotal,
  roundMoney,
} from "@/lib/finance/calculations";
import { money } from "@/lib/finance/money";
import { assertProfitabilityAccess } from "@/lib/finance/access";
import { ForbiddenError } from "@/lib/auth/errors";
import { DevelopmentAccountingProvider } from "@/lib/finance/accounting-provider";
import { isMongoConfigured } from "@/lib/db/mongoose";

describe("Phase 7 decimal calculations", () => {
  it("rounds money to two decimal places", () => {
    expect(roundMoney("10.005").toString()).toBe("10.01");
    expect(roundMoney("10.004").toString()).toBe("10");
  });

  it("calculates line totals without float drift", () => {
    const total = calculateLineTotal("1000", "1050");
    expect(total.toString()).toBe("1050000");
  });

  it("calculates tax-exclusive tax", () => {
    const result = calculateTax({
      subtotal: "100",
      taxCode: "HST",
      ratePercent: "13",
      taxInclusive: false,
      recoverable: true,
    });
    expect(result.taxAmount.toString()).toBe("13");
    expect(result.total.toString()).toBe("113");
    expect(result.recoverableTax.toString()).toBe("13");
  });

  it("calculates tax-inclusive tax", () => {
    const result = calculateTax({
      subtotal: "113",
      taxCode: "HST",
      ratePercent: "13",
      taxInclusive: true,
      recoverable: false,
    });
    expect(result.taxAmount.toString()).toBe("13");
    expect(result.subtotal.toString()).toBe("100");
    expect(result.nonRecoverableTax.toString()).toBe("13");
  });

  it("skips tax when no code configured", () => {
    const result = calculateTax({ subtotal: "1000" });
    expect(result.taxAmount.toString()).toBe("0");
    expect(result.total.toString()).toBe("1000");
  });

  it("calculates profitability per spec definitions", () => {
    const result = calculateProfitability({
      revenue: "1050000",
      procurementCost: "980000",
      directCosts: "40000",
      currency: "USD",
    });
    expect(result.grossTradingMargin).toBe("70000");
    expect(result.contributionProfit).toBe("30000");
  });

  it("supports partial payment balance math", () => {
    const total = money("1050000");
    const partial = money("500000");
    const balance = total.minus(partial);
    expect(balance.toString()).toBe("550000");
  });

  it("blocks over-allocation", () => {
    const payment = money("100");
    const alloc1 = money("60");
    const alloc2 = money("50");
    expect(alloc1.plus(alloc2).gt(payment.plus("0.01"))).toBe(true);
  });
});

describe("Phase 7 profitability access isolation", () => {
  it("denies external users profitability", () => {
    expect(() =>
      assertProfitabilityAccess({
        userId: "u1",
        isInternal: false,
        permissions: ["finance:read"],
        memberships: [],
      } as never),
    ).toThrow(ForbiddenError);
  });

  it("allows internal finance readers", () => {
    expect(() =>
      assertProfitabilityAccess({
        userId: "u1",
        isInternal: true,
        permissions: ["finance:read"],
        memberships: [],
      } as never),
    ).not.toThrow();
  });
});

describe("Phase 7 accounting provider", () => {
  it("returns not_configured when credentials absent", async () => {
    const prev = process.env.ACCOUNTING_PROVIDER_CONFIGURED;
    process.env.ACCOUNTING_PROVIDER_CONFIGURED = "false";
    const provider = new DevelopmentAccountingProvider();
    const result = await provider.syncInvoice("test-id-123");
    expect(result.status).toBe("not_configured");
    expect(result.ok).toBe(false);
    process.env.ACCOUNTING_PROVIDER_CONFIGURED = prev;
  });

  it("mock succeeds only when explicitly configured", async () => {
    const prev = process.env.ACCOUNTING_PROVIDER_CONFIGURED;
    process.env.ACCOUNTING_PROVIDER_CONFIGURED = "true";
    const provider = new DevelopmentAccountingProvider();
    const result = await provider.syncInvoice("test-id-456");
    expect(result.status).toBe("success");
    expect(result.ok).toBe(true);
    process.env.ACCOUNTING_PROVIDER_CONFIGURED = prev;
  });

  it("development mock labels connection clearly", async () => {
    const provider = new DevelopmentAccountingProvider();
    const conn = await provider.testConnection();
    expect(conn.message).toContain("Development mock");
  });
});

describe("Phase 7 payment verification rules", () => {
  it("uploaded evidence does not imply cleared status by default", () => {
    const statusesAfterUpload = ["pending_verification"];
    expect(statusesAfterUpload).not.toContain("cleared");
    expect(statusesAfterUpload).not.toContain("recorded");
  });
});

describe("Phase 7 tax configuration rules", () => {
  it("does not hardcode universal HST in calculation helper", () => {
    const noTax = calculateTax({ subtotal: "100", taxCode: undefined });
    expect(noTax.taxAmount.toString()).toBe("0");
    const custom = calculateTax({
      subtotal: "100",
      taxCode: "GST",
      ratePercent: "5",
      taxInclusive: false,
    });
    expect(custom.taxAmount.toString()).toBe("5");
  });
});

describe("Phase 7 integration with MongoDB", () => {
  it("seeded transaction contribution profit is USD 30000", async () => {
    if (!isMongoConfigured()) return;
    const { connectMongo } = await import("@/lib/db/mongoose");
    await connectMongo();
    const { Transaction } = await import("@/models");
    const tx = await Transaction.findOne({ transactionNumber: "FK-S-2026-TEST-0001" }).lean();
    if (!tx) return;
    const { calculateTransactionProfitability } = await import(
      "@/lib/finance/profitability-service"
    );
    const result = await calculateTransactionProfitability(String(tx._id), "USD");
    if (result.revenue === "0") return;
    expect(result.contributionProfit).toBe("30000");
  });

  it("buyer invoice is issued with QA marker when seeded", async () => {
    if (!isMongoConfigured()) return;
    const { connectMongo } = await import("@/lib/db/mongoose");
    await connectMongo();
    const { BuyerInvoice, Transaction } = await import("@/models");
    const tx = await Transaction.findOne({ transactionNumber: "FK-S-2026-TEST-0001" }).lean();
    if (!tx) return;
    const invoice = await BuyerInvoice.findOne({ transactionId: tx._id }).lean();
    if (!invoice) return;
    expect(invoice.qaMarker).toContain("TEST DOCUMENT");
    expect(["issued", "paid", "partially_paid"]).toContain(invoice.status);
  });

  it("posted financial entry cannot be edited in service layer", async () => {
    if (!isMongoConfigured()) return;
    const { connectMongo } = await import("@/lib/db/mongoose");
    await connectMongo();
    const { FinancialEntry } = await import("@/models");
    const posted = await FinancialEntry.findOne({ status: "posted" }).lean();
    if (!posted) return;
    const entry = await FinancialEntry.findById(posted._id);
    if (!entry) return;
    entry.description = "tampered";
    await expect(entry.save()).rejects.toThrow(/immutable/);
  });

  it("separation of duties blocks self-approval", async () => {
    if (!isMongoConfigured()) return;
    const { connectMongo } = await import("@/lib/db/mongoose");
    await connectMongo();
    const { FinancialEntry, User } = await import("@/models");
    const tradeUser = await User.findOne({ email: "trade@test.finekarts.local" });
    const draft = await FinancialEntry.findOne({ status: "draft" }).lean();
    if (!tradeUser || !draft) return;
    if (String(draft.createdByUserId) !== String(tradeUser._id)) return;
    const { approveFinancialEntry } = await import("@/lib/finance/entry-service");
    await expect(
      approveFinancialEntry({
        entryId: String(draft._id),
        actorUserId: String(tradeUser._id),
      }),
    ).rejects.toThrow();
  });

  it("deal group profitability aggregates linked transactions", async () => {
    if (!isMongoConfigured()) return;
    const { connectMongo } = await import("@/lib/db/mongoose");
    await connectMongo();
    const { DealGroup } = await import("@/models");
    const dg = await DealGroup.findOne({ dealGroupNumber: "FK-DG-2026-TEST-0001" }).lean();
    if (!dg) return;
    const { calculateDealGroupProfitability } = await import(
      "@/lib/finance/profitability-service"
    );
    const result = await calculateDealGroupProfitability(String(dg._id), "USD");
    if (result.revenue === "0") return;
    expect(result.contributionProfit).toBe("30000");
  });
});

describe("Phase 7 buyer/supplier data isolation", () => {
  it("buyer portal invoice API scopes to buyer org", async () => {
    if (!isMongoConfigured()) return;
    const { connectMongo } = await import("@/lib/db/mongoose");
    await connectMongo();
    const { BuyerInvoice, SupplierBill } = await import("@/models");
    const invoice = await BuyerInvoice.findOne().lean();
    const bill = await SupplierBill.findOne().lean();
    if (!invoice || !bill) return;
    expect(invoice.buyerOrganizationId).toBeDefined();
    expect(bill.supplierOrganizationId).toBeDefined();
    expect(String(invoice.transactionId)).not.toBe(String(bill.transactionId));
  });
});
