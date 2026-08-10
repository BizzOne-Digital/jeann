import { Schema, model, models, Types } from "mongoose";
import { attachmentSchema, type AttachmentFields, type LeanDoc } from "./shared";

export interface MessageReadReceipt {
  userId: Types.ObjectId;
  readAt: Date;
}

export interface IMessage {
  threadId: Types.ObjectId;
  authorUserId: Types.ObjectId;
  body: string;
  attachments: AttachmentFields[];
  readBy: MessageReadReceipt[];
}

export type MessageLean = LeanDoc<IMessage>;

const readReceiptSchema = new Schema<MessageReadReceipt>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    readAt: { type: Date, required: true, default: () => new Date() },
  },
  { _id: false },
);

const messageSchema = new Schema<IMessage>(
  {
    threadId: {
      type: Schema.Types.ObjectId,
      ref: "MessageThread",
      required: true,
    },
    authorUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true },
    attachments: [attachmentSchema],
    readBy: [readReceiptSchema],
  },
  { timestamps: true },
);

messageSchema.index({ threadId: 1, createdAt: 1 });
messageSchema.index({ authorUserId: 1, createdAt: -1 });

export const Message = models.Message ?? model<IMessage>("Message", messageSchema);
