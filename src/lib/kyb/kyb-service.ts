import { Types } from "mongoose";
import { tryConnectMongo } from "@/lib/db/mongoose";
import {
  COMMODITY_CHECKS,
  KYB_SECTIONS,
  VALIDATION_CHECKS,
  canRecordOutcome,
  checklistProgress,
  evaluateApprovalGate,
  submissionProgress,
  validateWaiver,
  type KybItemStatus,
  type ValidationOutcome,
} from "./checklist";

export type KybGroup = "checklist" | "commodityChecks" | "validationChecks";

export class KybGateError extends Error {
  constructor(
    public code: string,
    message: string,
    public canOverride = false,
  ) {
    super(message);
    this.name = "KybGateError";
  }
}

export type KybItemPatch = {
  status?: KybItemStatus;
  notes?: string;
  source?: string;
  evidence?: string;
  discrepancies?: string;
  outstandingRisks?: string;
};

function seedKeys(): Record<KybGroup, string[]> {
  return {
    checklist: KYB_SECTIONS.flatMap((s) => s.items.map((_, i) => `${s.key}:${i}`)),
    commodityChecks: COMMODITY_CHECKS.map((c) => c.key),
    validationChecks: VALIDATION_CHECKS.map((c) => c.key),
  };
}

/** True when the user holds an active CEO or General Manager membership. */
export async function isCeoOrGm(userId: string): Promise<boolean> {
  await tryConnectMongo();
  const { OrganizationMembership } = await import("@/models");
  const m = await OrganizationMembership.findOne({
    userId: new Types.ObjectId(userId),
    status: "active",
    deletedAt: null,
    roles: { $in: ["ceo_super_admin", "general_manager"] },
  }).lean();
  return Boolean(m);
}

export async function getOrCreateKybRecord(organizationId: string) {
  await tryConnectMongo();
  const { KybValidationRecord } = await import("@/models");
  const orgOid = new Types.ObjectId(organizationId);
  let rec = await KybValidationRecord.findOne({ organizationId: orgOid });
  if (!rec) rec = new KybValidationRecord({ organizationId: orgOid });
  const seeds = seedKeys();
  let changed = rec.isNew;
  for (const group of Object.keys(seeds) as KybGroup[]) {
    const have = new Set((rec[group] as { key: string }[]).map((i) => i.key));
    for (const key of seeds[group]) {
      if (!have.has(key)) {
        (rec[group] as unknown[]).push({ key, status: "not_started" });
        changed = true;
      }
    }
  }
  if (changed) await rec.save();
  return rec;
}

export async function updateKybItem(input: {
  organizationId: string;
  group: KybGroup;
  key: string;
  patch: KybItemPatch;
  actorUserId: string;
}) {
  if (!seedKeys()[input.group].includes(input.key)) throw new Error("unknown_item");
  const rec = await getOrCreateKybRecord(input.organizationId);
  const item = (rec[input.group] as Array<Record<string, unknown>>).find((i) => i.key === input.key);
  if (!item) throw new Error("unknown_item");
  for (const f of ["notes", "source", "evidence", "discrepancies", "outstandingRisks"] as const) {
    if (input.patch[f] !== undefined) item[f] = input.patch[f];
  }
  if (input.patch.status) {
    item.status = input.patch.status;
    if (input.patch.status === "verified") {
      item.verifiedAt = new Date();
      item.verifiedBy = new Types.ObjectId(input.actorUserId);
    } else {
      item.verifiedAt = undefined;
      item.verifiedBy = undefined;
    }
  }
  rec.markModified(input.group);
  await rec.save();
  return rec;
}

export async function recordValidationOutcome(input: {
  organizationId: string;
  outcome: ValidationOutcome;
  report: string;
  actorUserId: string;
}) {
  const rec = await getOrCreateKybRecord(input.organizationId);
  const check = canRecordOutcome({
    outcome: input.outcome,
    checks: rec.validationChecks.map((c: { key: string; status: KybItemStatus }) => ({ key: c.key, status: c.status })),
    report: input.report,
  });
  if (!check.ok) throw new KybGateError("outcome_invalid", check.error);
  rec.outcome = input.outcome;
  rec.outcomeReport = input.report;
  rec.outcomeAt = new Date();
  rec.outcomeBy = new Types.ObjectId(input.actorUserId);
  await rec.save();
  return rec;
}

