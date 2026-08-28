import { customAlphabet } from "nanoid";
import { Types } from "mongoose";
import { money } from "@/lib/finance/money";
import { writeAuditEvent } from "@/lib/audit/log";
import { notifyUser, notifyAdmins } from "@/lib/notifications/service";
import { tryConnectMongo, isMongoConfigured } from "@/lib/db/mongoose";
import { findBankingTransition } from "@/lib/banking/workflow";
import { hasPermission } from "@/lib/authorization/permissions";
import type { Permission } from "@/lib/authorization/permissions";
import type { BankingInstrumentLifecycleStatus } from "@/models/BankingInstrument";

const idNano = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 8);

export function generateInstrumentId(): string {
  return `BIN-${new Date().getUTCFullYear()}-${idNano()}`;
}

export async function selectInstrumentForTransaction(input: {
  transactionId: string;
  instrumentTypeCode: string;
  actorUserId: string;
  permissions: Permission[];
  issuingBankId?: string;
  advisingBankId?: string;
}) {
  if (!hasPermission(input.permissions, "banking:select")) {
    throw new Error("forbidden");
  }

  await tryConnectMongo();
  const {
    Transaction,
    BankingInstrument,
    BankingInstrumentRecord,
    CommercialTerms,
    ProcurementTerms,
    Organization,
  } = await import("@/models");

  const tx = await Transaction.findById(input.transactionId);
  if (!tx || tx.deletedAt) throw new Error("transaction_not_found");
  if (
    tx.workflowStatus !== "banking_setup" &&
    tx.workflowStatus !== "contract_executed" &&
    tx.workflowStatus !== "instrument_issuance_requested"
  ) {
    throw new Error("invalid_workflow_state");
  }

  const existing = await BankingInstrument.findOne({ transactionId: tx._id });
  if (existing) throw new Error("instrument_exists");

  const transactionSide =
    tx.transactionType === "buyer_sale" ? "buyer_sale" : "supplier_purchase";

  let applicantOrgId: Types.ObjectId;
  let beneficiaryOrgId: Types.ObjectId;
  let amountStr = "0";
  let currency = "USD";
  let goodsDescription = "";
  let loadingPort = "";
  let destinationPort = "";
  let latestShipment: Date | undefined;

  const finekartsOrg = await Organization.findOne({ type: "internal" }).lean();

  if (transactionSide === "buyer_sale") {
    applicantOrgId = tx.organizationId;
    beneficiaryOrgId = finekartsOrg?._id ?? tx.counterpartyOrgId ?? tx.organizationId;
    const terms = await CommercialTerms.findOne({ transactionId: tx._id })
      .sort({ version: -1 })
      .lean();
    if (terms) {
      amountStr = terms.totalEstimatedValue?.toString() ?? "0";
      currency = terms.currency;
      goodsDescription = terms.productName;
      loadingPort = terms.loadingPort ?? "";
      destinationPort = terms.destinationPort ?? "";
      if (terms.shipmentSchedule) {
        const parsed = Date.parse(terms.shipmentSchedule.split(/[–-]/).pop()?.trim() ?? "");
        if (!Number.isNaN(parsed)) latestShipment = new Date(parsed);
      }
    }
  } else {
    applicantOrgId = finekartsOrg?._id ?? tx.counterpartyOrgId ?? tx.organizationId;
    beneficiaryOrgId = tx.organizationId;
    const terms = await ProcurementTerms.findOne({ transactionId: tx._id })
      .sort({ version: -1 })
      .lean();
    if (terms) {
      amountStr = terms.procurementTotal?.toString() ?? "0";
      currency = terms.currency;
      goodsDescription = terms.productName;
      loadingPort = terms.loadingPort ?? "";
      destinationPort = terms.destinationPlace ?? "";
      if (terms.shipmentSchedule) {
        const parsed = Date.parse(terms.shipmentSchedule.split(/[–-]/).pop()?.trim() ?? "");
        if (!Number.isNaN(parsed)) latestShipment = new Date(parsed);
      }
    }
  }

  const legacy = await BankingInstrumentRecord.findOneAndUpdate(
    { transactionId: tx._id },
    {
      transactionId: tx._id,
      organizationId: tx.organizationId,
      instrumentType: input.instrumentTypeCode,
      status: "draft_wording",
      selectedByUserId: new Types.ObjectId(input.actorUserId),
      selectedAt: new Date(),
      applicantOrganizationId: applicantOrgId,
      beneficiaryOrganizationId: beneficiaryOrgId,
    },
    { upsert: true, new: true },
  );

  const instrument = await BankingInstrument.create({
    instrumentId: generateInstrumentId(),
    transactionId: tx._id,
    transactionSide,
    instrumentTypeCode: input.instrumentTypeCode,
    applicantOrganizationId: applicantOrgId,
    beneficiaryOrganizationId: beneficiaryOrgId,
    issuingBankId: input.issuingBankId ? new Types.ObjectId(input.issuingBankId) : undefined,
    advisingBankId: input.advisingBankId ? new Types.ObjectId(input.advisingBankId) : undefined,
    currency,
    amount: Types.Decimal128.fromString(money(amountStr).toString()),
    goodsDescription,
    loadingPortPlace: loadingPort,
    destinationPortPlace: destinationPort,
    latestShipmentDate: latestShipment,
    currentStatus: "draft_wording",
    currentVersion: 1,
    adviceAuthenticationStatus: "not_recorded",
    issuedCopyVerificationStatus: "unverified",
    createdByUserId: new Types.ObjectId(input.actorUserId),
    selectedByUserId: new Types.ObjectId(input.actorUserId),
    selectedAt: new Date(),
    legacyRecordId: legacy._id,
  });

  await recordStatusHistory({
    instrumentId: String(instrument._id),
    previousStatus: "not_selected",
    newStatus: "draft_wording",
    actorUserId: input.actorUserId,
    reason: "Instrument selected by admin",
  });

  await writeAuditEvent({
    action: "banking.instrument_selected",
    targetType: "banking_instrument",
    targetId: String(instrument._id),
    actorUserId: input.actorUserId,
    result: "success",
    metadata: { transactionId: input.transactionId, instrumentType: input.instrumentTypeCode },
  });

  await notifyAdmins({
    type: "banking_instrument_selected",
    title: "Banking instrument selected",
    body: `Instrument ${instrument.instrumentId} created for ${tx.transactionNumber}.`,
    href: `/admin/banking`,
  });

  return instrument;
}

