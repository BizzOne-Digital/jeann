import { Types } from "mongoose";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { money } from "@/lib/finance/money";
import {
  buildTransactionFinanceRow,
  matchesSearch,
  normalizeRate,
  CANADA_HST_RATE,
  rollupRows,
  type RollupGranularity,
  type TransactionFinanceRow,
} from "@/lib/finance/transaction-summary";

export interface FinanceSummaryFilter {
  q?: string;
  status?: string;
  transactionId?: string;
  from?: Date;
  to?: Date;
  limit?: number;
}

/** HST rate from TaxConfiguration (newest effective HST row), falling back to 13%. */
export async function getCanadaHstRate(): Promise<{ rate: string; source: "tax_configuration" | "default" }> {
  await tryConnectMongo();
  const { TaxConfiguration } = await import("@/models");
  const row = await TaxConfiguration.findOne({
    code: { $in: ["HST_ON", "HST", "GST_HST"] },
    effectiveFrom: { $lte: new Date() },
  })
    .sort({ effectiveFrom: -1 })
    .lean();
  const rate = normalizeRate(row?.rateString);
  return rate ? { rate, source: "tax_configuration" } : { rate: CANADA_HST_RATE, source: "default" };
}

const BANK_CODES = ["bank_fees", "amendment_fees"];

