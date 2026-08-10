import { Schema, model, models, Types } from "mongoose";

export interface IAuditEvent {
  actorUserId?: Types.ObjectId;
  action: string;
  targetType?: string;
  targetId?: Types.ObjectId;
  organizationId?: Types.ObjectId;
  requestId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export type AuditEventLean = IAuditEvent & { _id: Types.ObjectId };

const auditEventSchema = new Schema<IAuditEvent>(
  {
    actorUserId: { type: Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true, trim: true },
    targetType: { type: String, trim: true },
    targetId: { type: Schema.Types.ObjectId },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    requestId: { type: String, trim: true },
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
