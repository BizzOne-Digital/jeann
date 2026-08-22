import { Schema, model, models, Types } from "mongoose";
import { attachmentSchema, type AttachmentFields, type LeanDoc } from "./shared";

export type PurchaseRequestStatus =
  | "submitted"
  | "under_review"
  | "matched"
  | "closed"
  | "cancelled";

export interface IPurchaseRequest {
  reference: string;
  organizationId?: Types.ObjectId;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactCompany?: string;
  productId?: Types.ObjectId;
  productName: string;
  quantity?: string;
  unit?: string;
  frequency?: string;
  destinationCountry?: string;
  destinationPort?: string;
  incoterm?: string;
  packaging?: string;
  inspection?: string;
  timeline?: string;
  paymentPreference?: string;
  paymentTermId?: string;
  iccCode?: string;
  productSlug?: string;
  productGrade?: string;
  pricePerMt?: number;
  monthlyDeliveryTotal?: number;
  deliveryCount?: number;
  contractYears?: number;
  contractTotal?: number;
  notes?: string;
  attachments: AttachmentFields[];
  status: PurchaseRequestStatus;
  termsVersion?: number;
  termsAcceptedAt?: Date;
  ipHash?: string;
  source?: string;
}

export type PurchaseRequestLean = LeanDoc<IPurchaseRequest>;

const purchaseRequestSchema = new Schema<IPurchaseRequest>(
  {
    reference: { type: String, required: true, trim: true },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    contactName: { type: String, trim: true },
    contactEmail: { type: String, lowercase: true, trim: true },
    contactPhone: { type: String, trim: true },
    contactCompany: { type: String, trim: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    productName: { type: String, required: true, trim: true },
    quantity: { type: String },
    unit: { type: String },
    frequency: { type: String },
    destinationCountry: { type: String, uppercase: true },
    destinationPort: { type: String },
    incoterm: { type: String, uppercase: true },
    packaging: { type: String },
    inspection: { type: String },
    timeline: { type: String },
    paymentPreference: { type: String },
    paymentTermId: { type: String },
    iccCode: { type: String },
    productSlug: { type: String },
    productGrade: { type: String },
    pricePerMt: { type: Number },
    monthlyDeliveryTotal: { type: Number },
    deliveryCount: { type: Number },
    contractYears: { type: Number },
    contractTotal: { type: Number },
    notes: { type: String },
    attachments: [attachmentSchema],
    status: {
      type: String,
      enum: ["submitted", "under_review", "matched", "closed", "cancelled"],
      default: "submitted",
    },
    termsVersion: { type: Number },
    termsAcceptedAt: { type: Date },
    ipHash: { type: String },
    source: { type: String },
  },
  { timestamps: true },
);

purchaseRequestSchema.index({ reference: 1 }, { unique: true });
purchaseRequestSchema.index({ organizationId: 1, status: 1, createdAt: -1 });
purchaseRequestSchema.index({ productId: 1, status: 1 });

export const PurchaseRequest =
  models.PurchaseRequest ?? model<IPurchaseRequest>("PurchaseRequest", purchaseRequestSchema);