/** Internal-only: callers MUST enforce finance:read + isInternal before using. */
export async function loadTransactionFinanceRows(filter: FinanceSummaryFilter = {}) {
  await tryConnectMongo();
  const { Transaction, BuyerInvoice, SupplierBill, FinancialEntry, CommissionRecord, Organization, Product, ShipmentLot, FinancialSettings } =
    await import("@/models");
  const hst = await getCanadaHstRate();
  const settings = await FinancialSettings.findOne().lean();
  const baseCurrency: string = settings?.baseReportingCurrency ?? "USD";

  const txFilter: Record<string, unknown> = { deletedAt: null };
  if (filter.status) txFilter.status = filter.status;
  if (filter.transactionId) {
    if (!Types.ObjectId.isValid(filter.transactionId)) return { rows: [] as TransactionFinanceRow[], hst };
    txFilter._id = new Types.ObjectId(filter.transactionId);
  }
  const txs = await Transaction.find(txFilter)
    .sort({ createdAt: -1 })
    .limit(filter.limit ?? 2000)
    .lean();
  if (txs.length === 0) return { rows: [] as TransactionFinanceRow[], hst };
  const ids = txs.map((t) => t._id);

  const [lots, invoices, bills, entries, commissions] = await Promise.all([
    ShipmentLot.find({ transactionId: { $in: ids }, deliveryDate: { $ne: null } }).lean(),
    BuyerInvoice.find({
      transactionId: { $in: ids },
      status: { $in: ["issued", "partially_paid", "paid", "overdue"] },
    }).lean(),
    SupplierBill.find({
      transactionId: { $in: ids },
      status: { $in: ["posted", "partially_paid", "paid"] },
    }).lean(),
    FinancialEntry.find({
      transactionId: { $in: ids },
      status: "posted",
      entryType: { $in: ["direct_cost", "fee"] },
    }).lean(),
    CommissionRecord.find({ transactionId: { $in: ids }, approvalStatus: "approved" }).lean(),
  ]);

  const orgIds = new Set<string>();
  for (const t of txs) {
    orgIds.add(String(t.organizationId));
    if (t.counterpartyOrgId) orgIds.add(String(t.counterpartyOrgId));
  }
  for (const b of bills) orgIds.add(String(b.supplierOrganizationId));
  const orgs = await Organization.find({
    _id: { $in: [...orgIds].map((i) => new Types.ObjectId(i)) },
  }).lean();
  const orgById = new Map(orgs.map((o) => [String(o._id), o]));
  const productIds = txs.map((t) => t.productId).filter(Boolean);
  const products = productIds.length ? await Product.find({ _id: { $in: productIds } }).lean() : [];
  const productById = new Map(products.map((p) => [String(p._id), p]));

  const byTx = <T extends { transactionId?: unknown }>(list: T[]) => {
    const m = new Map<string, T[]>();
    for (const x of list) {
      const k = String(x.transactionId);
      m.set(k, [...(m.get(k) ?? []), x]);
    }
    return m;
  };
  const invBy = byTx(invoices);
  const billBy = byTx(bills);
  const entBy = byTx(entries);
  const comBy = byTx(commissions);
  const lotBy = byTx(lots);

  let rows: TransactionFinanceRow[] = txs.map((t) => {
    const k = String(t._id);
    const inv = invBy.get(k) ?? [];
    const bl = billBy.get(k) ?? [];
    let contract = money(0);
    for (const i of inv) contract = contract.plus(i.total.toString());
    if (inv.length === 0) {
      const snap = t.financeSnapshot?.lines?.find((l: { label: string }) => /contract/i.test(l.label));
      if (snap) contract = money(snap.amountDecimal.toString());
    }
    let purchasing = money(0);
    for (const b of bl) {
      let tax = money(0);
      for (const li of b.lineItems ?? []) {
        if (li.taxAmount) tax = tax.plus(li.taxAmount.toString());
      }
      purchasing = purchasing.plus(b.total.toString()).minus(tax);
    }
    const currency: string = inv[0]?.currency ?? bl[0]?.currency ?? baseCurrency;
    let unconverted = 0;
    const costAmount = (e: { convertedAmount: { toString(): string }; originalAmount: { toString(): string }; originalCurrency: string }) => {
      if (currency === baseCurrency) return money(e.convertedAmount.toString());
      if (e.originalCurrency === currency) return money(e.originalAmount.toString());
      unconverted += 1;
      return money(0);
    };
    let banking = money(0);
    let other = money(0);
    for (const e of entBy.get(k) ?? []) {
      const amt = costAmount(e);
      if (e.entryType === "fee" || BANK_CODES.includes(e.costCategoryCode ?? "")) banking = banking.plus(amt);
      else other = other.plus(amt);
    }
    let agent = money(0);
    for (const c of comBy.get(k) ?? []) {
      if (c.currency === currency) agent = agent.plus(c.calculatedAmount.toString());
      else unconverted += 1;
    }

    const buyerOrgId = t.side === "buyer" ? t.organizationId : t.counterpartyOrgId;
    const supplierOrgId =
      bl[0]?.supplierOrganizationId ?? (t.side === "supplier" ? t.organizationId : t.counterpartyOrgId);
    const supplierOrg = supplierOrgId ? orgById.get(String(supplierOrgId)) : undefined;
    const firstInv = inv.map((i) => new Date(i.invoiceDate).getTime()).sort((a, b) => a - b)[0];
    const firstDelivery = (lotBy.get(k) ?? []).map((l) => new Date(l.deliveryDate).getTime()).sort((a, b) => a - b)[0];

    return buildTransactionFinanceRow({
      transactionId: k,
      transactionNumber: t.transactionNumber,
      status: t.status,
      buyerName: buyerOrgId ? orgById.get(String(buyerOrgId))?.legalName : undefined,
      supplierName: supplierOrg?.legalName,
      productName: t.productId ? productById.get(String(t.productId))?.name : undefined,
      currency,
      unconvertedCosts: unconverted,
      periodSource: firstDelivery ? "delivery" : firstInv ? "invoice" : "created",
      periodDate: firstDelivery ? new Date(firstDelivery) : firstInv ? new Date(firstInv) : new Date(t.createdAt),
      hstRate: hst.rate,
      contractTotal: contract.toFixed(2),
      purchasingCost: purchasing.toFixed(2),
      bankingFees: banking.toFixed(2),
      agentFees: agent.toFixed(2),
      otherCosts: other.toFixed(2),
      canadianSupplier: supplierOrg?.country === "CA",
    });
  });

  const { from, to, q } = filter;
  if (from) rows = rows.filter((r) => new Date(r.periodDate) >= from);
  if (to) rows = rows.filter((r) => new Date(r.periodDate) <= to);
  if (q) rows = rows.filter((r) => matchesSearch(r, q));
  return { rows, hst };
}

export async function buildFinanceSummary(filter: FinanceSummaryFilter) {
  const { rows, hst } = await loadTransactionFinanceRows(filter);
  const rollups: Record<RollupGranularity, ReturnType<typeof rollupRows>> = {
    month: rollupRows(rows, "month"),
    quarter: rollupRows(rows, "quarter"),
    year: rollupRows(rows, "year"),
  };
  return {
    rows,
    hst,
    canadaRows: rows.filter((r) => r.canadianSupplier),
    rollups,
    disclaimer:
      "Operational figures as recorded; HST/GST at 13% is applied automatically to purchases from Canadian suppliers. Not audited and not an official tax filing.",
  };
}
