import { Schema, model, models } from "mongoose";
import type { LeanDoc } from "./shared";

export type IntegrationStatus = "inactive" | "active" | "error" | "pending";

export interface IIntegrationConfiguration {
  key: string;
  provider: string;
  configured: boolean;
  statusMessage?: string;
  secretRef?: string;
  metadata?: Record<string, unknown>;
  status: IntegrationStatus;
}

export type IntegrationConfigurationLean = LeanDoc<IIntegrationConfiguration>;

const integrationConfigurationSchema = new Schema<IIntegrationConfiguration>(
  {
    key: { type: String, required: true, trim: true },
    provider: { type: String, required: true, trim: true },
    configured: { type: Boolean, default: false },
    statusMessage: { type: String },
    secretRef: { type: String, select: false },
    metadata: { type: Schema.Types.Mixed },
    status: {
      type: String,
      enum: ["inactive", "active", "error", "pending"],
      default: "inactive",
    },
  },
  { timestamps: true },
);

integrationConfigurationSchema.index({ key: 1 }, { unique: true });
integrationConfigurationSchema.index({ provider: 1, status: 1 });

export const IntegrationConfiguration =
  models.IntegrationConfiguration ??
  model<IIntegrationConfiguration>("IntegrationConfiguration", integrationConfigurationSchema);
