import { Types } from "mongoose";
import { money } from "@/lib/finance/money";
import { writeAuditEvent } from "@/lib/audit/log";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { allocateFinanceNumber } from "@/lib/finance/number";
import { calculateTax, decimal128, roundMoney } from "@/lib/finance/calculations";

const QA_MARKER = "TEST DOCUMENT — NOT VALID — FOR SOFTWARE QA ONLY";

export async function getApprovedFxRate(
  baseCurrency: string,
  quoteCurrency: string,
  rateDate: Date,
): Promise<{ rate: string; source: string }> {
  if (baseCurrency === quoteCurrency) return { rate: "1", source: "parity" };
  await tryConnectMongo();
  const { FXRate } = await import("@/models");
  const fx = await FXRate.findOne({
    baseCurrency,
    quoteCurrency,
    rateDate: { $lte: rateDate },
    status: "approved",
  })
    .sort({ rateDate: -1 })
    .lean();
  if (!fx) throw new Error("fx_rate_missing");
  return { rate: fx.rate.toString(), source: fx.source };
}

export async function createBuyerInvoiceDraft(input: {
  buyerOrganizationId: string;
  transactionId: string;
  shipmentLotId?: string;
  currency: string;
  lineItems: Array<{
    description: string;
    quantity?: string;
    unit?: string;
    unitPrice: string;
    taxCode?: string;
    taxRatePercent?: string;
    taxInclusive?: boolean;
    recoverable?: boolean;
  }>;
  invoiceDate: string;
  dueDate: string;
  contractReference?: string;
  actorUserId: string;
  applyTax?: boolean;
}) {
  await tryConnectMongo();
  const { BuyerInvoice } = await import("@/models");

  const invoiceNumber = await allocateFinanceNumber("INV");
  const lineItems: Array<Record<string, unknown>> = [];
  let subtotal = money(0);
  let totalTax = money(0);
  const taxBreakdown: Record<string, Types.Decimal128> = {};

  for (const line of input.lineItems) {
    const qty = line.quantity ? money(line.quantity) : money(1);
    const lineSub = roundMoney(qty.times(money(line.unitPrice)));
    let taxResult = {
      subtotal: lineSub,
      taxAmount: money(0),
      total: lineSub,
      recoverableTax: money(0),
      nonRecoverableTax: money(0),
    };
    if (input.applyTax && line.taxCode && line.taxRatePercent) {
      taxResult = calculateTax({
        subtotal: lineSub,
        taxCode: line.taxCode,
        ratePercent: line.taxRatePercent,
        taxInclusive: line.taxInclusive,
        recoverable: line.recoverable,
      });
    }
    subtotal = subtotal.plus(taxResult.subtotal);
    totalTax = totalTax.plus(taxResult.taxAmount);
    if (line.taxCode) {
      const key = line.taxCode;
      const existing = taxBreakdown[key] ? money(taxBreakdown[key].toString()) : money(0);
      taxBreakdown[key] = Types.Decimal128.fromString(
        existing.plus(taxResult.taxAmount).toString(),
      );
    }
    lineItems.push({
      description: line.description,
      quantity: line.quantity ? Types.Decimal128.fromString(line.quantity) : undefined,
      unit: line.unit,
      unitPrice: Types.Decimal128.fromString(line.unitPrice),
      subtotal: Types.Decimal128.fromString(taxResult.subtotal.toString()),
      taxCode: line.taxCode,
      taxAmount: Types.Decimal128.fromString(taxResult.taxAmount.toString()),
      total: Types.Decimal128.fromString(taxResult.total.toString()),
      transactionId: new Types.ObjectId(input.transactionId),
      shipmentLotId: input.shipmentLotId ? new Types.ObjectId(input.shipmentLotId) : undefined,
    });
  }

  const total = subtotal.plus(totalTax);
  const invoice = await BuyerInvoice.create({
    invoiceNumber,
    buyerOrganizationId: new Types.ObjectId(input.buyerOrganizationId),
    transactionId: new Types.ObjectId(input.transactionId),
    shipmentLotId: input.shipmentLotId ? new Types.ObjectId(input.shipmentLotId) : undefined,
    contractReference: input.contractReference,
    invoiceDate: new Date(input.invoiceDate),
    dueDate: new Date(input.dueDate),
    currency: input.currency,
    lineItems,
    subtotal: Types.Decimal128.fromString(subtotal.toString()),
    taxBreakdown,
    total: Types.Decimal128.fromString(total.toString()),
    amountPaid: Types.Decimal128.fromString("0"),
    balance: Types.Decimal128.fromString(total.toString()),
    status: "draft",
    createdByUserId: new Types.ObjectId(input.actorUserId),
    accountingSyncStatus: "not_configured",
    qaMarker: QA_MARKER,
  });

  await writeAuditEvent({
    action: "buyer_invoice.created",
    targetType: "buyer_invoice",
    targetId: String(invoice._id),
    actorUserId: input.actorUserId,
    result: "success",
  });

  return invoice;
}

