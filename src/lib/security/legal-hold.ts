import { LegalHold } from "@/models/LegalHold";
import { connectMongo } from "@/lib/db/mongoose";
import type { Types } from "mongoose";

export async function hasActiveLegalHoldForTransaction(
  transactionId: Types.ObjectId | string,
): Promise<boolean> {
  await connectMongo();
  const count = await LegalHold.countDocuments({
    status: "active",
    transactionIds: transactionId,
  });
  return count > 0;
}

export async function hasActiveLegalHoldForOrganization(
  organizationId: Types.ObjectId | string,
): Promise<boolean> {
  await connectMongo();
  const count = await LegalHold.countDocuments({
    status: "active",
    organizationIds: organizationId,
  });
  return count > 0;
}

export async function assertDeletionAllowed(
  scope: { transactionId?: string; organizationId?: string },
): Promise<void> {
  if (scope.transactionId && await hasActiveLegalHoldForTransaction(scope.transactionId)) {
    throw new Error("Deletion blocked by active legal hold on transaction.");
  }
  if (scope.organizationId && await hasActiveLegalHoldForOrganization(scope.organizationId)) {
    throw new Error("Deletion blocked by active legal hold on organization.");
  }
}
