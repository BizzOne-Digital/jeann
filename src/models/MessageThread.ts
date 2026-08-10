import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type MessageThreadVisibility = "internal" | "external";

export interface IMessageThread {
  transactionId?: Types.ObjectId;
  organizationId?: Types.ObjectId;
  visibility: MessageThreadVisibility;
  subject: string;
}

export type MessageThreadLean = LeanDoc<IMessageThread>;

const messageThreadSchema = new Schema<IMessageThread>(
  {
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction" },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    visibility: {
      type: String,
      enum: ["internal", "external"],
      default: "external",
    },
    subject: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

messageThreadSchema.index({ transactionId: 1, createdAt: -1 });
messageThreadSchema.index({ organizationId: 1, visibility: 1 });

export const MessageThread =
  models.MessageThread ?? model<IMessageThread>("MessageThread", messageThreadSchema);
