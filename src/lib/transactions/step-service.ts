import { tryConnectMongo } from "@/lib/db/mongoose";
import { writeAuditEvent } from "@/lib/audit/log";
import type { StepStatus, WorkflowStepDef } from "@/lib/workflows/transitions";
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

/** Throws StepRuleError when the document action is not allowed at the current step. */
export async function assertDocumentAllowed(input: {
  tx: { _id: unknown; side?: string; transactionType?: string };
  isInternal: boolean;
  documentType: string;
  action: "upload" | "create" | "send";
}) {
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
}) {
  const steps = await loadStepDefs(input.tx._id);
  const msg = checkSignAction({ side: sideOf(input.tx), signer: input.signer, steps });
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

  const target = targetWorkflowStatus(side, input.stepKey, input.status);
  if (target) {
    const path = findPath(transitionTable(side), tx.workflowStatus, target);
    if (path && path.length) tx.workflowStatus = path[path.length - 1] as typeof tx.workflowStatus;
  }
  if (tx.workflowStatus === "contract_executed" || tx.workflowStatus === "instrument_issuance_requested") {
    tx.status = "completed";
  }
  await tx.save();

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
  const update = stepUpdateForEvent(sideOf(tx), input.documentType, input.event, input.signer);
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
