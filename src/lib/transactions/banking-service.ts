import { Types } from "mongoose";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { hasPermission } from "@/lib/authorization/permissions";
import type { Permission } from "@/lib/authorization/permissions";

export const ALLOWED_INSTRUMENT_TYPES = [
  "irrevocable_documentary_lc",
  "standby_lc",
  "bank_guarantee",
  "documentary_collection",
] as const;

export async function selectBankingInstrument(input: {
  transactionId: string;
  instrumentType: string;
  actorUserId: string;
  permissions: Permission[];
  proposedWordingDocumentId?: string;
  internalNotes?: string;
  buyerInstructions?: string;
}) {
  if (!hasPermission(input.permissions, "banking:select")) {
    throw new Error("forbidden");
  }

  await tryConnectMongo();
  const { BankingInstrumentRecord, Transaction } = await import("@/models");

  const tx = await Transaction.findById(input.transactionId);
  if (!tx) throw new Error("transaction_not_found");
  if (tx.workflowStatus !== "banking_setup" && tx.workflowStatus !== "contract_executed") {
    throw new Error("invalid_workflow_state");
  }

  const record = await BankingInstrumentRecord.findOneAndUpdate(
    { transactionId: tx._id },
    {
      transactionId: tx._id,
      organizationId: tx.organizationId,
      instrumentType: input.instrumentType,
      proposedWordingDocumentId: input.proposedWordingDocumentId
        ? new Types.ObjectId(input.proposedWordingDocumentId)
        : undefined,
      status: "draft_wording",
      selectedByUserId: new Types.ObjectId(input.actorUserId),
      selectedAt: new Date(),
      internalNotes: input.internalNotes,
      buyerInstructions: input.buyerInstructions,
    },
    { upsert: true, new: true },
  );

  tx.workflowStatus = "banking_setup";
  await tx.save();

  return record;
}

export async function confirmIssuanceRequested(input: {
  transactionId: string;
  organizationId: string;
  reference?: string;
  buyerInstructions?: string;
}) {
  await tryConnectMongo();
  const { BankingInstrumentRecord } = await import("@/models");
  const record = await BankingInstrumentRecord.findOne({
    transactionId: new Types.ObjectId(input.transactionId),
    organizationId: new Types.ObjectId(input.organizationId),
  });
  if (!record) throw new Error("banking_record_not_found");

  record.status = "issuance_requested";
  record.issuanceRequestedAt = new Date();
  record.issuanceReference = input.reference;
  if (input.buyerInstructions) record.buyerInstructions = input.buyerInstructions;
  await record.save();
  return record;
}
