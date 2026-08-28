import { NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { calculateTransactionProfitability } from "@/lib/finance/profitability-service";
import { money } from "@/lib/finance/money";

export const runtime = "nodejs";

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "finance:read" });
    if ("error" in auth) return auth.error;

    const {
      BuyerInvoice,
      SupplierBill,
      PaymentRecord,
      FinancialEntry,
    } = await import("@/models");

    const issuedInvoices = await BuyerInvoice.find({
      status: { $in: ["issued", "partially_paid", "paid"] },
    }).lean();
    const postedBills = await SupplierBill.find({
      status: { $in: ["posted", "partially_paid", "paid"] },
    }).lean();

    let revenue = money(0);
    let receivables = money(0);
    for (const inv of issuedInvoices) {
      revenue = revenue.plus(money(inv.total.toString()));
      receivables = receivables.plus(money(inv.balance.toString()));
    }

    let procurement = money(0);
    let payables = money(0);
    for (const bill of postedBills) {
      procurement = procurement.plus(money(bill.total.toString()));
      payables = payables.plus(money(bill.balance.toString()));
    }

    const directEntries = await FinancialEntry.find({
      entryType: "direct_cost",
      status: "posted",
    }).lean();
    let directCosts = money(0);
    for (const e of directEntries) directCosts = directCosts.plus(money(e.convertedAmount.toString()));

    const margin = revenue.minus(procurement);
    const contribution = margin.minus(directCosts);

    const pendingPayments = await PaymentRecord.countDocuments({
      status: "pending_verification",
    });

    return NextResponse.json({
      labels: {
        revenue: "Operational Revenue",
        procurementCost: "Procurement Cost",
        grossTradingMargin: "Gross Trading Margin",
        directOperationalCosts: "Direct Operational Costs",
        contributionProfit: "Contribution Profit",
        receivables: "Accounts Receivable",
        payables: "Accounts Payable",
      },
      currency: "USD",
      revenue: revenue.toString(),
      procurementCost: procurement.toString(),
      grossTradingMargin: margin.toString(),
      directOperationalCosts: directCosts.toString(),
      contributionProfit: contribution.toString(),
      receivables: receivables.toString(),
      payables: payables.toString(),
      pendingPaymentVerifications: pendingPayments,
      disclaimer:
        "Operational trading-finance figures only — not audited corporate net income or official tax liability.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
