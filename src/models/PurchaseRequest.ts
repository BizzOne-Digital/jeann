import { Schema, model, models, Types } from "mongoose";
import { attachmentSchema, type AttachmentFields, type LeanDoc } from "./shared";

export type PurchaseRequestStatus =
  | "draft"
  | "new"
  | "submitted"
  | "under_review"
  | "more_information_required"
  | "qualified"
  | "converted"
  | "declined"
  | "spam"
  | "archived"
  | "matched"
  | "closed"
  | "cancelled";

export type PurchaseRequestSource = "public_form" | "buyer_portal" | "admin" | "employee";

export interface IPurchaseRequest {
  reference: string;
  organizationId?: Types.ObjectId;
  submittedByUserId?: Types.ObjectId;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactCompany?: string;
  productId?: Types.ObjectId;
  productCategoryId?: Types.ObjectId;
  productName: string;
  specificationVersionId?: Types.ObjectId;
  requestedSpecification?: string;
  quantity?: string;
  unit?: string;
  quantityTolerance?: string;
  monthlyRequirement?: string;
  contractDuration?: string;
  originPreference?: string;
  frequency?: string;
  destinationCountry?: string;
  destinationPort?: string;
  loadingPort?: string;
  incoterm?: string;
  namedPortPlace?: string;
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
  requiredDocuments?: string[];
  notes?: string;
  message?: string;
  attachments: AttachmentFields[];
  status: PurchaseRequestStatus;
  assignedEmployeeId?: Types.ObjectId;
  convertedTransactionId?: Types.ObjectId;
  lockedAt?: Date;
  declineReason?: string;
  reviewComments?: string;
  termsVersion?: number;
  termsAcceptedAt?: Date;
  consentEvidence?: Record<string, unknown>;
  ipHash?: string;
  source?: PurchaseRequestSource;
}

export type PurchaseRequestLean = LeanDoc<IPurchaseRequest>;

const purchaseRequestSchema = new Schema<IPurchaseRequest>(
  {
    reference: { type: String, required: true, trim: true },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    submittedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    contactName: { type: String, trim: true },
    contactEmail: { type: String, lowercase: true, trim: true },
    contactPhone: { type: String, trim: true },
    contactCompany: { type: String, trim: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    productCategoryId: { type: Schema.Types.ObjectId, ref: "ProductCategory" },
    productName: { type: String, required: true, trim: true },
    specificationVersionId: { type: Schema.Types.ObjectId, ref: "ProductSpecificationVersion" },
    requestedSpecification: { type: String },
    quantity: { type: String },
    unit: { type: String },
    quantityTolerance: { type: String },
    monthlyRequirement: { type: String },
    contractDuration: { type: String },
    originPreference: { type: String },
    frequency: { type: String },
    destinationCountry: { type: String, uppercase: true },
    destinationPort: { type: String },
    loadingPort: { type: String },
    incoterm: { type: String, uppercase: true },
    namedPortPlace: { type: String },
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
    requiredDocuments: [{ type: String }],
    notes: { type: String },
    message: { type: String },
    attachments: [attachmentSchema],
    status: {
      type: String,
      enum: [
        "draft",
        "new",
        "submitted",
        "under_review",
        "more_information_required",
        "qualified",
        "converted",
        "declined",
        "spam",
        "archived",
        "matched",
        "closed",
        "cancelled",
      ],
      default: "submitted",
    },
    assignedEmployeeId: { type: Schema.Types.ObjectId, ref: "User" },
    convertedTransactionId: { type: Schema.Types.ObjectId, ref: "Transaction" },
    lockedAt: { type: Date },
    declineReason: { type: String },
    reviewComments: { type: String },
    termsVersion: { type: Number },
    termsAcceptedAt: { type: Date },
    consentEvidence: { type: Schema.Types.Mixed },
    ipHash: { type: String },
    source: {
      type: String,
      enum: ["public_form", "buyer_portal", "admin", "employee"],
      default: "public_form",
    },
  },
  { timestamps: true },
);

purchaseRequestSchema.index({ reference: 1 }, { unique: true });
purchaseRequestSchema.index({ organizationId: 1, status: 1, createdAt: -1 });
purchaseRequestSchema.index({ productId: 1, status: 1 });
purchaseRequestSchema.index({ convertedTransactionId: 1 }, { sparse: true });

export const PurchaseRequest =
  models.PurchaseRequest ?? model<IPurchaseRequest>("PurchaseRequest", purchaseRequestSchema);
