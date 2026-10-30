import { Types } from "mongoose";
import { canOpenStep } from "@/lib/workflows/transitions";
import { StepRuleError, applyStepStatus, loadStepDefs } from "@/lib/transactions/step-service";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { hasPermission } from "@/lib/authorization/permissions";
import type { Permission } from "@/lib/authorization/permissions";
import { RWA_REQUIRED_MESSAGE, hasQualifyingRwa, isRwaRequiredFor } from "@/lib/banking/rwa";

export const ALLOWED_INSTRUMENT_TYPES = [
  "irrevocable_documentary_lc",
  "standby_lc",
  "bank_guarantee",
  "documentary_collection",
] as const;

export function isAllowedInstrumentType(t: string): boolean {
  return (ALLOWED_INSTRUMENT_TYPES as readonly string[]).includes(t);
}

export function assertInstrumentType(t: string) {
  if (!isAllowedInstrumentType(t)) throw new StepRuleError("Unsupported instrument type.", 422);
}

/** Blocks buyer-side banking progress for LC payment terms until an RWA letter is on file (409). */
async function assertRwaForLc(tx: { _id: unknown; organizationId: unknown }, instrumentType?: string) {
  const { CommercialTerms, Document } = await import("@/models");
  const terms = await CommercialTerms.findOne({ transactionId: tx._id })
    .sort({ version: -1 })
    .select("paymentProposal bankingInstrumentProposal")
    .lean();
  if (!isRwaRequiredFor(instrumentType, terms?.paymentProposal, terms?.bankingInstrumentProposal)) return;
  const docs = await Document.find({
    transactionId: tx._id,
    organizationId: tx.organizationId,
    documentType: "rwa",
    deletedAt: null,
  })
    .select("documentType workflowStatus deletedAt")
    .lean();
  if (!hasQualifyingRwa(docs)) throw new StepRuleError(RWA_REQUIRED_MESSAGE, 409);
}

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
  assertInstrumentType(input.instrumentType);

  await tryConnectMongo();
  const { BankingInstrumentRecord, Transaction } = await import("@/models");

  const tx = await Transaction.findById(input.transactionId);
  if (!tx) throw new Error("transaction_not_found");
  if (tx.workflowStatus !== "banking_setup" && tx.workflowStatus !== "contract_executed") {
    throw new Error("invalid_workflow_state");
  }
  await assertRwaForLc(tx, input.instrumentType);

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
  await applyStepStatus({
    transactionId: String(tx._id),
    stepKey: "banking",
    status: "in_progress",
    actorUserId: input.actorUserId,
  });

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
  await assertRwaForLc(
    { _id: new Types.ObjectId(input.transactionId), organizationId: new Types.ObjectId(input.organizationId) },
    record.instrumentType,
  );

  record.status = "issuance_requested";
  record.issuanceRequestedAt = new Date();
  record.issuanceReference = input.reference;
  if (input.buyerInstructions) record.buyerInstructions = input.buyerInstructions;
  await record.save();
  await applyStepStatus({
    transactionId: input.transactionId,
    stepKey: "banking",
    status: "completed",
  });
  return record;
}

export type BuyerLcDetails = {
  instrumentType: string;
  lcNumber?: string;
  issuingBank?: string;
  advisingBank?: string;
  amount?: string;
  currency?: string;
  expiryDate?: string;
  notes?: string;
};

/** Buyer records the details of the instrument it arranged with its own bank. Metadata only. */
export async function recordBuyerLcDetails(input: {
  transactionId: string;
  organizationId: string;
  userId: string;
  details: BuyerLcDetails;
}) {
  assertInstrumentType(input.details.instrumentType);
  await tryConnectMongo();
  const { BankingInstrumentRecord, Transaction } = await import("@/models");
  const tx = await Transaction.findOne({
    _id: input.transactionId,
    organizationId: new Types.ObjectId(input.organizationId),
    transactionType: "buyer_sale",
    deletedAt: null,
  });
  if (!tx) throw new Error("transaction_not_found");
  const steps = await loadStepDefs(tx._id);
  if (steps.length && !canOpenStep(steps, "banking")) {
    throw new StepRuleError("Step 6 opens after the contract is fully executed (steps 1-5).", 409);
  }
  const d = input.details;
  await assertRwaForLc(tx, d.instrumentType);
  const record = await BankingInstrumentRecord.findOneAndUpdate(
    { transactionId: tx._id },
    {
      $set: {
        organizationId: tx.organizationId,
        instrumentType: d.instrumentType,
        lcNumber: d.lcNumber,
        issuingBank: d.issuingBank,
        advisingBank: d.advisingBank,
        amount: d.amount,
        currency: d.currency,
        expiryDate: d.expiryDate ? new Date(d.expiryDate) : undefined,
        buyerNotes: d.notes,
      },
      $setOnInsert: { status: "draft_wording" },
    },
    { upsert: true, new: true },
  );
  await applyStepStatus({
    transactionId: String(tx._id),
    stepKey: "banking",
    status: "in_progress",
    actorUserId: input.userId,
  });
  const { writeAuditEvent } = await import("@/lib/audit/log");
  await writeAuditEvent({
    action: "banking.buyer_lc_details_recorded",
    targetType: "transaction",
    targetId: String(tx._id),
    actorUserId: input.userId,
    organizationId: String(tx.organizationId),
    metadata: { instrumentType: d.instrumentType, lcNumber: d.lcNumber },
  });
  return record;
}
