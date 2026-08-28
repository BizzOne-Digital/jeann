import { Schema, model, models, Types } from "mongoose";
import { attachmentSchema, type AttachmentFields, type LeanDoc } from "./shared";

export type SupplierOfferStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "more_information_required"
  | "qualified"
  | "converted"
  | "declined"
  | "spam"
  | "archived";

export type SupplierOfferSource = "portal" | "employee" | "trade_offer_lead";

export interface ISupplierOffer {
  offerId: string;
  source: SupplierOfferSource;
  organizationId: Types.ObjectId;
  submittedByUserId?: Types.ObjectId;
  tradeOfferId?: Types.ObjectId;
  productCategory?: string;
  productId?: Types.ObjectId;
  productName: string;
  specification?: string;
  origin?: string;
  availableQuantity?: string;
  unit?: string;
  monthlyCapacity?: string;
  price?: string;
  currency?: string;
  loadingPort?: string;
  incoterm?: string;
  packaging?: string;
  inspectionAvailability?: string;
  certifications?: string[];
  offerValidity?: string;
  supportingFiles: AttachmentFields[];
  status: SupplierOfferStatus;
  assignedEmployeeId?: Types.ObjectId;
  convertedProcurementTransactionId?: Types.ObjectId;
  reviewNotes?: string;
  declinedReason?: string;
}

export type SupplierOfferLean = LeanDoc<ISupplierOffer>;

const supplierOfferSchema = new Schema<ISupplierOffer>(
  {
    offerId: { type: String, required: true, trim: true },
    source: {
      type: String,
      enum: ["portal", "employee", "trade_offer_lead"],
      default: "portal",
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    submittedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    tradeOfferId: { type: Schema.Types.ObjectId, ref: "TradeOffer" },
    productCategory: { type: String, trim: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    productName: { type: String, required: true, trim: true },
    specification: { type: String },
    origin: { type: String, trim: true },
    availableQuantity: { type: String },
    unit: { type: String },
    monthlyCapacity: { type: String },
    price: { type: String },
    currency: { type: String, uppercase: true, trim: true },
    loadingPort: { type: String },
    incoterm: { type: String, uppercase: true },
    packaging: { type: String },
    inspectionAvailability: { type: String },
    certifications: [{ type: String }],
    offerValidity: { type: String },
    supportingFiles: [attachmentSchema],
    status: {
      type: String,
      enum: [
        "draft",
        "submitted",
        "under_review",
        "more_information_required",
        "qualified",
        "converted",
        "declined",
        "spam",
        "archived",
      ],
      default: "draft",
    },
    assignedEmployeeId: { type: Schema.Types.ObjectId, ref: "User" },
    convertedProcurementTransactionId: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
    },
    reviewNotes: { type: String },
    declinedReason: { type: String },
  },
  { timestamps: true },
);

supplierOfferSchema.index({ offerId: 1 }, { unique: true });
supplierOfferSchema.index({ organizationId: 1, status: 1, createdAt: -1 });
supplierOfferSchema.index({ tradeOfferId: 1 }, { sparse: true });

export const SupplierOffer =
  models.SupplierOffer ?? model<ISupplierOffer>("SupplierOffer", supplierOfferSchema);
