import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";
import { KYB_ITEM_STATUSES, VALIDATION_OUTCOMES } from "@/lib/kyb/checklist";

/** STAFF-ONLY. Never serialize to buyer/supplier portals. */
export interface IKybItem {
  /** Section key + item index for checklist items (e.g. "ownership_ubo:1"), or the check key. */
  key: string;
  status: (typeof KYB_ITEM_STATUSES)[number];
  notes?: string;
  source?: string;
  evidence?: string;
  discrepancies?: string;
  outstandingRisks?: string;
  verifiedAt?: Date;
  verifiedBy?: Types.ObjectId;
}

export interface IKybValidationRecord {
  organizationId: Types.ObjectId;
  checklist: IKybItem[];
  commodityChecks: IKybItem[];
  validationChecks: IKybItem[];
  outcome?: (typeof VALIDATION_OUTCOMES)[number];
  outcomeReport?: string;
  outcomeAt?: Date;
  outcomeBy?: Types.ObjectId;
  waiver?: { waived: boolean; reason?: string; byUserId?: Types.ObjectId; at?: Date };
  /** Buyers: KYB is optional by default; staff can choose to require it for a specific buyer. */
  kybRequired?: boolean;
  approvalOverride?: { reason: string; byUserId: Types.ObjectId; at: Date; outcomeAtOverride?: string };
}

export type KybValidationRecordLean = LeanDoc<IKybValidationRecord>;

const itemSchema = new Schema<IKybItem>(
  {
    key: { type: String, required: true },
    status: { type: String, enum: KYB_ITEM_STATUSES, default: "not_started" },
    notes: { type: String, maxlength: 2000 },
    source: { type: String, maxlength: 500 },
    evidence: { type: String, maxlength: 2000 },
    discrepancies: { type: String, maxlength: 2000 },
    outstandingRisks: { type: String, maxlength: 2000 },
    verifiedAt: { type: Date },
    verifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false },
);

const kybValidationRecordSchema = new Schema<IKybValidationRecord>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, unique: true },
    checklist: { type: [itemSchema], default: [] },
    commodityChecks: { type: [itemSchema], default: [] },
    validationChecks: { type: [itemSchema], default: [] },
    outcome: { type: String, enum: VALIDATION_OUTCOMES },
    outcomeReport: { type: String, maxlength: 8000 },
    outcomeAt: { type: Date },
    outcomeBy: { type: Schema.Types.ObjectId, ref: "User" },
    waiver: {
      type: new Schema(
        {
          waived: { type: Boolean, default: false },
          reason: { type: String, maxlength: 2000 },
          byUserId: { type: Schema.Types.ObjectId, ref: "User" },
          at: { type: Date },
        },
        { _id: false },
      ),
    },
    kybRequired: { type: Boolean, default: false },
    approvalOverride: {
      type: new Schema(
        {
          reason: { type: String, required: true, maxlength: 2000 },
          byUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
          at: { type: Date, required: true },
          outcomeAtOverride: { type: String },
        },
        { _id: false },
      ),
    },
  },
  { timestamps: true },
);

export const KybValidationRecord =
  models.KybValidationRecord ??
  model<IKybValidationRecord>("KybValidationRecord", kybValidationRecordSchema);
