import { Schema, model, models, Types } from "mongoose";
import { contactSchema, type ContactFields, type LeanDoc } from "./shared";

export type LeadStage =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "won"
  | "lost";

export interface LeadConsent {
  marketing: boolean;
  termsAccepted: boolean;
  consentedAt?: Date;
}

export interface ILead {
  source: string;
  stage: LeadStage;
  ownerUserId?: Types.ObjectId;
  contact: ContactFields;
  company?: string;
  consent: LeadConsent;
  notes?: string;
  convertedOrganizationId?: Types.ObjectId;
}

export type LeadLean = LeanDoc<ILead>;

const leadConsentSchema = new Schema<LeadConsent>(
  {
    marketing: { type: Boolean, default: false },
    termsAccepted: { type: Boolean, default: false },
    consentedAt: { type: Date },
  },
  { _id: false },
);

const leadSchema = new Schema<ILead>(
  {
    source: { type: String, required: true, trim: true },
    stage: {
      type: String,
      enum: ["new", "contacted", "qualified", "proposal", "won", "lost"],
      default: "new",
    },
    ownerUserId: { type: Schema.Types.ObjectId, ref: "User" },
    contact: { type: contactSchema, required: true },
    company: { type: String, trim: true },
    consent: { type: leadConsentSchema, default: () => ({}) },
    notes: { type: String },
    convertedOrganizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
  },
  { timestamps: true },
);

leadSchema.index({ stage: 1, createdAt: -1 });
leadSchema.index({ ownerUserId: 1, stage: 1 });
leadSchema.index({ "contact.email": 1 }, { sparse: true });

export const Lead = models.Lead ?? model<ILead>("Lead", leadSchema);