export async function approveBuyerInvoice(input: {
  invoiceId: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { BuyerInvoice } = await import("@/models");
  const invoice = await BuyerInvoice.findById(input.invoiceId);
  if (!invoice || invoice.status !== "draft" && invoice.status !== "under_review") {
    throw new Error("invalid_invoice_state");
  }
  invoice.status = "approved";
  invoice.approvedByUserId = new Types.ObjectId(input.actorUserId);
  await invoice.save();
  await writeAuditEvent({
    action: "buyer_invoice.approved",
    targetType: "buyer_invoice",
    targetId: String(invoice._id),
    actorUserId: input.actorUserId,
    result: "success",
  });
  return invoice;
}

export async function issueBuyerInvoice(input: {
  invoiceId: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { BuyerInvoice, PaymentSchedule } = await import("@/models");
  const invoice = await BuyerInvoice.findById(input.invoiceId);
  if (!invoice || invoice.status !== "approved") throw new Error("not_approved");

  invoice.status = "issued";
  invoice.issuedByUserId = new Types.ObjectId(input.actorUserId);
  invoice.issuedAt = new Date();
  await invoice.save();

  await PaymentSchedule.create({
    transactionId: invoice.transactionId,
    buyerInvoiceId: invoice._id,
    paymentType: "buyer_receivable",
    expectedAmount: invoice.total,
    currency: invoice.currency,
    expectedDate: invoice.dueDate,
    status: "due",
    createdByUserId: new Types.ObjectId(input.actorUserId),
  });

  await writeAuditEvent({
    action: "buyer_invoice.issued",
    targetType: "buyer_invoice",
    targetId: String(invoice._id),
    actorUserId: input.actorUserId,
    result: "success",
  });

  return invoice;
}

export async function createSupplierBill(input: {
  supplierOrganizationId: string;
  transactionId: string;
  shipmentLotId?: string;
  supplierInvoiceReference?: string;
  currency: string;
  total: string;
  description: string;
  invoiceDate: string;
  dueDate: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { SupplierBill } = await import("@/models");
  const billNumber = await allocateFinanceNumber("BILL");
  const total = money(input.total);

  const bill = await SupplierBill.create({
    billNumber,
    supplierInvoiceReference: input.supplierInvoiceReference,
    supplierOrganizationId: new Types.ObjectId(input.supplierOrganizationId),
    transactionId: new Types.ObjectId(input.transactionId),
    shipmentLotId: input.shipmentLotId ? new Types.ObjectId(input.shipmentLotId) : undefined,
    invoiceDate: new Date(input.invoiceDate),
    dueDate: new Date(input.dueDate),
    currency: input.currency,
    lineItems: [
      {
        description: input.description,
        subtotal: Types.Decimal128.fromString(total.toString()),
        total: Types.Decimal128.fromString(total.toString()),
        transactionId: new Types.ObjectId(input.transactionId),
        shipmentLotId: input.shipmentLotId ? new Types.ObjectId(input.shipmentLotId) : undefined,
        costCategoryCode: "procurement",
      },
    ],
    total: Types.Decimal128.fromString(total.toString()),
    amountPaid: Types.Decimal128.fromString("0"),
    balance: Types.Decimal128.fromString(total.toString()),
    status: "received",
    createdByUserId: new Types.ObjectId(input.actorUserId),
    accountingSyncStatus: "not_configured",
    qaMarker: QA_MARKER,
  });

  await writeAuditEvent({
    action: "supplier_bill.created",
    targetType: "supplier_bill",
    targetId: String(bill._id),
    actorUserId: input.actorUserId,
    result: "success",
  });

  return bill;
}

export async function postSupplierBill(input: {
  billId: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { SupplierBill, PaymentSchedule } = await import("@/models");
  const bill = await SupplierBill.findById(input.billId);
  if (!bill || bill.status !== "approved") throw new Error("not_approved");

  bill.status = "posted";
  bill.postedByUserId = new Types.ObjectId(input.actorUserId);
  bill.postedAt = new Date();
  await bill.save();

  await PaymentSchedule.create({
    transactionId: bill.transactionId,
    supplierBillId: bill._id,
    paymentType: "supplier_payable",
    expectedAmount: bill.total,
    currency: bill.currency,
    expectedDate: bill.dueDate,
    status: "due",
    createdByUserId: new Types.ObjectId(input.actorUserId),
  });

  await writeAuditEvent({
    action: "supplier_bill.posted",
    targetType: "supplier_bill",
    targetId: String(bill._id),
    actorUserId: input.actorUserId,
    result: "success",
  });

  return bill;
}

export async function approveSupplierBill(input: {
  billId: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { SupplierBill } = await import("@/models");
  const bill = await SupplierBill.findById(input.billId);
  if (!bill) throw new Error("not_found");
  bill.status = "approved";
  bill.approvedByUserId = new Types.ObjectId(input.actorUserId);
  await bill.save();
  return bill;
}
