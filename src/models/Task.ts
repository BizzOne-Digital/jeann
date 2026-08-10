import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type TaskStatus = "open" | "in_progress" | "completed" | "cancelled";

export interface ITask {
  organizationId?: Types.ObjectId;
  transactionId?: Types.ObjectId;
  assigneeUserId: Types.ObjectId;
  title: string;
  status: TaskStatus;
  dueAt?: Date;
}

export type TaskLean = LeanDoc<ITask>;

const taskSchema = new Schema<ITask>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction" },
    assigneeUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["open", "in_progress", "completed", "cancelled"],
      default: "open",
    },
    dueAt: { type: Date },
  },
  { timestamps: true },
);

taskSchema.index({ assigneeUserId: 1, status: 1, dueAt: 1 });
taskSchema.index({ transactionId: 1, status: 1 });
taskSchema.index({ organizationId: 1, status: 1 });

export const Task = models.Task ?? model<ITask>("Task", taskSchema);
