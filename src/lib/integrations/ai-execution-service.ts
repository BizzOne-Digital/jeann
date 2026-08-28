import { nanoid } from "nanoid";
import { Types } from "mongoose";
import { writeAuditEvent } from "@/lib/audit/log";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { isFeatureEnabled } from "@/lib/integrations/feature-flags";
import { getAIProvider } from "@/lib/integrations/providers/ai-registry";
import { recordProviderUsage } from "@/lib/integrations/job-service";
import { redactSensitive } from "@/lib/ai/security";

const QA_MARKER = "DEVELOPMENT TEST RESPONSE — NOT FROM A REAL PROVIDER";

export async function runDocumentExtraction(input: {
  documentVersionId: string;
  documentType: string;
  text: string;
  userId: string;
  organizationId?: string;
  transactionId?: string;
  dataClassification?: string;
}) {
  if (!(await isFeatureEnabled("ai_document_extraction"))) {
    throw new Error("feature_disabled");
  }

  await tryConnectMongo();
  const { DocumentVersion, AIExecution } = await import("@/models");
  const version = await DocumentVersion.findById(input.documentVersionId).lean();
  if (!version) throw new Error("document_not_found");

  const provider = getAIProvider();
  const correlationId = nanoid();
  const redactedText = redactSensitive(input.text);

  const result = await provider.extractDocumentFields({
    documentType: input.documentType,
    text: redactedText,
  });

  const usageId = await recordProviderUsage({
    providerAdapter: provider.adapterCode,
    capability: "extract_document_fields",
    userId: input.userId,
    organizationId: input.organizationId,
    transactionId: input.transactionId,
    documentId: String(version.documentId),
    modelOrEndpoint: result.model,
    inputSize: redactedText.length,
    outputSize: result.rawText?.length,
    tokenUsage: result.tokenUsage,
    status: result.ok ? "success" : result.status,
    correlationId,
  });

  const execution = await AIExecution.create({
    providerAdapter: provider.adapterCode,
    model: result.model,
    capability: "extract_document_fields",
    userId: new Types.ObjectId(input.userId),
    organizationId: input.organizationId ? new Types.ObjectId(input.organizationId) : undefined,
    transactionId: input.transactionId ? new Types.ObjectId(input.transactionId) : undefined,
    documentVersionId: version._id,
    dataClassification: input.dataClassification ?? "confidential",
    structuredOutput: result.data ?? {},
    outputText: result.rawText,
    humanReviewStatus: "pending_review",
    usageRecordId: new Types.ObjectId(usageId),
    qaMarker: provider.adapterCode.includes("mock") ? QA_MARKER : undefined,
  });

  await writeAuditEvent({
    action: "ai.execution.created",
    targetType: "ai_execution",
    targetId: String(execution._id),
    actorUserId: input.userId,
    result: result.ok ? "success" : "failure",
    metadata: { capability: "extract_document_fields" },
  });

  return { execution, result };
}

export async function runDocumentComparison(input: {
  leftLabel: string;
  leftText: string;
  rightLabel: string;
  rightText: string;
  userId: string;
  transactionId?: string;
}) {
  if (!(await isFeatureEnabled("ai_document_comparison"))) {
    throw new Error("feature_disabled");
  }

  const provider = getAIProvider();
  const correlationId = nanoid();
  const result = await provider.compareDocuments({
    leftLabel: input.leftLabel,
    leftText: redactSensitive(input.leftText),
    rightLabel: input.rightLabel,
    rightText: redactSensitive(input.rightText),
  });

  await tryConnectMongo();
  const { AIExecution } = await import("@/models");
  const usageId = await recordProviderUsage({
    providerAdapter: provider.adapterCode,
    capability: "compare_documents",
    userId: input.userId,
    transactionId: input.transactionId,
    modelOrEndpoint: result.model,
    status: result.ok ? "success" : result.status,
    correlationId,
  });

  const execution = await AIExecution.create({
    providerAdapter: provider.adapterCode,
    model: result.model,
    capability: "compare_documents",
    userId: new Types.ObjectId(input.userId),
    transactionId: input.transactionId ? new Types.ObjectId(input.transactionId) : undefined,
    dataClassification: "confidential",
    structuredOutput: result.data ?? {},
    humanReviewStatus: "pending_review",
    usageRecordId: new Types.ObjectId(usageId),
    qaMarker: provider.adapterCode.includes("mock") ? QA_MARKER : undefined,
  });

  await writeAuditEvent({
    action: "ai.execution.created",
    targetType: "ai_execution",
    targetId: String(execution._id),
    actorUserId: input.userId,
    result: result.ok ? "success" : "failure",
    metadata: { capability: "compare_documents" },
  });

  return { execution, result };
}

export async function reviewAIExecution(input: {
  executionId: string;
  reviewerUserId: string;
  decision: "accepted" | "rejected" | "partially_accepted";
  notes?: string;
}) {
  await tryConnectMongo();
  const { AIExecution } = await import("@/models");
  const execution = await AIExecution.findById(input.executionId);
  if (!execution) throw new Error("not_found");

  execution.humanReviewStatus = input.decision;
  execution.reviewedByUserId = new Types.ObjectId(input.reviewerUserId);
  execution.reviewDecision = input.decision;
  execution.reviewNotes = input.notes;
  await execution.save();

  await writeAuditEvent({
    action: "ai.output_reviewed",
    targetType: "ai_execution",
    targetId: String(execution._id),
    actorUserId: input.reviewerUserId,
    result: "success",
    metadata: { decision: input.decision },
  });

  return execution;
}
