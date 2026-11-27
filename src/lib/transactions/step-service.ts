import { tryConnectMongo } from "@/lib/db/mongoose";
import { writeAuditEvent } from "@/lib/audit/log";
import { canOpenStep, canSkipStep, STAFF_COMPLETED_STEPS, type StepStatus, type WorkflowStepDef } from "@/lib/workflows/transitions";
import type { DocStepSide } from "@/lib/transactions/document-steps";
import {
  checkDocumentAction,
  checkSignAction,
  findPath,
  shouldApply,
  stepUpdateForEvent,
  targetWorkflowStatus,
  transitionTable,
  type DocEvent,
} from "@/lib/transactions/step-rules";

export class StepRuleError extends Error {
  status: number;
  constructor(message: string, status = 409) {
    super(message);
    this.name = "StepRuleError";
    this.status = status;
  }
}

export function sideOf(tx: { side?: string; transactionType?: string }): DocStepSide {
  return tx.side === "supplier" || tx.transactionType === "supplier_purchase" ? "supplier" : "buyer";
}

export async function loadStepDefs(transactionId: unknown): Promise<WorkflowStepDef[]> {
  await tryConnectMongo();
  const { WorkflowStep } = await import("@/models");
  const rows = await WorkflowStep.find({ transactionId }).sort({ order: 1 }).lean();
  return rows.map((r) => ({
    key: r.key,
    order: r.order,
    title: r.title,
    status: r.status as StepStatus,
    skipReason: r.skipReason,
  }));
}

/**
 * Closed and cancelled transactions are locked records. A transaction is closed by staff after the
 * final delivery is confirmed (it is NOT closed when the PSA is signed, because the Proforma
 * Invoice, LC and shipping documents still follow). Nothing in them may be added to, signed
 * or changed (that would be falsification). Everyone can still view and download.
 */
export async function assertTransactionUnlocked(transactionId: unknown) {
  await tryConnectMongo();
  const { Transaction } = await import("@/models");
  const tx = await Transaction.findById(transactionId).select("status closedAt transactionNumber").lean();
  if (tx && (tx.status === "cancelled" || tx.closedAt)) {
    throw new StepRuleError(
      `Transaction ${tx.transactionNumber} is ${tx.status === "cancelled" ? "cancelled" : "closed"} and its record is locked. Documents can be viewed and downloaded but not changed.`,
      409,
    );
  }
}

/** Throws StepRuleError when the document action is not allowed at the current step. */
export async function assertDocumentAllowed(input: {
  tx: { _id: unknown; side?: string; transactionType?: string };
  isInternal: boolean;
  documentType: string;
  action: "upload" | "create" | "send";
}) {
  await assertTransactionUnlocked(input.tx._id);
  const steps = await loadStepDefs(input.tx._id);
  const msg = checkDocumentAction({
    side: sideOf(input.tx),
    isInternal: input.isInternal,
    documentType: input.documentType,
    steps,
    action: input.action,
  });
  if (msg) throw new StepRuleError(msg, 409);
}

export async function assertSignAllowed(input: {
  tx: { _id: unknown; side?: string; transactionType?: string };
  signer: "external" | "staff";
  /** The version being signed is an amended version awaiting signature (see checkSignAction). */
  allowResign?: boolean;
}) {
  await assertTransactionUnlocked(input.tx._id);
  const steps = await loadStepDefs(input.tx._id);
  const msg = checkSignAction({ side: sideOf(input.tx), signer: input.signer, steps, allowResign: input.allowResign });
  if (msg) throw new StepRuleError(msg, 409);
}

