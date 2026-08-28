import { Types } from "mongoose";
import { money } from "@/lib/finance/money";
import { writeAuditEvent } from "@/lib/audit/log";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { allocateFinanceNumber } from "@/lib/finance/number";
import { getApprovedFxRate } from "@/lib/finance/invoice-service";

export async function createCostEntry(input: {
  entryType: "procurement_cost" | "direct_cost" | "fee" | "commission";
  costCategoryCode: string;
  description: string;
  originalAmount: string;
  currency: string;
  entryDate: string;
  transactionId?: string;
  shipmentLotId?: string;
  dealGroupId?: string;
  bankingInstrumentId?: string;
  organizationId?: string;
  actorUserId: string;
  buyerVisible?: boolean;
  supplierVisible?: boolean;
}) {
  await tryConnectMongo();
  const { FinancialEntry, FinancialSettings } = await import("@/models");

  const settings = await FinancialSettings.findOne().lean();
  const baseCurrency = settings?.baseReportingCurrency ?? "USD";
  const entryDate = new Date(input.entryDate);
  const fx = await getApprovedFxRate(input.currency, baseCurrency, entryDate);
  const converted = money(input.originalAmount).times(money(fx.rate));

  const entryNumber = await allocateFinanceNumber("FIN");
  const entry = await FinancialEntry.create({
    entryNumber,
    entryType: input.entryType,
    transactionId: input.transactionId ? new Types.ObjectId(input.transactionId) : undefined,
    shipmentLotId: input.shipmentLotId ? new Types.ObjectId(input.shipmentLotId) : undefined,
    dealGroupId: input.dealGroupId ? new Types.ObjectId(input.dealGroupId) : undefined,
    bankingInstrumentId: input.bankingInstrumentId
      ? new Types.ObjectId(input.bankingInstrumentId)
      : undefined,
    organizationId: input.organizationId ? new Types.ObjectId(input.organizationId) : undefined,
    costCategoryCode: input.costCategoryCode,
    description: input.description,
    originalCurrency: input.currency,
    originalAmount: Types.Decimal128.fromString(money(input.originalAmount).toString()),
    baseCurrency,
    fxRate: Types.Decimal128.fromString(fx.rate),
    fxRateDate: entryDate,
    fxRateSource: fx.source,
    convertedAmount: Types.Decimal128.fromString(converted.toString()),
    entryDate,
    createdByUserId: new Types.ObjectId(input.actorUserId),
    status: "draft",
    buyerVisible: input.buyerVisible ?? false,
    supplierVisible: input.supplierVisible ?? false,
  });

  await writeAuditEvent({
    action: "financial_entry.created",
    targetType: "financial_entry",
    targetId: String(entry._id),
    actorUserId: input.actorUserId,
    result: "success",
  });

  return entry;
}

export async function approveFinancialEntry(input: {
  entryId: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { FinancialEntry, FinancialSettings } = await import("@/models");
  const entry = await FinancialEntry.findById(input.entryId);
  if (!entry || entry.status !== "draft") throw new Error("invalid_state");

  const settings = await FinancialSettings.findOne().lean();
  if (settings?.separationOfDutiesEnabled && String(entry.createdByUserId) === input.actorUserId) {
    throw new Error("separation_of_duties");
  }

  entry.status = "approved";
  entry.approvedByUserId = new Types.ObjectId(input.actorUserId);
  await entry.save();
  return entry;
}

export async function postFinancialEntry(input: {
  entryId: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { FinancialEntry, FinancialPeriod } = await import("@/models");
  const entry = await FinancialEntry.findById(input.entryId);
  if (!entry || entry.status !== "approved") throw new Error("not_approved");

  const closedPeriod = await FinancialPeriod.findOne({
    status: "closed",
    startDate: { $lte: entry.entryDate },
    endDate: { $gte: entry.entryDate },
  }).lean();
  if (closedPeriod) throw new Error("period_closed");

  entry.status = "posted";
  entry.postedByUserId = new Types.ObjectId(input.actorUserId);
  await entry.save();

  await writeAuditEvent({
    action: "financial_entry.posted",
    targetType: "financial_entry",
    targetId: String(entry._id),
    actorUserId: input.actorUserId,
    result: "success",
  });

  return entry;
}

export async function reverseFinancialEntry(input: {
  entryId: string;
  reason: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { FinancialEntry } = await import("@/models");
  const original = await FinancialEntry.findById(input.entryId);
  if (!original || original.status !== "posted") throw new Error("not_posted");

  original.status = "reversed";
  original.reversalReason = input.reason;
  await original.save();

  const reversalNumber = await allocateFinanceNumber("FIN");
  const reversal = await FinancialEntry.create({
    entryNumber: reversalNumber,
    entryType: "reversal",
    transactionId: original.transactionId,
    shipmentLotId: original.shipmentLotId,
    dealGroupId: original.dealGroupId,
    description: `Reversal of ${original.entryNumber}: ${input.reason}`,
    originalCurrency: original.originalCurrency,
    originalAmount: Types.Decimal128.fromString(money(original.originalAmount.toString()).neg().toString()),
    baseCurrency: original.baseCurrency,
    fxRate: original.fxRate,
    fxRateDate: original.fxRateDate,
    fxRateSource: original.fxRateSource,
    convertedAmount: Types.Decimal128.fromString(money(original.convertedAmount.toString()).neg().toString()),
    entryDate: new Date(),
    createdByUserId: new Types.ObjectId(input.actorUserId),
    status: "posted",
    postedByUserId: new Types.ObjectId(input.actorUserId),
    reversalOfEntryId: original._id,
    buyerVisible: original.buyerVisible,
    supplierVisible: original.supplierVisible,
  });

  original.reversalEntryId = reversal._id;
  await original.save();

  await writeAuditEvent({
    action: "financial_entry.reversed",
    targetType: "financial_entry",
    targetId: String(original._id),
    actorUserId: input.actorUserId,
    result: "success",
    metadata: { reversalId: String(reversal._id) },
  });

  return reversal;
}