/** Buyers: choose whether KYB is required for this buyer (optional by default). */
export async function setBuyerKybRequired(input: {
  organizationId: string;
  required: boolean;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { Organization } = await import("@/models");
  const org = await Organization.findById(input.organizationId).lean();
  if (!org) throw new Error("org_not_found");
  if (org.type !== "buyer") {
    throw new KybGateError("waiver_invalid", "Only buyers can be switched; suppliers always need KYB unless waived.");
  }
  const rec = await getOrCreateKybRecord(input.organizationId);
  rec.kybRequired = input.required;
  await rec.save();
  return rec;
}

export async function setSupplierWaiver(input: {
  organizationId: string;
  waived: boolean;
  reason?: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { Organization } = await import("@/models");
  const org = await Organization.findById(input.organizationId).lean();
  if (!org) throw new Error("org_not_found");
  const actorIsCeoOrGm = await isCeoOrGm(input.actorUserId);
  const rec = await getOrCreateKybRecord(input.organizationId);
  if (input.waived) {
    const check = validateWaiver({ orgType: org.type, actorIsCeoOrGm, reason: input.reason });
    if (!check.ok) throw new KybGateError("waiver_invalid", check.error);
    rec.waiver = {
      waived: true,
      reason: input.reason!.trim(),
      byUserId: new Types.ObjectId(input.actorUserId),
      at: new Date(),
    };
  } else {
    if (!actorIsCeoOrGm) throw new KybGateError("waiver_invalid", "Only the CEO or General Manager can change a KYB waiver.");
    rec.waiver = { waived: false, reason: input.reason?.trim(), byUserId: new Types.ObjectId(input.actorUserId), at: new Date() };
  }
  await rec.save();
  return rec;
}

/**
 * Enforce the KYB gate before an organization is approved/activated.
 * Throws KybGateError when blocked. Records the override (if used) on the record.
 * Returns an object describing warning/override for audit logging.
 */
export async function assertKybApprovalGate(input: {
  organizationId: string;
  actorUserId: string;
  overrideReason?: string;
}): Promise<{ warning?: string; overridden: boolean; outcome?: string; waived: boolean }> {
  await tryConnectMongo();
  const { Organization, KybValidationRecord } = await import("@/models");
  const org = await Organization.findById(input.organizationId).lean();
  if (!org) throw new Error("org_not_found");
  const rec = await KybValidationRecord.findOne({ organizationId: new Types.ObjectId(input.organizationId) });
  const actorIsCeoOrGm = await isCeoOrGm(input.actorUserId);
  const waived = Boolean(rec?.waiver?.waived);
  const result = evaluateApprovalGate({
    orgType: org.type,
    outcome: rec?.outcome ?? null,
    waived,
    kybRequired: Boolean(rec?.kybRequired),
    actorIsCeoOrGm,
    overrideReason: input.overrideReason,
  });
  if (!result.allowed) throw new KybGateError(result.code, result.message, result.canOverride && actorIsCeoOrGm);
  if (result.overridden && rec) {
    rec.approvalOverride = {
      reason: input.overrideReason!.trim(),
      byUserId: new Types.ObjectId(input.actorUserId),
      at: new Date(),
      outcomeAtOverride: rec.outcome,
    };
    await rec.save();
  }
  return { warning: result.warning, overridden: Boolean(result.overridden), outcome: rec?.outcome, waived };
}

type LeanItem = {
  key: string;
  status: KybItemStatus;
  notes?: string;
  source?: string;
  evidence?: string;
  discrepancies?: string;
  outstandingRisks?: string;
  verifiedAt?: Date;
  verifiedBy?: Types.ObjectId;
};

/** Staff-only view of the record. Never return this to buyer/supplier sessions. */
export async function loadStaffKybView(organizationId: string) {
  const rec = await getOrCreateKybRecord(organizationId);
  const { Organization, CisProfile } = await import("@/models");
  const orgOid = new Types.ObjectId(organizationId);
  const org = await Organization.findById(orgOid).lean();
  const cis = await CisProfile.findOne({ organizationId: orgOid }).sort({ version: -1 }).lean();
  const ser = (i: LeanItem) => ({
    key: i.key,
    status: i.status,
    notes: i.notes ?? "",
    source: i.source ?? "",
    evidence: i.evidence ?? "",
    discrepancies: i.discrepancies ?? "",
    outstandingRisks: i.outstandingRisks ?? "",
    verifiedAt: i.verifiedAt ? new Date(i.verifiedAt).toISOString() : null,
    verifiedBy: i.verifiedBy ? String(i.verifiedBy) : null,
  });
  const checklist = (rec.checklist as LeanItem[]).map(ser);
  const sections = KYB_SECTIONS.map((s) => ({
    sectionKey: s.key,
    label: s.label,
    items: s.items.map((label, idx) => {
      const found = checklist.find((c) => c.key === `${s.key}:${idx}`);
      return { label, ...(found ?? { key: `${s.key}:${idx}`, status: "not_started" as KybItemStatus }) };
    }),
  }));
  return {
    organization: org
      ? { id: String(org._id), type: org.type, legalName: org.legalName, country: org.country, status: org.status, website: org.website ?? "", registrationNumber: org.registrationNumber ?? "" }
      : null,
    cisSummary: cis
      ? { legalName: cis.legalName, jurisdiction: cis.jurisdiction ?? "", registrationNumber: cis.registrationNumber ?? "", website: cis.website ?? "" }
      : null,
    sections,
    progress: checklistProgress(sections.map((s) => ({ sectionKey: s.sectionKey, items: s.items }))),
    commodityChecks: COMMODITY_CHECKS.map((c) => ({
      label: c.label,
      ...ser((rec.commodityChecks as LeanItem[]).find((i) => i.key === c.key) ?? { key: c.key, status: "not_started" }),
    })),
    validationChecks: VALIDATION_CHECKS.map((c) => ({
      label: c.label,
      ...ser((rec.validationChecks as LeanItem[]).find((i) => i.key === c.key) ?? { key: c.key, status: "not_started" }),
    })),
    kybRequired: Boolean(rec.kybRequired),
    outcome: rec.outcome ?? null,
    outcomeReport: rec.outcomeReport ?? "",
    outcomeAt: rec.outcomeAt ? new Date(rec.outcomeAt).toISOString() : null,
    waiver: rec.waiver?.waived
      ? { waived: true, reason: rec.waiver.reason ?? "", at: rec.waiver.at ? new Date(rec.waiver.at).toISOString() : null }
      : { waived: false, reason: "", at: null },
    approvalOverride: rec.approvalOverride
      ? { reason: rec.approvalOverride.reason, at: new Date(rec.approvalOverride.at).toISOString(), outcomeAtOverride: rec.approvalOverride.outcomeAtOverride ?? "" }
      : null,
  };
}

/** Org-facing progress: only what the org itself submitted. No staff findings. */
export async function loadOwnSubmissionProgress(organizationId: string) {
  await tryConnectMongo();
  const { CisProfile, KybDocument } = await import("@/models");
  const orgOid = new Types.ObjectId(organizationId);
  const cis = await CisProfile.findOne({ organizationId: orgOid }).sort({ version: -1 }).lean();
  if (!cis) {
    return submissionProgress({
      hasLegalIdentity: false,
      hasOperatingAddress: false,
      hasDirectorsOrSigners: false,
      hasOwners: false,
      hasBusinessInfo: false,
      documentTypes: [],
    });
  }
  const docs = await KybDocument.find({ organizationId: orgOid, cisProfileId: cis._id, deletedAt: null })
    .select("documentType")
    .lean();
  return submissionProgress({
    hasLegalIdentity: Boolean(cis.legalName?.trim() && cis.registrationNumber?.trim() && cis.jurisdiction?.trim() && cis.incorporationDate && cis.legalStructure?.trim()),
    hasOperatingAddress: (cis.addresses?.length ?? 0) > 0,
    hasDirectorsOrSigners: (cis.representatives?.length ?? 0) + (cis.authorizedSigners?.length ?? 0) > 0,
    hasOwners: (cis.owners?.length ?? 0) > 0,
    hasBusinessInfo: Boolean(cis.businessActivities?.trim() && (cis.website?.trim() || cis.corporateEmail?.trim())),
    documentTypes: docs.map((d: { documentType: string }) => d.documentType),
  });
}