export async function transitionBankingInstrument(input: {
  instrumentId: string;
  toStatus: BankingInstrumentLifecycleStatus;
  actorUserId: string;
  permissions: Permission[];
  reason?: string;
  evidence?: string;
}) {
  await tryConnectMongo();
  const { BankingInstrument } = await import("@/models");
  const instrument = await BankingInstrument.findById(input.instrumentId);
  if (!instrument) throw new Error("not_found");

  const transition = findBankingTransition(instrument.currentStatus, input.toStatus);
  if (!transition) throw new Error("invalid_transition");
  if (!hasPermission(input.permissions, transition.permission)) throw new Error("forbidden");
  if (transition.requiresReason && !input.reason?.trim()) throw new Error("reason_required");
  if (transition.requiresEvidence && !input.evidence?.trim()) throw new Error("evidence_required");

  const before = instrument.currentStatus;
  instrument.currentStatus = input.toStatus;
  await instrument.save();

  await recordStatusHistory({
    instrumentId: String(instrument._id),
    previousStatus: before,
    newStatus: input.toStatus,
    actorUserId: input.actorUserId,
    reason: input.reason,
    supportingEvidence: input.evidence,
  });

  return instrument;
}

export async function recordIssuanceRequest(input: {
  instrumentId: string;
  actorUserId: string;
  reference?: string;
  evidence?: string;
}) {
  await tryConnectMongo();
  const { BankingInstrument } = await import("@/models");
  const instrument = await BankingInstrument.findById(input.instrumentId);
  if (!instrument) throw new Error("not_found");

  instrument.issuanceRequestedAt = new Date();
  instrument.issuanceRequestReference = input.reference;
  instrument.currentStatus = "issuance_requested";
  await instrument.save();

  await writeAuditEvent({
    action: "banking.issuance_requested",
    targetType: "banking_instrument",
    targetId: input.instrumentId,
    actorUserId: input.actorUserId,
    result: "success",
    metadata: { reference: input.reference, evidence: input.evidence },
  });

  return instrument;
}

