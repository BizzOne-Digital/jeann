import { Types } from "mongoose";
import { money } from "@/lib/finance/money";
import { writeAuditEvent } from "@/lib/audit/log";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { allocateFinanceNumber } from "@/lib/finance/number";

export async function uploadPaymentEvidence(input: {
  paymentId: string;
  evidenceDocumentId: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { PaymentRecord } = await import("@/models");
  const payment = await PaymentRecord.findById(input.paymentId);
  if (!payment) throw new Error("not_found");

  payment.evidenceDocumentId = new Types.ObjectId(input.evidenceDocumentId);
  payment.verificationStatus = "pending";
  payment.status = "pending_verification";
  await payment.save();

  await writeAuditEvent({
    action: "payment.evidence_uploaded",
    targetType: "payment_record",
    targetId: String(payment._id),
    actorUserId: input.actorUserId,
    result: "success",
  });

  return payment;
}

export async function verifyPayment(input: {
  paymentId: string;
  actorUserId: string;
  approved: boolean;
}) {
  await tryConnectMongo();
  const { PaymentRecord } = await import("@/models");
  const payment = await PaymentRecord.findById(input.paymentId);
  if (!payment) throw new Error("not_found");
  if (payment.status !== "pending_verification" && payment.verificationStatus !== "pending") {
    throw new Error("not_pending_verification");
  }

  if (!input.approved) {
    payment.verificationStatus = "rejected";
    payment.status = "failed";
  } else {
    payment.verificationStatus = "verified";
    payment.status = "recorded";
    payment.verifiedByUserId = new Types.ObjectId(input.actorUserId);
    payment.verifiedAt = new Date();
  }
  await payment.save();

  await writeAuditEvent({
    action: "payment.verified",
    targetType: "payment_record",
    targetId: String(payment._id),
    actorUserId: input.actorUserId,
    result: "success",
    metadata: { approved: input.approved },
  });

  return payment;
}

export async function createPaymentRecord(input: {
  direction: "incoming" | "outgoing";
  payerOrganizationId?: string;
  payeeOrganizationId?: string;
  amount: string;
  currency: string;
  paymentDate: string;
  method?: string;
  bankReference?: string;
  bankingInstrumentId?: string;
  actorUserId: string;
  buyerVisible?: boolean;
  supplierVisible?: boolean;
  autoVerify?: boolean;
}) {
  await tryConnectMongo();
  const { PaymentRecord } = await import("@/models");
  const paymentNumber = await allocateFinanceNumber("PAY");

  const payment = await PaymentRecord.create({
    paymentNumber,
    direction: input.direction,
    payerOrganizationId: input.payerOrganizationId
      ? new Types.ObjectId(input.payerOrganizationId)
      : undefined,
    payeeOrganizationId: input.payeeOrganizationId
      ? new Types.ObjectId(input.payeeOrganizationId)
      : undefined,
    originalAmount: Types.Decimal128.fromString(money(input.amount).toString()),
    currency: input.currency,
    paymentDate: new Date(input.paymentDate),
    method: input.method,
    bankReference: input.bankReference,
    bankingInstrumentId: input.bankingInstrumentId
      ? new Types.ObjectId(input.bankingInstrumentId)
      : undefined,
    verificationStatus: input.autoVerify ? "verified" : "unverified",
    status: input.autoVerify ? "recorded" : "planned",
    createdByUserId: new Types.ObjectId(input.actorUserId),
    buyerVisible: input.buyerVisible ?? false,
    supplierVisible: input.supplierVisible ?? false,
  });

  await writeAuditEvent({
    action: "payment.created",
    targetType: "payment_record",
    targetId: String(payment._id),
    actorUserId: input.actorUserId,
    result: "success",
  });

  return payment;
}

export async function allocatePayment(input: {
  paymentId: string;
  buyerInvoiceId?: string;
  supplierBillId?: string;
  allocatedAmount: string;
  currency: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { PaymentAllocation, PaymentRecord, BuyerInvoice, SupplierBill } = await import("@/models");

  const payment = await PaymentRecord.findById(input.paymentId);
  if (!payment) throw new Error("payment_not_found");
  if (payment.verificationStatus !== "verified" && payment.status !== "recorded") {
    throw new Error("payment_not_verified");
  }

  const allocAmount = money(input.allocatedAmount);
  const paymentAmount = money(payment.originalAmount.toString());
  const existing = await PaymentAllocation.find({
    paymentRecordId: payment._id,
    reversed: false,
  }).lean();
  let allocatedSoFar = money(0);
  for (const a of existing) allocatedSoFar = allocatedSoFar.plus(money(a.allocatedAmount.toString()));
  if (allocatedSoFar.plus(allocAmount).gt(paymentAmount.plus(money("0.01")))) {
    throw new Error("over_allocation");
  }

  const allocation = await PaymentAllocation.create({
    paymentRecordId: payment._id,
    buyerInvoiceId: input.buyerInvoiceId ? new Types.ObjectId(input.buyerInvoiceId) : undefined,
    supplierBillId: input.supplierBillId ? new Types.ObjectId(input.supplierBillId) : undefined,
    allocatedAmount: Types.Decimal128.fromString(allocAmount.toString()),
    currency: input.currency,
    allocationDate: new Date(),
    createdByUserId: new Types.ObjectId(input.actorUserId),
  });

  if (input.buyerInvoiceId) {
    const invoice = await BuyerInvoice.findById(input.buyerInvoiceId);
    if (invoice) {
      const paid = money(invoice.amountPaid.toString()).plus(allocAmount);
      const balance = money(invoice.total.toString()).minus(paid);
      invoice.amountPaid = Types.Decimal128.fromString(paid.toString());
      invoice.balance = Types.Decimal128.fromString(balance.toString());
      invoice.status = balance.lte(0) ? "paid" : "partially_paid";
      await invoice.save();
    }
  }

  if (input.supplierBillId) {
    const bill = await SupplierBill.findById(input.supplierBillId);
    if (bill) {
      const paid = money(bill.amountPaid.toString()).plus(allocAmount);
      const balance = money(bill.total.toString()).minus(paid);
      bill.amountPaid = Types.Decimal128.fromString(paid.toString());
      bill.balance = Types.Decimal128.fromString(balance.toString());
      bill.status = balance.lte(0) ? "paid" : "partially_paid";
      await bill.save();
    }
  }

  const newTotal = allocatedSoFar.plus(allocAmount);
  payment.status = newTotal.gte(paymentAmount) ? "fully_allocated" : "partially_allocated";
  await payment.save();

  await writeAuditEvent({
    action: "payment.allocated",
    targetType: "payment_allocation",
    targetId: String(allocation._id),
    actorUserId: input.actorUserId,
    result: "success",
  });

  return allocation;
}
