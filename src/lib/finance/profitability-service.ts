import { money } from "@/lib/finance/money";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { calculateProfitability } from "@/lib/finance/calculations";
import { Types } from "mongoose";

export type CostBreakdown = Record<string, string>;

export async function sumDirectCostsByCategory(
  filter: Record<string, unknown>,
): Promise<{ total: string; breakdown: CostBreakdown }> {
  await tryConnectMongo();
  const { FinancialEntry } = await import("@/models");
  const entries = await FinancialEntry.find({
    ...filter,
    entryType: "direct_cost",
    status: "posted",
  }).lean();

  const breakdown: CostBreakdown = {};
  let total = money(0);
  for (const e of entries) {
    const code = e.costCategoryCode ?? "other";
    const amt = money(e.convertedAmount.toString());
    breakdown[code] = breakdown[code]
      ? money(breakdown[code]).plus(amt).toString()
      : amt.toString();
    total = total.plus(amt);
  }
  return { total: total.toString(), breakdown };
}

export async function calculateTransactionProfitability(transactionId: string, currency = "USD") {
  await tryConnectMongo();
  const { BuyerInvoice, SupplierBill } = await import("@/models");

  const issuedInvoices = await BuyerInvoice.find({
    transactionId: new Types.ObjectId(transactionId),
    status: { $in: ["issued", "partially_paid", "paid"] },
  }).lean();

  let revenue = money(0);
  for (const inv of issuedInvoices) revenue = revenue.plus(money(inv.total.toString()));

  const postedBills = await SupplierBill.find({
    transactionId: new Types.ObjectId(transactionId),
    status: { $in: ["posted", "partially_paid", "paid"] },
  }).lean();

  let procurement = money(0);
  for (const bill of postedBills) procurement = procurement.plus(money(bill.total.toString()));

  const { total: directStr, breakdown } = await sumDirectCostsByCategory({
    transactionId: new Types.ObjectId(transactionId),
  });

  const result = calculateProfitability({
    revenue,
    procurementCost: procurement,
    directCosts: directStr,
    currency,
  });

  return { ...result, costBreakdown: breakdown };
}

export async function calculateShipmentLotProfitability(shipmentLotId: string, currency = "USD") {
  await tryConnectMongo();
  const { BuyerInvoice, SupplierBill, ShipmentLot, ShipmentLotAllocation } = await import("@/models");

  const lot = await ShipmentLot.findById(shipmentLotId).lean();
  if (!lot) throw new Error("not_found");

  const issuedInvoices = await BuyerInvoice.find({
    shipmentLotId: new Types.ObjectId(shipmentLotId),
    status: { $in: ["issued", "partially_paid", "paid"] },
  }).lean();

  let revenue = money(0);
  for (const inv of issuedInvoices) revenue = revenue.plus(money(inv.total.toString()));

  let procurement = money(0);
  const supplierLotIds: Types.ObjectId[] = [];
  const buyerAlloc = await ShipmentLotAllocation.findOne({
    buyerShipmentLotId: lot._id,
  }).lean();
  if (buyerAlloc?.supplierShipmentLotId) {
    supplierLotIds.push(buyerAlloc.supplierShipmentLotId);
  }
  const supplierAlloc = await ShipmentLotAllocation.findOne({
    supplierShipmentLotId: lot._id,
  }).lean();
  if (supplierAlloc?.buyerShipmentLotId) {
    supplierLotIds.push(lot._id);
  }

  if (lot.transactionSide === "supplier_purchase") {
    const bills = await SupplierBill.find({
      shipmentLotId: lot._id,
      status: { $in: ["posted", "partially_paid", "paid"] },
    }).lean();
    for (const bill of bills) procurement = procurement.plus(money(bill.total.toString()));
  } else if (supplierLotIds.length) {
    const bills = await SupplierBill.find({
      shipmentLotId: { $in: supplierLotIds },
      status: { $in: ["posted", "partially_paid", "paid"] },
    }).lean();
    for (const bill of bills) procurement = procurement.plus(money(bill.total.toString()));
  }

  const { total: directStr, breakdown } = await sumDirectCostsByCategory({
    shipmentLotId: new Types.ObjectId(shipmentLotId),
  });

  const result = calculateProfitability({
    revenue,
    procurementCost: procurement,
    directCosts: directStr,
    currency,
  });

  return { ...result, costBreakdown: breakdown, shipmentLotId };
}

export async function calculateDealGroupProfitability(dealGroupId: string, currency = "USD") {
  await tryConnectMongo();
  const { DealGroupTransaction, Transaction } = await import("@/models");

  const links = await DealGroupTransaction.find({
    dealGroupId: new Types.ObjectId(dealGroupId),
  }).lean();

  let revenue = money(0);
  let procurement = money(0);
  let direct = money(0);
  const costBreakdown: CostBreakdown = {};

  for (const link of links) {
    const tx = await Transaction.findById(link.transactionId).lean();
    if (!tx) continue;
    const result = await calculateTransactionProfitability(String(tx._id), currency);
    revenue = revenue.plus(money(result.revenue));
    procurement = procurement.plus(money(result.procurementCost));
    direct = direct.plus(money(result.directOperationalCosts));
    for (const [code, amt] of Object.entries(result.costBreakdown ?? {})) {
      costBreakdown[code] = costBreakdown[code]
        ? money(costBreakdown[code]).plus(money(amt)).toString()
        : amt;
    }
  }

  const result = calculateProfitability({
    revenue,
    procurementCost: procurement,
    directCosts: direct,
    currency,
  });

  return { ...result, costBreakdown };
}

export async function saveProfitabilitySnapshot(input: {
  transactionId?: string;
  dealGroupId?: string;
  shipmentLotId?: string;
  reportingPeriodLabel?: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { ProfitabilitySnapshot } = await import("@/models");

  let result;
  if (input.dealGroupId) {
    result = await calculateDealGroupProfitability(input.dealGroupId);
  } else if (input.shipmentLotId) {
    result = await calculateShipmentLotProfitability(input.shipmentLotId);
  } else if (input.transactionId) {
    result = await calculateTransactionProfitability(input.transactionId);
  } else {
    throw new Error("scope_required");
  }

  const snapshot = await ProfitabilitySnapshot.create({
    transactionId: input.transactionId ? new Types.ObjectId(input.transactionId) : undefined,
    dealGroupId: input.dealGroupId ? new Types.ObjectId(input.dealGroupId) : undefined,
    shipmentLotId: input.shipmentLotId ? new Types.ObjectId(input.shipmentLotId) : undefined,
    reportingPeriodLabel: input.reportingPeriodLabel,
    revenue: Types.Decimal128.fromString(result.revenue),
    procurementCost: Types.Decimal128.fromString(result.procurementCost),
    grossTradingMargin: Types.Decimal128.fromString(result.grossTradingMargin),
    directOperationalCosts: Types.Decimal128.fromString(result.directOperationalCosts),
    contributionProfit: Types.Decimal128.fromString(result.contributionProfit),
    currency: result.currency,
    calculationDate: new Date(),
    createdByUserId: new Types.ObjectId(input.actorUserId),
  });

  return { snapshot, result };
}
