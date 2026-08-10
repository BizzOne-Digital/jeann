import { Schema, model, models } from "mongoose";
import { seoSchema, type LeanDoc, type SeoFields } from "./shared";

export const SITE_SETTINGS_KEY = "default";

export interface SocialLink {
  platform: string;
  url: string;
}

export interface SiteAddress {
  line1: string;
  line2?: string;
  city: string;
  region?: string;
  postalCode?: string;
  country: string;
}

export interface ISiteSettings {
  key: string;
  companyName: string;
  email: string;
  phone?: string;
  addressVisible: boolean;
  address?: SiteAddress;
  socialLinks: SocialLink[];
  seoDefaults?: SeoFields;
  featureFlags: Record<string, boolean>;
  aiAssistantEnabled: boolean;
  locales: string[];
}

export type SiteSettingsLean = LeanDoc<ISiteSettings>;

const socialLinkSchema = new Schema<SocialLink>(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false },
);

const siteAddressSchema = new Schema<SiteAddress>(
  {
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    region: { type: String },
    postalCode: { type: String },
    country: { type: String, required: true, uppercase: true },
  },
  { _id: false },
);

const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: { type: String, required: true, default: SITE_SETTINGS_KEY },
    companyName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    addressVisible: { type: Boolean, default: false },
    address: siteAddressSchema,
    socialLinks: [socialLinkSchema],
    seoDefaults: seoSchema,
    featureFlags: { type: Schema.Types.Mixed, default: () => ({}) },
    aiAssistantEnabled: { type: Boolean, default: false },
    locales: [{ type: String, default: ["en"] }],
  },
  { timestamps: true },
);

siteSettingsSchema.index({ key: 1 }, { unique: true });

export const SiteSettings =
  models.SiteSettings ?? model<ISiteSettings>("SiteSettings", siteSettingsSchema);
