import type { Types } from "mongoose";
import {
  SecurityEvent,
  type SecurityEventSeverity,
} from "@/models/SecurityEvent";
import { connectMongo } from "@/lib/db/mongoose";

export interface LogSecurityEventInput {
  eventType: string;
  severity?: SecurityEventSeverity;
  userId?: Types.ObjectId | string;
  organizationId?: Types.ObjectId | string;
  ipAddress?: string;
  userAgent?: string;
  correlationId?: string;
  targetType?: string;
  targetId?: string;
  result: "success" | "failure" | "blocked";
  safeMetadata?: Record<string, unknown>;
  detectionSource?: string;
}

/** Redact values that must never appear in security-event metadata. */
const SENSITIVE_KEYS = [
  "password",
  "otp",
  "token",
  "secret",
  "authorization",
  "cookie",
  "session",
  "apiKey",
  "api_key",
];

export function sanitizeSecurityMetadata(
  metadata?: Record<string, unknown>,
): Record<string, unknown> | undefined {
  if (!metadata) return undefined;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(metadata)) {
    const lower = key.toLowerCase();
    if (SENSITIVE_KEYS.some((s) => lower.includes(s))) {
      out[key] = "[redacted]";
      continue;
    }
    if (typeof value === "string" && value.length > 500) {
      out[key] = value.slice(0, 500) + "…";
      continue;
    }
    out[key] = value;
  }
  return out;
}

export async function logSecurityEvent(input: LogSecurityEventInput): Promise<void> {
  try {
    await connectMongo();
    await SecurityEvent.create({
      eventType: input.eventType,
      severity: input.severity ?? inferSeverity(input),
      userId: input.userId,
      organizationId: input.organizationId,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      correlationId: input.correlationId,
      targetType: input.targetType,
      targetId: input.targetId,
      result: input.result,
      safeMetadata: sanitizeSecurityMetadata(input.safeMetadata),
      detectionSource: input.detectionSource ?? "application",
      reviewed: false,
    });
  } catch (error) {
    console.error("[security-event] failed to persist", error);
  }
}

function inferSeverity(input: LogSecurityEventInput): SecurityEventSeverity {
  if (input.result === "blocked") return "high";
  const type = input.eventType.toLowerCase();
  if (type.includes("cross_tenant") || type.includes("malware")) return "critical";
  if (type.includes("unauthorized") || type.includes("lockout")) return "high";
  if (type.includes("failed_login") || type.includes("rate_limit")) return "medium";
  return "low";
}

export interface SecurityDashboardSummary {
  failedLogins24h: number;
  lockedAccounts: number;
  unauthorizedAttempts24h: number;
  crossTenantAttempts24h: number;
  highSeverityOpenEvents: number;
  openIncidents: number;
  recentEvents: Array<{
    id: string;
    eventType: string;
    severity: string;
    result: string;
    createdAt: string;
  }>;
}

export async function getSecurityDashboardSummary(): Promise<SecurityDashboardSummary> {
  await connectMongo();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [
    failedLogins24h,
    unauthorizedAttempts24h,
    crossTenantAttempts24h,
    highSeverityOpenEvents,
    recentEvents,
  ] = await Promise.all([
    SecurityEvent.countDocuments({
      eventType: "auth.login.failed",
      createdAt: { $gte: since },
    }),
    SecurityEvent.countDocuments({
      eventType: { $regex: /unauthorized|access\.denied/i },
      createdAt: { $gte: since },
    }),
    SecurityEvent.countDocuments({
      eventType: { $regex: /cross_tenant/i },
      createdAt: { $gte: since },
    }),
    SecurityEvent.countDocuments({
      severity: { $in: ["high", "critical"] },
      reviewed: false,
    }),
    SecurityEvent.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(),
  ]);

  const { SecurityIncident } = await import("@/models/SecurityIncident");
  const openIncidents = await SecurityIncident.countDocuments({
    status: { $in: ["open", "investigating", "contained", "recovering"] },
  });

  const { User } = await import("@/models/User");
  const lockedAccounts = await User.countDocuments({
    lockedUntil: { $gt: new Date() },
  });

  return {
    failedLogins24h,
    lockedAccounts,
    unauthorizedAttempts24h,
    crossTenantAttempts24h,
    highSeverityOpenEvents,
    openIncidents,
    recentEvents: recentEvents.map((e) => ({
      id: String(e._id),
      eventType: e.eventType,
      severity: e.severity,
      result: e.result,
      createdAt: e.createdAt?.toISOString() ?? "",
    })),
  };
}