/** Moves a step to a status, opens the next step, and keeps currentStepKey/workflowStatus in sync. */
export async function applyStepStatus(input: {
  transactionId: string;
  stepKey: string;
  status: StepStatus;
  actorUserId?: string;
}) {
  await tryConnectMongo();
  const { Transaction, WorkflowStep } = await import("@/models");
  const tx = await Transaction.findById(input.transactionId);
  if (!tx) return null;
  const side = sideOf(tx);
  const step = await WorkflowStep.findOne({ transactionId: tx._id, key: input.stepKey });
  if (!step) return null;
  if (!shouldApply(step.status as StepStatus, input.status)) return tx;

  const before = { step: step.status, workflowStatus: tx.workflowStatus, currentStepKey: tx.currentStepKey };
  step.status = input.status;
  await step.save();

  const completed = input.status === "completed" || input.status === "skipped";
  if (completed) {
    const next = await WorkflowStep.findOne({ transactionId: tx._id, order: step.order + 1 });
    if (next) {
      if (next.status === "not_started") {
        next.status = "ready";
        await next.save();
      }
      tx.currentStepKey = next.key;
    }
  } else {
    tx.currentStepKey = step.key;
  }

  const stepKeys = (await WorkflowStep.find({ transactionId: tx._id }).select("key").lean()).map((s) => s.key as string);
  const target = targetWorkflowStatus(side, input.stepKey, input.status, stepKeys);
  if (target) {
    const path = findPath(transitionTable(side), tx.workflowStatus, target);
    if (path && path.length) tx.workflowStatus = path[path.length - 1] as typeof tx.workflowStatus;
  }
  if (tx.workflowStatus === "contract_executed" || tx.workflowStatus === "instrument_issuance_requested") {
    tx.status = "completed";
  }
  await tx.save();

  // Once the PSA is fully signed by both parties, every document on the transaction file goes to
  // the banking advisor for review.
  const psaComplete =
    input.status === "completed" &&
    ((side === "buyer" && input.stepKey === "finekarts_sign") ||
      (side === "supplier" && input.stepKey === "supplier_sign"));
  if (psaComplete) {
    const { Document } = await import("@/models");
    const shared = await Document.updateMany(
      {
        transactionId: tx._id,
        deletedAt: null,
        documentType: { $in: ["sco", "fco", "icpo", "loi", "cis", "rwa", "fis", "passport_copy", "spa", "proposed_lc_wording", "proforma_invoice", "letter_of_credit"] },
      },
      { $set: { bankingVisible: true } },
    );
    await writeAuditEvent({
      action: "documents.shared_with_banking_advisor",
      targetType: "transaction",
      targetId: String(tx._id),
      actorUserId: input.actorUserId,
      organizationId: String(tx.organizationId),
      metadata: { reason: "psa_completed", count: shared.modifiedCount },
    });
  }

  await writeAuditEvent({
    action: "workflow.step_advanced",
    targetType: "transaction",
    targetId: String(tx._id),
    actorUserId: input.actorUserId,
    organizationId: String(tx.organizationId),
    before,
    after: { step: input.status, workflowStatus: tx.workflowStatus, currentStepKey: tx.currentStepKey },
    metadata: { stepKey: input.stepKey },
  });
  return tx;
}

/** Called after a document event; silently ignores documents that do not map to a step. */
export async function advanceForDocumentEvent(input: {
  transactionId: string;
  documentType?: string;
  event: DocEvent;
  signer?: "external" | "staff";
  actorUserId?: string;
}) {
  if (!input.documentType) return null;
  await tryConnectMongo();
  const { Transaction } = await import("@/models");
  const tx = await Transaction.findById(input.transactionId).select("side transactionType").lean();
  if (!tx) return null;
  const stepKeys = (await loadStepDefs(input.transactionId)).map((s) => s.key);
  const update = stepUpdateForEvent(sideOf(tx), input.documentType, input.event, input.signer, stepKeys);
  if (!update) return null;
  return applyStepStatus({
    transactionId: input.transactionId,
    stepKey: update.stepKey,
    status: update.status,
    actorUserId: input.actorUserId,
  });
}

