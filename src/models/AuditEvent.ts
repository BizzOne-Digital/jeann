import { Schema, model, models, Types } from "mongoose";

export interface IAuditEvent {
  actorUserId?: Types.ObjectId;
  actorOrganizationId?: Types.ObjectId;
  action: string;
  targetType?: string;
  targetId?: Types.ObjectId;
  organizationId?: Types.ObjectId;
  requestId?: string;
  ipHash?: string;
  userAgent?: string;
  result: "success" | "failure";
  failureReason?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export type AuditEventLean = IAuditEvent & { _id: Types.ObjectId };

const auditEventSchema = new Schema<IAuditEvent>(
  {
    actorUserId: { type: Schema.Types.ObjectId, ref: "User" },
    actorOrganizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    action: { type: String, required: true, trim: true },
    targetType: { type: String, trim: true },
    targetId: { type: Schema.Types.ObjectId },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    requestId: { type: String, trim: true },
    ipHash: { type: String },
    userAgent: { type: String },
    result: { type: String, enum: ["success", "failure"], default: "success" },
    failureReason: { type: String },
    before: { type: Schema.Types.Mixed },
    after: { type: Schema.Types.Mixed },
    metadata: { type: Schema.Types.Mixed },
    createdAt: { type: Date, required: true, default: () => new Date() },
  },
  { timestamps: false },
);

auditEventSchema.index({ organizationId: 1, createdAt: -1 });
auditEventSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });
auditEventSchema.index({ actorUserId: 1, createdAt: -1 });
auditEventSchema.index({ action: 1, createdAt: -1 });
auditEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 365 * 7 });

export const AuditEvent =
  models.AuditEvent ?? model<IAuditEvent>("AuditEvent", auditEventSchema);
