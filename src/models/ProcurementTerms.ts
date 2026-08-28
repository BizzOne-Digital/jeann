import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type ProcurementTermsApprovalStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "changes_requested";

export interface IProcurementTerms {
  transactionId: Types.ObjectId;
  organizationId: Types.ObjectId;
  productId?: Types.ObjectId;
  productName: string;
  specificationVersionId?: Types.ObjectId;
  productOrigin?: string;
  quantity: Types.Decimal128;
  quantityUnit: string;
  quantityTolerance?: string;
  monthlyCapacity?: Types.Decimal128;
  contractDurationMonths?: number;
  currency: string;
  procurementUnitPrice: Types.Decimal128;
  procurementTotal: Types.Decimal128;
  incoterm: string;
  namedPortPlace?: string;
  loadingPort?: string;
  destinationPlace?: string;
  packaging?: string;
  inspection?: string;
  shipmentSchedule?: string;
  paymentProposal?: string;
  proposedBankingInstrument?: string;
  requiredDocuments?: string[];
  offerValidity?: string;
  internalNotes?: string;
  supplierVisibleNotes?: string;
  version: number;
  approvalStatus: ProcurementTermsApprovalStatus;
  lockedAt?: Date;
}

export type ProcurementTermsLean = LeanDoc<IProcurementTerms>;

const procurementTermsSchema = new Schema<IProcurementTerms>(
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
    monthlyCapacity: { type: Schema.Types.Decimal128 },
    contractDurationMonths: { type: Number, min: 0 },
    currency: { type: String, required: true, uppercase: true, trim: true },
    procurementUnitPrice: { type: Schema.Types.Decimal128, required: true },
    procurementTotal: { type: Schema.Types.Decimal128, required: true },
    incoterm: { type: String, required: true, trim: true },
    namedPortPlace: { type: String, trim: true },
    loadingPort: { type: String, trim: true },
    destinationPlace: { type: String, trim: true },
    packaging: { type: String, trim: true },
    inspection: { type: String, trim: true },
    shipmentSchedule: { type: String, trim: true },
    paymentProposal: { type: String, trim: true },
    proposedBankingInstrument: { type: String, trim: true },
    requiredDocuments: [{ type: String }],
    offerValidity: { type: String, trim: true },
    internalNotes: { type: String },
    supplierVisibleNotes: { type: String },
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

procurementTermsSchema.index({ transactionId: 1, version: 1 }, { unique: true });

export const ProcurementTerms =
  models.ProcurementTerms ??
  model<IProcurementTerms>("ProcurementTerms", procurementTermsSchema);
