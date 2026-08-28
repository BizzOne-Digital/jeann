import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type CommercialTermsApprovalStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "changes_requested";

export interface ICommercialTerms {
  transactionId: Types.ObjectId;
  organizationId: Types.ObjectId;
  productId?: Types.ObjectId;
  productName: string;
  specificationVersionId?: Types.ObjectId;
  productOrigin?: string;
  quantity: Types.Decimal128;
  quantityUnit: string;
  quantityTolerance?: string;
  monthlyQuantity?: Types.Decimal128;
  contractDurationMonths?: number;
  currency: string;
  unitPrice: Types.Decimal128;
  totalEstimatedValue: Types.Decimal128;
  incoterm: string;
  namedPortPlace?: string;
  loadingPort?: string;
  destinationPort?: string;
  shipmentSchedule?: string;
  packaging?: string;
  inspectionCompany?: string;
  inspectionLocation?: string;
  paymentProposal?: string;
  bankingInstrumentProposal?: string;
  offerValidity?: string;
  requiredDocuments?: string[];
  internalNotes?: string;
  buyerVisibleNotes?: string;
  version: number;
  approvalStatus: CommercialTermsApprovalStatus;
  lockedAt?: Date;
}

export type CommercialTermsLean = LeanDoc<ICommercialTerms>;

const commercialTermsSchema = new Schema<ICommercialTerms>(
  {
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction", required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    productName: { type: String, required: true, trim: true },
    specificationVersionId: { type: Schema.Types.ObjectId, ref: "ProductSpecificationVersion" },
    productOrigin: { type: String, trim: true },
    quantity: { type: Schema.Types.Decimal128, required: true },
    quantityUnit: { type: String, required: true, trim: true },
    quantityTolerance: { type: String, trim: true },
    monthlyQuantity: { type: Schema.Types.Decimal128 },
    contractDurationMonths: { type: Number, min: 0 },
    currency: { type: String, required: true, uppercase: true, trim: true },
    unitPrice: { type: Schema.Types.Decimal128, required: true },
    totalEstimatedValue: { type: Schema.Types.Decimal128, required: true },
    incoterm: { type: String, required: true, trim: true },
    namedPortPlace: { type: String, trim: true },
    loadingPort: { type: String, trim: true },
    destinationPort: { type: String, trim: true },
    shipmentSchedule: { type: String, trim: true },
    packaging: { type: String, trim: true },
    inspectionCompany: { type: String, trim: true },
    inspectionLocation: { type: String, trim: true },
    paymentProposal: { type: String, trim: true },
    bankingInstrumentProposal: { type: String, trim: true },
    offerValidity: { type: String, trim: true },
    requiredDocuments: [{ type: String }],
    internalNotes: { type: String },
    buyerVisibleNotes: { type: String },
    version: { type: Number, required: true, min: 1, default: 1 },
    approvalStatus: {
      type: String,
      enum: ["draft", "submitted", "under_review", "approved", "changes_requested"],
      default: "draft",
    },
    lockedAt: { type: Date },
  },
  { timestamps: true },
);

commercialTermsSchema.index({ transactionId: 1, version: 1 }, { unique: true });

export const CommercialTerms =
  models.CommercialTerms ?? model<ICommercialTerms>("CommercialTerms", commercialTermsSchema);
