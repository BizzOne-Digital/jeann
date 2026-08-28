import { nanoid } from "nanoid";
import { Types } from "mongoose";
import { tryConnectMongo } from "@/lib/db/mongoose";
import type { IntegrationJobInput, UsageRecordInput } from "@/lib/integrations/types";

export async function enqueueIntegrationJob(input: IntegrationJobInput) {
  await tryConnectMongo();
  const { IntegrationJob } = await import("@/models");
  const correlationId = input.correlationId ?? nanoid();

  const existing = await IntegrationJob.findOne({ idempotencyKey: input.idempotencyKey }).lean();
  if (existing) return { job: existing, duplicate: true };

  const job = await IntegrationJob.create({
    providerAdapter: input.providerAdapter,
    jobType: input.jobType,
    internalEntityType: input.internalEntityType,
    internalEntityId: input.internalEntityId,
    idempotencyKey: input.idempotencyKey,
    attemptCount: 0,
    maxAttempts: input.maxAttempts ?? 5,
    scheduledAt: new Date(),
    status: "pending",
    correlationId,
  });

  return { job, duplicate: false };
}

export async function runIntegrationJob(jobId: string): Promise<void> {
  await tryConnectMongo();
  const { IntegrationJob } = await import("@/models");
  const job = await IntegrationJob.findById(jobId);
  if (!job || job.status === "succeeded" || job.status === "cancelled") return;

  job.status = "running";
  job.startedAt = new Date();
  job.attemptCount += 1;
  await job.save();
}

export async function completeIntegrationJob(
  jobId: string,
  success: boolean,
  errorSummary?: string,
): Promise<void> {
  await tryConnectMongo();
  const { IntegrationJob } = await import("@/models");
  const job = await IntegrationJob.findById(jobId);
  if (!job) return;

  if (success) {
    job.status = "succeeded";
    job.completedAt = new Date();
  } else {
    job.errorSummary = errorSummary;
    if (job.attemptCount >= job.maxAttempts) {
      job.status = "dead_letter";
    } else {
      job.status = "retry_scheduled";
      job.scheduledAt = new Date(Date.now() + job.attemptCount * 60_000);
    }
  }
  await job.save();

  const { writeAuditEvent } = await import("@/lib/audit/log");
  await writeAuditEvent({
    action: success ? "integration.job_succeeded" : "integration.job_failed",
    targetType: "integration_job",
    targetId: String(job._id),
    result: success ? "success" : "failure",
    metadata: { jobType: job.jobType, attempt: job.attemptCount },
  });
}

export async function recordProviderUsage(input: UsageRecordInput): Promise<string> {
  await tryConnectMongo();
  const { ProviderUsageRecord } = await import("@/models");
  const record = await ProviderUsageRecord.create({
    providerAdapter: input.providerAdapter,
    capability: input.capability,
    userId: input.userId ? new Types.ObjectId(input.userId) : undefined,
    organizationId: input.organizationId ? new Types.ObjectId(input.organizationId) : undefined,
    transactionId: input.transactionId ? new Types.ObjectId(input.transactionId) : undefined,
    documentId: input.documentId ? new Types.ObjectId(input.documentId) : undefined,
    requestAt: new Date(),
    modelOrEndpoint: input.modelOrEndpoint,
    inputSize: input.inputSize,
    outputSize: input.outputSize,
    tokenUsage: input.tokenUsage,
    estimatedCostUsd: input.estimatedCostUsd
      ? Types.Decimal128.fromString(input.estimatedCostUsd)
      : undefined,
    status: input.status,
    correlationId: input.correlationId,
  });
  return String(record._id);
}
