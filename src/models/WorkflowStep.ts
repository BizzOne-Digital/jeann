import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type WorkflowStepStatus =
  | "not_started"
  | "ready"
  | "in_progress"
  | "submitted"
  | "changes_requested"
  | "approved"
  | "rejected"
  | "skipped"
  | "completed"
  | "expired";

export interface IWorkflowStep {
  transactionId: Types.ObjectId;
  key: string;
  order: number;
  title: string;
  status: WorkflowStepStatus;
  ownerUserId?: Types.ObjectId;
  dueAt?: Date;
  skipReason?: string;
  formData?: Record<string, unknown>;
  locked: boolean;
}

export type WorkflowStepLean = LeanDoc<IWorkflowStep>;

const workflowStepSchema = new Schema<IWorkflowStep>(
  {
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
    },
    key: { type: String, required: true, trim: true },
    order: { type: Number, required: true, min: 0 },
    title: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "not_started",
        "ready",
        "in_progress",
        "submitted",
        "changes_requested",
        "approved",
        "rejected",
        "skipped",
        "completed",
        "expired",
      ],
      default: "not_started",
    },
    ownerUserId: { type: Schema.Types.ObjectId, ref: "User" },
    dueAt: { type: Date },
    skipReason: { type: String },
    formData: { type: Schema.Types.Mixed },
    locked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

workflowStepSchema.index({ transactionId: 1, key: 1 }, { unique: true });
workflowStepSchema.index({ transactionId: 1, order: 1 });
workflowStepSchema.index({ ownerUserId: 1, status: 1, dueAt: 1 });

export const WorkflowStep =
  models.WorkflowStep ?? model<IWorkflowStep>("WorkflowStep", workflowStepSchema);
