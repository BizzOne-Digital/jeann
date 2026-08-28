import { Schema, model, models } from "mongoose";
import type { LeanDoc } from "./shared";

export interface IIntegrationFeatureFlag {
  key: string;
  label: string;
  enabled: boolean;
  environments: string[];
  allowedRoles?: string[];
  organizationScoped: boolean;
  description?: string;
  updatedByUserId?: string;
}

export type IntegrationFeatureFlagLean = LeanDoc<IIntegrationFeatureFlag>;

const integrationFeatureFlagSchema = new Schema<IIntegrationFeatureFlag>(
  {
    key: { type: String, required: true, trim: true, unique: true },
    label: { type: String, required: true },
    enabled: { type: Boolean, default: false },
    environments: [{ type: String }],
    allowedRoles: [{ type: String }],
    organizationScoped: { type: Boolean, default: false },
    description: { type: String },
    updatedByUserId: { type: String },
  },
  { timestamps: true },
);

export const IntegrationFeatureFlag =
  models.IntegrationFeatureFlag ??
  model<IIntegrationFeatureFlag>("IntegrationFeatureFlag", integrationFeatureFlagSchema);

export const DEFAULT_INTEGRATION_FEATURE_FLAGS = [
  { key: "public_ai_chatbot", label: "Public AI chatbot", enabled: true, environments: ["development", "test", "production"] },
  { key: "internal_ai_assistant", label: "Internal AI assistant", enabled: true, environments: ["development", "test", "production"] },
  { key: "ai_document_extraction", label: "AI document extraction", enabled: false, environments: ["development", "test"] },
  { key: "ai_document_comparison", label: "AI document comparison", enabled: false, environments: ["development", "test"] },
  { key: "ai_document_drafting", label: "AI document drafting", enabled: false, environments: ["development", "test"] },
  { key: "vesper_market_data", label: "Vesper market data", enabled: false, environments: ["development", "test"] },
  { key: "vesper_alerts", label: "Vesper market alerts", enabled: false, environments: ["development", "test"] },
  { key: "esignature", label: "E-signature", enabled: false, environments: ["development", "test"] },
  { key: "company_screening", label: "Company screening", enabled: false, environments: ["development", "test"] },
  { key: "sanctions_screening", label: "Sanctions screening", enabled: false, environments: ["development", "test"] },
  { key: "shipping_provider_sync", label: "Shipping provider sync", enabled: false, environments: ["development", "test"] },
  { key: "accounting_sync", label: "Accounting sync", enabled: false, environments: ["development", "test", "production"] },
  { key: "production_sms", label: "Production SMS", enabled: false, environments: ["production"] },
  { key: "seo_assistant", label: "SEO assistant", enabled: false, environments: ["development", "test"] },
  { key: "social_drafts", label: "Social content drafts", enabled: false, environments: ["development", "test"] },
];
