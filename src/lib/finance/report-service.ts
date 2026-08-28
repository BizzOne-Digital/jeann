import { money } from "@/lib/finance/money";
import { writeAuditEvent } from "@/lib/audit/log";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { calculateProfitability } from "@/lib/finance/calculations";
import { Types } from "mongoose";

export type ReportPeriod = "daily" | "monthly" | "quarterly" | "yearly" | "custom";

export type PeriodReport = {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  currency: string;
  revenue: string;
  procurementCost: string;
  grossTradingMargin: string;
  directOperationalCosts: string;
  contributionProfit: string;
  receivables: string;
  payables: string;
  overdueInvoices: number;
  upcomingPayments: number;
  bankFees: string;
  commissions: string;
  taxSummary: Record<string, string>;
  claimsSettlements: number;
  disclaimer: string;
};

function parseRange(
  period: ReportPeriod,
  startDate?: string,
  endDate?: string,
): { start: Date; end: Date } {
  const now = new Date();
  if (period === "custom" && startDate && endDate) {
    return { start: new Date(startDate), end: new Date(endDate) };
  }
  if (period === "daily") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }
  if (period === "monthly") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { start, end };
  }
  if (period === "quarterly") {
    const q = Math.floor(now.getMonth() / 3);
    const start = new Date(now.getFullYear(), q * 3, 1);
    const end = new Date(now.getFullYear(), q * 3 + 3, 0, 23, 59, 59, 999);
    return { start, end };
  }
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
  return { start, end };
}

export async function generatePeriodReport(input: {
  period: ReportPeriod;
  startDate?: string;
  endDate?: string;
  currency?: string;
}): Promise<PeriodReport> {
  await tryConnectMongo();
  const {
    BuyerInvoice,
    SupplierBill,
    FinancialEntry,
    PaymentSchedule,
    CommissionRecord,
    ClaimSettlement,
  } = await import("@/models");

  const currency = input.currency ?? "USD";
  const { start, end } = parseRange(input.period, input.startDate, input.endDate);

  const invoices = await BuyerInvoice.find({
    status: { $in: ["issued", "partially_paid", "paid", "overdue"] },
    invoiceDate: { $gte: start, $lte: end },
  }).lean();

  let revenue = money(0);
  let receivables = money(0);
  const taxSummary: Record<string, string> = {};
  for (const inv of invoices) {
    revenue = revenue.plus(money(inv.total.toString()));
    receivables = receivables.plus(money(inv.balance.toString()));
    if (inv.taxBreakdown) {
      for (const [code, val] of Object.entries(inv.taxBreakdown)) {
        const amt = money((val as { toString(): string }).toString());
        taxSummary[code] = taxSummary[code]
          ? money(taxSummary[code]).plus(amt).toString()
          : amt.toString();
      }
    }
  }

  const bills = await SupplierBill.find({
    status: { $in: ["posted", "partially_paid", "paid"] },
    invoiceDate: { $gte: start, $lte: end },
  }).lean();

  let procurement = money(0);
  let payables = money(0);
  for (const bill of bills) {
    procurement = procurement.plus(money(bill.total.toString()));
    payables = payables.plus(money(bill.balance.toString()));
  }

  const directEntries = await FinancialEntry.find({
    entryType: "direct_cost",
    status: "posted",
    entryDate: { $gte: start, $lte: end },
  }).lean();

  let direct = money(0);
  let bankFees = money(0);
  for (const e of directEntries) {
    const amt = money(e.convertedAmount.toString());
    direct = direct.plus(amt);
    if (e.costCategoryCode === "bank_fees" || e.costCategoryCode === "amendment_fees") {
      bankFees = bankFees.plus(amt);
    }
  }

  const commissions = await CommissionRecord.find({
    approvalStatus: "approved",
    createdAt: { $gte: start, $lte: end },
  }).lean();
  let commissionTotal = money(0);
  for (const c of commissions) {
    commissionTotal = commissionTotal.plus(money(c.calculatedAmount.toString()));
  }

  const overdueInvoices = await BuyerInvoice.countDocuments({
    status: "overdue",
    dueDate: { $lte: end },
  });

  const upcomingPayments = await PaymentSchedule.countDocuments({
    status: "due",
    expectedDate: { $gte: start, $lte: end },
  });

  const claimsSettlements = await ClaimSettlement.countDocuments({
    approvalStatus: { $in: ["approved", "paid", "closed"] },
    createdAt: { $gte: start, $lte: end },
  });

  const calc = calculateProfitability({
    revenue,
    procurementCost: procurement,
    directCosts: direct,
    currency,
  });

  return {
    period: input.period,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    currency,
    revenue: calc.revenue,
    procurementCost: calc.procurementCost,
    grossTradingMargin: calc.grossTradingMargin,
    directOperationalCosts: calc.directOperationalCosts,
    contributionProfit: calc.contributionProfit,
    receivables: receivables.toString(),
    payables: payables.toString(),
    overdueInvoices,
    upcomingPayments,
    bankFees: bankFees.toString(),
    commissions: commissionTotal.toString(),
    taxSummary,
    claimsSettlements,
    disclaimer:
      "Operational period report — not audited corporate net income or official tax liability.",
  };
}

