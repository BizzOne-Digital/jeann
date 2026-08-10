import { Schema, Types } from "mongoose";
import type { Permission, RoleKey } from "@/lib/authorization/permissions";

export const ROLE_KEYS: RoleKey[] = [
  "ceo_super_admin",
  "general_manager",
  "trade_manager",
  "employee_operations",
  "finance",
  "compliance_reviewer",
  "buyer_org_admin",
  "buyer_member",
  "supplier_org_admin",
  "supplier_member",
  "banking_advisor",
  "readonly_auditor",
];

export interface SeoFields {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
}

export interface AttachmentFields {
  storageKey: string;
  filename: string;
  mimeType: string;
  size: number;
}

export interface ClaimFields {
  enabled: boolean;
  note?: string;
}

export interface ContactFields {
  name?: string;
  email?: string;
  phone?: string;
  title?: string;
}

export interface AddressFields {
  label?: string;
  line1: string;
  line2?: string;
  city: string;
  region?: string;
  postalCode?: string;
  country: string;
}

export const seoSchema = new Schema<SeoFields>(
  {
    title: { type: String },
    description: { type: String },
    keywords: [{ type: String }],
    ogImage: { type: String },
  },
  { _id: false },
);

export const attachmentSchema = new Schema<AttachmentFields>(
  {
    storageKey: { type: String, required: true },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

export const claimSchema = new Schema<ClaimFields>(
  {
    enabled: { type: Boolean, default: false },
    note: { type: String },
  },
  { _id: false },
);

export const contactSchema = new Schema<ContactFields>(
  {
    name: { type: String },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    title: { type: String },
  },
  { _id: false },
);

export const addressSchema = new Schema<AddressFields>(
  {
    label: { type: String },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    region: { type: String },
    postalCode: { type: String },
    country: { type: String, required: true, uppercase: true, trim: true },
  },
  { _id: false },
);

export function objectIdRef(modelName: string, required = true) {
  return {
    type: Schema.Types.ObjectId,
    ref: modelName,
    required,
  };
}

export type WithObjectId<T> = T & { _id: Types.ObjectId };
export type WithTimestamps<T> = T & { createdAt: Date; updatedAt: Date };
export type LeanDoc<T> = WithObjectId<WithTimestamps<T>>;

export type { Permission, RoleKey };
