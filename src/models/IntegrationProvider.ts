import { Schema, model, models } from "mongoose";
import type { LeanDoc } from "./shared";

export type IntegrationProviderType =
  | "ai"
  | "market_data"
  | "esignature"
  | "screening"
  | "shipping_tracking"
  | "accounting"
  | "email"
  | "sms"
  | "storage"
  | "malware_scan"
  | "analytics"
  | "social";

export interface IIntegrationProvider {
  providerType: IntegrationProviderType;
  providerName: string;
  adapterCode: string;
  capabilities: string[];
  active: boolean;
  environment: string;
  configurationSchema?: Record<string, unknown>;
  lastHealthStatus?: string;
  lastHealthCheckAt?: Date;
}

export type IntegrationProviderLean = LeanDoc<IIntegrationProvider>;

const integrationProviderSchema = new Schema<IIntegrationProvider>(
  {
    providerType: {
      type: String,
      enum: [
        "ai",
        "market_data",
        "esignature",
        "screening",
        "shipping_tracking",
        "accounting",
        "email",
        "sms",
        "storage",
        "malware_scan",
        "analytics",
        "social",
      ],
      required: true,
    },
    providerName: { type: String, required: true, trim: true },
    adapterCode: { type: String, required: true, trim: true },
    capabilities: [{ type: String }],
    active: { type: Boolean, default: true },
    environment: { type: String, default: "development" },
    configurationSchema: { type: Schema.Types.Mixed },
    lastHealthStatus: { type: String },
    lastHealthCheckAt: { type: Date },
  },
  { timestamps: true },
);

integrationProviderSchema.index({ providerType: 1, adapterCode: 1 }, { unique: true });

export const IntegrationProvider =
  models.IntegrationProvider ??
  model<IIntegrationProvider>("IntegrationProvider", integrationProviderSchema);