export async function recordAdviceEvidence(input: {
  instrumentId: string;
  actorUserId: string;
  permissions: Permission[];
  adviceDate?: string;
  adviceReference?: string;
  evidenceSource?: string;
  notes?: string;
}) {
  if (!hasPermission(input.permissions, "banking:review")) throw new Error("forbidden");

  await tryConnectMongo();
  const { BankingInstrument } = await import("@/models");
  const instrument = await BankingInstrument.findById(input.instrumentId);
  if (!instrument) throw new Error("not_found");

  instrument.adviceDate = input.adviceDate ? new Date(input.adviceDate) : new Date();
  instrument.adviceReference = input.adviceReference;
  instrument.adviceEvidenceSource = input.evidenceSource;
  instrument.adviceNotes = input.notes;
  instrument.adviceReviewedByUserId = new Types.ObjectId(input.actorUserId);
  instrument.adviceAuthenticationStatus = "recorded_by_authorized_human";
  instrument.currentStatus = "advice_evidence_recorded";
  await instrument.save();

  await writeAuditEvent({
    action: "banking.advice_evidence_recorded",
    targetType: "banking_instrument",
    targetId: input.instrumentId,
    actorUserId: input.actorUserId,
    result: "success",
  });

  return instrument;
}

export async function assignBankingAdviser(input: {
  instrumentId: string;
  adviserUserId: string;
  actorUserId: string;
  permissions: Permission[];
}) {
  if (!hasPermission(input.permissions, "banking:review")) throw new Error("forbidden");

  await tryConnectMongo();
  const { BankingPartyAssignment } = await import("@/models");

  await BankingPartyAssignment.findOneAndUpdate(
    {
      bankingInstrumentId: new Types.ObjectId(input.instrumentId),
      userId: new Types.ObjectId(input.adviserUserId),
      bankingRole: "external_banking_adviser",
    },
    {
      bankingInstrumentId: new Types.ObjectId(input.instrumentId),
      userId: new Types.ObjectId(input.adviserUserId),
      bankingRole: "external_banking_adviser",
      accessScope: "assigned_instrument",
      assignedByUserId: new Types.ObjectId(input.actorUserId),
      assignedAt: new Date(),
      active: true,
    },
    { upsert: true, new: true },
  );

  await notifyUser({
    userId: input.adviserUserId,
    type: "banking_adviser_assigned",
    title: "Banking instrument assigned",
    body: "You have been assigned to review a banking instrument.",
    href: `/portal/banking/instruments/${input.instrumentId}`,
  });

  await writeAuditEvent({
    action: "banking.adviser_assigned",
    targetType: "banking_instrument",
    targetId: input.instrumentId,
    actorUserId: input.actorUserId,
    result: "success",
    metadata: { adviserUserId: input.adviserUserId },
  });
}

async function recordStatusHistory(input: {
  instrumentId: string;
  previousStatus: string;
  newStatus: string;
  actorUserId: string;
  reason?: string;
  supportingEvidence?: string;
}) {
  const { InstrumentStatusHistory } = await import("@/models");
  await InstrumentStatusHistory.create({
    bankingInstrumentId: new Types.ObjectId(input.instrumentId),
    previousStatus: input.previousStatus,
    newStatus: input.newStatus,
    actorUserId: new Types.ObjectId(input.actorUserId),
    reason: input.reason,
    supportingEvidence: input.supportingEvidence,
    transitionedAt: new Date(),
  });
}