/** Server-side checks for skipping Step 1 (verbal agreement). Throws StepRuleError. */
export async function assertSkipStepOne(input: {
  tx: { _id: unknown; side?: string; transactionType?: string; workflowStatus: string; offerSkipped?: boolean };
  actorUserId: string;
  approverUserId: string;
  reason: string;
}) {
  const { canSkipStepOne } = await import("@/lib/transactions/step-rules");
  const { getAuthContext } = await import("@/lib/auth/auth-context");
  await tryConnectMongo();
  const { Document } = await import("@/models");
  if (input.actorUserId === input.approverUserId) {
    throw new StepRuleError("The approver must be a different manager than the person requesting the skip.", 403);
  }
  const approver = await getAuthContext(input.approverUserId);
  const approverOk =
    approver &&
    approver.isInternal &&
    approver.permissions.includes("transactions:approve");
  if (!approverOk) {
    throw new StepRuleError("The selected approver does not hold approval authority.", 403);
  }
  const side = sideOf(input.tx);
  const steps = await loadStepDefs(input.tx._id);
  const released = await Document.exists({
    transactionId: input.tx._id,
    documentType: { $in: ["sco", "fco"] },
    workflowStatus: { $in: ["approved", "sent", "viewed", "signed"] },
  });
  const msg = canSkipStepOne({
    side,
    workflowStatus: input.tx.workflowStatus,
    step1Status: steps.find((s) => s.order === 1)?.status,
    hasReleasedOffer: Boolean(released),
    alreadySkipped: Boolean(input.tx.offerSkipped),
  });
  if (msg) throw new StepRuleError(msg, 409);
}

/**
 * Some steps have no single document that completes them: Finekarts staff review and decide. They press the button
 * when satisfied, or skip with a written reason. Nothing is blocked by a hidden rule: a missing FIS, for example,
 * is the staff's call. Only the steps listed in STAFF_COMPLETED_STEPS can be completed this way, and only when the
 * steps before them are done, so the workflow keeps its order.
 */
export async function completeStaffStep(input: {
  transactionId: string;
  stepKey: string;
  action: "complete" | "skip";
  reason?: string;
  actorUserId: string;
}) {
  await assertTransactionUnlocked(input.transactionId);
  const { Transaction, WorkflowStep } = await import("@/models");
  const tx = await Transaction.findById(input.transactionId).select("side transactionType").lean();
  if (!tx) throw new StepRuleError("Transaction not found.", 404);
  const side = sideOf(tx);
  if (!STAFF_COMPLETED_STEPS[side].includes(input.stepKey)) {
    throw new StepRuleError("This step is completed by a document, not by staff.", 422);
  }
  const steps = await loadStepDefs(input.transactionId);
  if (!steps.some((s) => s.key === input.stepKey)) {
    throw new StepRuleError("This transaction does not have that step.", 404);
  }
  if (!canOpenStep(steps, input.stepKey)) {
    throw new StepRuleError("The steps before this one are not done yet.", 409);
  }
  if (input.action === "skip" && !canSkipStep(input.reason)) {
    throw new StepRuleError("Skipping a step needs a written reason (at least 8 characters).", 422);
  }
  const status: StepStatus = input.action === "skip" ? "skipped" : "completed";
  await applyStepStatus({ transactionId: input.transactionId, stepKey: input.stepKey, status, actorUserId: input.actorUserId });
  if (status === "skipped") {
    await WorkflowStep.updateOne({ transactionId: input.transactionId, key: input.stepKey }, { $set: { skipReason: input.reason!.trim() } });
  }
  await writeAuditEvent({
    action: "workflow.step_" + (status === "skipped" ? "skipped" : "completed_by_staff"),
    targetType: "transaction",
    targetId: input.transactionId,
    actorUserId: input.actorUserId,
    metadata: { stepKey: input.stepKey, reason: input.reason },
  });
  return { stepKey: input.stepKey, status };
}
