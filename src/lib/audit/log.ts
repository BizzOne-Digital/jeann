import { Types } from "mongoose";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";

export interface AuditEventInput {
  action: string;
  targetType: string;
  targetId?: string | Types.ObjectId;
  actorUserId?: string | Types.ObjectId;
  actorOrganizationId?: string | Types.ObjectId;
  organizationId?: string | Types.ObjectId;
  requestId?: string;
  ipHash?: string;
  userAgent?: string;
  result?: "success" | "failure";
  failureReason?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

function toObjectId(value?: string | Types.ObjectId): Types.ObjectId | undefined {
  if (!value) return undefined;
  if (value instanceof Types.ObjectId) return value;
  if (!Types.ObjectId.isValid(value)) return undefined;
  return new Types.ObjectId(value);
}

function sanitizeMetadata(metadata?: Record<string, unknown>): Record<string, unknown> {
  if (!metadata) return {};
  const blocked = new Set(["password", "passwordHash", "token", "secret", "body", "content"]);
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (blocked.has(key.toLowerCase())) continue;
    if (typeof value === "string" && value.length > 500) {
      out[key] = `${value.slice(0, 500)}…`;
      continue;
    }
    out[key] = value;
  }
  return out;
}

export async function writeAuditEvent(input: AuditEventInput): Promise<string | null> {
  if (!isMongoConfigured()) {
    console.info("[audit]", {
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId?.toString(),
      actorUserId: input.actorUserId?.toString(),
      organizationId: input.organizationId?.toString(),
      requestId: input.requestId,
      metadata: sanitizeMetadata(input.metadata),
    });
    return null;
  }

  await tryConnectMongo();
  const { AuditEvent } = await import("@/models/AuditEvent");

  const doc = await AuditEvent.create({
    action: input.action,
    targetType: input.targetType,
    targetId: toObjectId(input.targetId),
    actorUserId: toObjectId(input.actorUserId),
    actorOrganizationId: toObjectId(input.actorOrganizationId),
    organizationId: toObjectId(input.organizationId),
    requestId: input.requestId,
    ipHash: input.ipHash,
    userAgent: input.userAgent,
    result: input.result ?? "success",
    failureReason: input.failureReason,
    before: input.before ? sanitizeMetadata(input.before) : undefined,
    after: input.after ? sanitizeMetadata(input.after) : undefined,
    metadata: sanitizeMetadata(input.metadata),
  });

  return doc._id.toString();
}
