import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type SecurityEventSeverity = "low" | "medium" | "high" | "critical";

export interface ISecurityEvent {
  eventType: string;
  severity: SecurityEventSeverity;
  userId?: Types.ObjectId;
  organizationId?: Types.ObjectId;
  ipAddress?: string;
  userAgent?: string;
  correlationId?: string;
  targetType?: string;
  targetId?: string;
  result: "success" | "failure" | "blocked";
  safeMetadata?: Record<string, unknown>;
  detectionSource: string;
  reviewed: boolean;
}

export type SecurityEventLean = LeanDoc<ISecurityEvent>;

const securityEventSchema = new Schema<ISecurityEvent>(
  {
    eventType: { type: String, required: true, index: true },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    ipAddress: { type: String },
    userAgent: { type: String },
    correlationId: { type: String, index: true },
    targetType: { type: String },
    targetId: { type: String },
    result: { type: String, enum: ["success", "failure", "blocked"], required: true },
    safeMetadata: { type: Schema.Types.Mixed },
    detectionSource: { type: String, default: "application" },
    reviewed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

securityEventSchema.index({ createdAt: -1 });
securityEventSchema.index({ severity: 1, reviewed: 1 });

export const SecurityEvent =
  models.SecurityEvent ?? model<ISecurityEvent>("SecurityEvent", securityEventSchema);
