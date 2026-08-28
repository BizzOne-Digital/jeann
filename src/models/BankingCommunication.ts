import { Schema, model, models, Types } from "mongoose";
import { attachmentSchema, type AttachmentFields, type LeanDoc } from "./shared";

export type BankingCommunicationChannel =
  | "portal"
  | "email"
  | "phone"
  | "meeting"
  | "courier"
  | "bank_portal"
  | "swift_reference_recorded"
  | "other";

export interface IBankingCommunication {
  bankingInstrumentId: Types.ObjectId;
  senderUserId?: Types.ObjectId;
  recipientType: string;
  channel: BankingCommunicationChannel;
  subject: string;
  summary: string;
  occurredAt: Date;
  direction: "inbound" | "outbound" | "internal";
  attachments: AttachmentFields[];
  externalReference?: string;
  verificationStatus: string;
  internalVisible: boolean;
  counterpartyVisible: boolean;
  adviserVisible: boolean;
  createdByUserId: Types.ObjectId;
}

export type BankingCommunicationLean = LeanDoc<IBankingCommunication>;

const bankingCommunicationSchema = new Schema<IBankingCommunication>(
  {
    bankingInstrumentId: { type: Schema.Types.ObjectId, ref: "BankingInstrument", required: true },
    senderUserId: { type: Schema.Types.ObjectId, ref: "User" },
    recipientType: { type: String, required: true },
    channel: {
      type: String,
      enum: [
        "portal",
        "email",
        "phone",
        "meeting",
        "courier",
        "bank_portal",
        "swift_reference_recorded",
        "other",
      ],
      required: true,
    },
    subject: { type: String, required: true, trim: true },
    summary: { type: String, required: true },
    occurredAt: { type: Date, required: true },
    direction: { type: String, enum: ["inbound", "outbound", "internal"], required: true },
    attachments: [attachmentSchema],
    externalReference: { type: String },
    verificationStatus: { type: String, default: "recorded" },
    internalVisible: { type: Boolean, default: true },
    counterpartyVisible: { type: Boolean, default: false },
    adviserVisible: { type: Boolean, default: false },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

bankingCommunicationSchema.index({ bankingInstrumentId: 1, occurredAt: -1 });

export const BankingCommunication =
  models.BankingCommunication ??
  model<IBankingCommunication>("BankingCommunication", bankingCommunicationSchema);
