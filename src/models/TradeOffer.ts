import { Schema, model, models, Types } from "mongoose";
import { attachmentSchema, type AttachmentFields, type LeanDoc } from "./shared";

export type TradeOfferStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "published"
  | "expired"
  | "withdrawn";

export interface ITradeOffer {
  reference: string;
  organizationId: Types.ObjectId;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  productId?: Types.ObjectId;
  productName: string;
  quantity?: string;
  unit?: string;
  originCountry?: string;
  originPort?: string;
  incoterm?: string;
  packaging?: string;
  inspection?: string;
  timeline?: string;
  paymentTerms?: string;
  priceIndication?: string;
  notes?: string;
  attachments: AttachmentFields[];
  status: TradeOfferStatus;
  termsVersion?: number;
  termsAcceptedAt?: Date;
  ipHash?: string;
  source?: string;
  expiresAt?: Date;
}

export type TradeOfferLean = LeanDoc<ITradeOffer>;

const tradeOfferSchema = new Schema<ITradeOffer>(
  {
    reference: { type: String, required: true, trim: true },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    contactName: { type: String, trim: true },
    contactEmail: { type: String, lowercase: true, trim: true },
    contactPhone: { type: String, trim: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    productName: { type: String, required: true, trim: true },
    quantity: { type: String },
    unit: { type: String },
    originCountry: { type: String, uppercase: true },
    originPort: { type: String },
    incoterm: { type: String, uppercase: true },
    packaging: { type: String },
    inspection: { type: String },
    timeline: { type: String },
    paymentTerms: { type: String },
    priceIndication: { type: String },
    notes: { type: String },
    attachments: [attachmentSchema],
    status: {
      type: String,
      enum: ["draft", "submitted", "under_review", "published", "expired", "withdrawn"],
      default: "draft",
    },
    termsVersion: { type: Number },
    termsAcceptedAt: { type: Date },
    ipHash: { type: String },
    source: { type: String },
    expiresAt: { type: Date },
  },
  { timestamps: true },
);

tradeOfferSchema.index({ reference: 1 }, { unique: true });
tradeOfferSchema.index({ organizationId: 1, status: 1, createdAt: -1 });
tradeOfferSchema.index({ productId: 1, status: 1 });

export const TradeOffer =
  models.TradeOffer ?? model<ITradeOffer>("TradeOffer", tradeOfferSchema);
