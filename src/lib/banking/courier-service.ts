import { Types } from "mongoose";
import { writeAuditEvent } from "@/lib/audit/log";
import { tryConnectMongo } from "@/lib/db/mongoose";

export const COURIER_STATUSES = [
  "prepared",
  "dispatched",
  "in_transit",
  "delivered",
  "delivery_failed",
  "returned",
  "cancelled",
] as const;
export const VERIFICATION_STATUSES = ["pending", "verified_authentic", "discrepancies_found"] as const;
export const PAYMENT_STATUSES = ["pending", "payment_confirmed", "payment_refused"] as const;

type Verification = (typeof VERIFICATION_STATUSES)[number];
type Payment = (typeof PAYMENT_STATUSES)[number];

/** Payment can only be confirmed after the buyer's bank verified the documents as authentic. */
export function canConfirmPayment(verification: Verification | undefined): boolean {
  return verification === "verified_authentic";
}

export function derivePaymentStage(rec: {
  status?: string;
  verificationStatus?: Verification;
  paymentStatus?: Payment;
}): "preparing" | "sent_to_buyer_bank" | "received_by_buyer_bank" | "verified_authentic" | "discrepancies" | "payment_confirmed" | "payment_refused" {
  if (rec.paymentStatus === "payment_confirmed") return "payment_confirmed";
  if (rec.paymentStatus === "payment_refused") return "payment_refused";
  if (rec.verificationStatus === "verified_authentic") return "verified_authentic";
  if (rec.verificationStatus === "discrepancies_found") return "discrepancies";
  if (rec.status === "delivered") return "received_by_buyer_bank";
  if (rec.status === "dispatched" || rec.status === "in_transit") return "sent_to_buyer_bank";
  return "preparing";
}

export async function createCourierRecord(input: {
  bankingInstrumentId: string;
  presentationPackageId?: string;
  courierCompany: string;
  trackingNumber?: string;
  sender: string;
  recipient: string;
  recipientBankName?: string;
  recipientAdviserName?: string;
  dispatchDate?: string;
  expectedDeliveryDate?: string;
  packageDescription?: string;
  actorUserId: string;
  senderIsAdviser?: boolean;
}) {
  await tryConnectMongo();
  const { CourierRecord, PresentationPackage } = await import("@/models");
  if (input.presentationPackageId) {
    const pkg = await PresentationPackage.findById(input.presentationPackageId).lean();
    if (!pkg || String(pkg.bankingInstrumentId) !== input.bankingInstrumentId) {
      throw new Error("package_instrument_mismatch");
    }
  }
  const rec = await CourierRecord.create({
    bankingInstrumentId: new Types.ObjectId(input.bankingInstrumentId),
    presentationPackageId: input.presentationPackageId
      ? new Types.ObjectId(input.presentationPackageId)
      : undefined,
    courierCompany: input.courierCompany,
    trackingNumber: input.trackingNumber,
    sender: input.sender,
    recipient: input.recipient,
    recipientBankName: input.recipientBankName,
    recipientAdviserName: input.recipientAdviserName,
    dispatchDate: input.dispatchDate ? new Date(input.dispatchDate) : undefined,
    expectedDeliveryDate: input.expectedDeliveryDate ? new Date(input.expectedDeliveryDate) : undefined,
    packageDescription: input.packageDescription,
    status: input.dispatchDate ? "dispatched" : "prepared",
    senderAdviserUserId: input.senderIsAdviser ? new Types.ObjectId(input.actorUserId) : undefined,
    createdByUserId: new Types.ObjectId(input.actorUserId),
  });
  await writeAuditEvent({
    action: "banking.courier_created",
    targetType: "courier_record",
    targetId: String(rec._id),
    actorUserId: input.actorUserId,
    result: "success",
  });
  return rec;
}

export async function updateCourierRecord(input: {
  courierId: string;
  actorUserId: string;
  status?: (typeof COURIER_STATUSES)[number];
  trackingNumber?: string;
  dispatchDate?: string;
  receivedDate?: string;
  verificationStatus?: Verification;
  paymentStatus?: Payment;
  paymentReference?: string;
  statusNotes?: string;
}) {
  await tryConnectMongo();
  const { CourierRecord, PresentationPackage } = await import("@/models");
  const rec = await CourierRecord.findById(input.courierId);
  if (!rec) throw new Error("not_found");

  if (input.trackingNumber !== undefined) rec.trackingNumber = input.trackingNumber;
  if (input.dispatchDate) rec.dispatchDate = new Date(input.dispatchDate);
  if (input.status) rec.status = input.status;
  if (input.receivedDate) {
    rec.receivedDate = new Date(input.receivedDate);
    rec.actualDeliveryDate = rec.receivedDate;
    rec.status = "delivered";
  }
  if (input.statusNotes !== undefined) rec.statusNotes = input.statusNotes;
  if (input.verificationStatus) {
    if (rec.status !== "delivered") throw new Error("verification_requires_delivery");
    rec.verificationStatus = input.verificationStatus;
    rec.verifiedAt = new Date();
  }
  if (input.paymentStatus) {
    if (input.paymentStatus === "payment_confirmed" && !canConfirmPayment(rec.verificationStatus)) {
      throw new Error("payment_requires_verification");
    }
    rec.paymentStatus = input.paymentStatus;
    if (input.paymentStatus === "payment_confirmed") rec.paymentConfirmedAt = new Date();
    if (input.paymentReference) rec.paymentReference = input.paymentReference;
  }
  await rec.save();

  if (rec.presentationPackageId && (input.status || input.receivedDate)) {
    if (["dispatched", "in_transit", "delivered"].includes(String(rec.status))) {
      await PresentationPackage.updateOne(
        { _id: rec.presentationPackageId, status: { $in: ["ready_for_presentation", "approved"] } },
        { $set: { status: "presented" } },
      );
    }
  }

  await writeAuditEvent({
    action: "banking.courier_updated",
    targetType: "courier_record",
    targetId: String(rec._id),
    actorUserId: input.actorUserId,
    result: "success",
  });
  return rec;
}
