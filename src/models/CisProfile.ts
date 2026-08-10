import { Schema, model, models, Types } from "mongoose";
import {
  addressSchema,
  contactSchema,
  type AddressFields,
  type ContactFields,
  type LeanDoc,
} from "./shared";

export type CisProfileStatus = "draft" | "submitted" | "approved";

export interface CisRepresentative {
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  nationality?: string;
  ownershipPercent?: string;
}

export interface CisAuthorizedSigner {
  name: string;
  title?: string;
  email?: string;
  authorizedAt?: Date;
}

export interface CisProductInterest {
  productId?: Types.ObjectId;
  productName?: string;
  notes?: string;
}

export interface CisSensitiveFieldsMasked {
  taxId?: boolean;
  bankDetails?: boolean;
  registrationNumber?: boolean;
}

export interface ICisProfile {
  organizationId: Types.ObjectId;
  version: number;
  status: CisProfileStatus;
  legalName: string;
  tradingName?: string;
  registrationNumber?: string;
  taxId?: string;
  incorporationDate?: Date;
  jurisdiction?: string;
  businessType?: string;
  website?: string;
  representatives: CisRepresentative[];
  contacts: ContactFields[];
  addresses: AddressFields[];
  productInterests: CisProductInterest[];
  authorizedSigners: CisAuthorizedSigner[];
  sensitiveFieldsMasked: CisSensitiveFieldsMasked;
  approvedAt?: Date;
}

export type CisProfileLean = LeanDoc<ICisProfile>;

const representativeSchema = new Schema<CisRepresentative>(
  {
    name: { type: String, required: true },
    title: { type: String },
    email: { type: String, lowercase: true },
    phone: { type: String },
    nationality: { type: String },
    ownershipPercent: { type: String },
  },
  { _id: false },
);

const authorizedSignerSchema = new Schema<CisAuthorizedSigner>(
  {
    name: { type: String, required: true },
    title: { type: String },
    email: { type: String, lowercase: true },
    authorizedAt: { type: Date },
  },
  { _id: false },
);

const productInterestSchema = new Schema<CisProductInterest>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    productName: { type: String },
    notes: { type: String },
  },
  { _id: false },
);

const sensitiveFieldsMaskedSchema = new Schema<CisSensitiveFieldsMasked>(
  {
    taxId: { type: Boolean, default: false },
    bankDetails: { type: Boolean, default: false },
    registrationNumber: { type: Boolean, default: false },
  },
  { _id: false },
);

const cisProfileSchema = new Schema<ICisProfile>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    version: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["draft", "submitted", "approved"],
      default: "draft",
    },
    legalName: { type: String, required: true, trim: true },
    tradingName: { type: String, trim: true },
    registrationNumber: { type: String, trim: true },
    taxId: { type: String, select: false },
    incorporationDate: { type: Date },
    jurisdiction: { type: String },
    businessType: { type: String },
    website: { type: String },
    representatives: [representativeSchema],
    contacts: [contactSchema],
    addresses: [addressSchema],
    productInterests: [productInterestSchema],
    authorizedSigners: [authorizedSignerSchema],
    sensitiveFieldsMasked: {
      type: sensitiveFieldsMaskedSchema,
      default: () => ({}),
    },
    approvedAt: { type: Date },
  },
  { timestamps: true },
);

cisProfileSchema.index({ organizationId: 1, version: 1 }, { unique: true });
cisProfileSchema.index({ organizationId: 1, status: 1 });

export const CisProfile =
  models.CisProfile ?? model<ICisProfile>("CisProfile", cisProfileSchema);