export function periodReportToCsv(report: PeriodReport): string {
  const rows = [
    ["Metric", "Value", "Currency"],
    ["Operational Revenue", report.revenue, report.currency],
    ["Procurement Cost", report.procurementCost, report.currency],
    ["Gross Trading Margin", report.grossTradingMargin, report.currency],
    ["Direct Operational Costs", report.directOperationalCosts, report.currency],
    ["Contribution Profit", report.contributionProfit, report.currency],
    ["Accounts Receivable", report.receivables, report.currency],
    ["Accounts Payable", report.payables, report.currency],
    ["Bank Fees", report.bankFees, report.currency],
    ["Commissions", report.commissions, report.currency],
    ["Overdue Invoices", String(report.overdueInvoices), ""],
    ["Upcoming Payments", String(report.upcomingPayments), ""],
    ["Claims Settlements", String(report.claimsSettlements), ""],
  ];
  for (const [code, amt] of Object.entries(report.taxSummary)) {
    rows.push([`Tax ${code}`, amt, report.currency]);
  }
  return rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
}

export async function exportPeriodReport(input: {
  period: ReportPeriod;
  startDate?: string;
  endDate?: string;
  actorUserId: string;
}): Promise<{ report: PeriodReport; csv: string }> {
  const report = await generatePeriodReport(input);
  await writeAuditEvent({
    action: "finance.report_exported",
    targetType: "period_report",
    targetId: `${input.period}:${report.startDate}`,
    actorUserId: input.actorUserId,
    result: "success",
    metadata: { period: input.period },
  });
  return { report, csv: periodReportToCsv(report) };
}

export async function listCanadianLocalPurchases(input?: { startDate?: string; endDate?: string }) {
  await tryConnectMongo();
  const { SupplierBill, TaxCode } = await import("@/models");

  const canadianCodes = await TaxCode.find({
    jurisdictionCode: { $regex: /^CA/i },
    active: true,
  }).lean();
  const codes = canadianCodes.map((t) => t.taxCode);

  const dateFilter =
    input?.startDate && input?.endDate
      ? { invoiceDate: { $gte: new Date(input.startDate), $lte: new Date(input.endDate) } }
      : {};

  const bills = await SupplierBill.find({
    status: { $in: ["posted", "partially_paid", "paid"] },
    ...dateFilter,
  }).lean();

  const items = bills
    .filter((b) => {
      if (!b.lineItems?.length) return false;
      return b.lineItems.some((li: { taxCode?: string }) => li.taxCode && codes.includes(li.taxCode));
    })
    .map((b) => ({
      id: String(b._id),
      billNumber: b.billNumber,
      total: b.total?.toString(),
      currency: b.currency,
      invoiceDate: b.invoiceDate,
    }));

  return {
    filter: "canadian_local_purchase",
    count: items.length,
    items,
    disclaimer: "Operational tax filter — accountant review required for filing.",
  };
}
