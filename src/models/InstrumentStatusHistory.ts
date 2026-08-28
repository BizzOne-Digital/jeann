import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export interface IInstrumentStatusHistory {
  bankingInstrumentId: Types.ObjectId;
  previousStatus: string;
  newStatus: string;
  actorUserId: Types.ObjectId;
  reason?: string;
  supportingEvidence?: string;
  requestContext?: string;
  transitionedAt: Date;
}

export type InstrumentStatusHistoryLean = LeanDoc<IInstrumentStatusHistory>;

const instrumentStatusHistorySchema = new Schema<IInstrumentStatusHistory>(
  {
    bankingInstrumentId: { type: Schema.Types.ObjectId, ref: "BankingInstrument", required: true },
    previousStatus: { type: String, required: true },
    newStatus: { type: String, required: true },
    actorUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String },
    supportingEvidence: { type: String },
    requestContext: { type: String },
    transitionedAt: { type: Date, required: true, default: () => new Date() },
  },
  { timestamps: true },
);

instrumentStatusHistorySchema.index({ bankingInstrumentId: 1, transitionedAt: -1 });

export const InstrumentStatusHistory =
  models.InstrumentStatusHistory ??
  model<IInstrumentStatusHistory>("InstrumentStatusHistory", instrumentStatusHistorySchema);
