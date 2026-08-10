import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type ApprovalDecision = "approved" | "rejected" | "pending";

export interface IApproval {
  targetType: string;
  targetId: Types.ObjectId;
  decision: ApprovalDecision;
  actorUserId: Types.ObjectId;
  reason?: string;
}

export type ApprovalLean = LeanDoc<IApproval>;

const approvalSchema = new Schema<IApproval>(
  {
    targetType: { type: String, required: true, trim: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    decision: {
      type: String,
      enum: ["approved", "rejected", "pending"],
      required: true,
    },
    actorUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String },
  },
  { timestamps: true },
);

approvalSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });
approvalSchema.index({ actorUserId: 1, createdAt: -1 });

export const Approval = models.Approval ?? model<IApproval>("Approval", approvalSchema);
