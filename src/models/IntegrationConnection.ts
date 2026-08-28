import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type IntegrationConnectionStatus =
  | "not_configured"
  | "configuring"
  | "connected"
  | "degraded"
  | "error"
  | "disabled"
  | "revoked";

export interface IIntegrationConnection {
  providerId: Types.ObjectId;
  connectionName: string;
  organizationId?: Types.ObjectId;
  environment: string;
  secretRef?: string;
  configuration?: Record<string, unknown>;
  status: IntegrationConnectionStatus;
  connectedByUserId?: Types.ObjectId;
  connectedAt?: Date;
  lastSuccessAt?: Date;
  lastErrorSummary?: string;
  disabledAt?: Date;
  disabledByUserId?: Types.ObjectId;
}

export type IntegrationConnectionLean = LeanDoc<IIntegrationConnection>;

const integrationConnectionSchema = new Schema<IIntegrationConnection>(
  {
    providerId: { type: Schema.Types.ObjectId, ref: "IntegrationProvider", required: true },
    connectionName: { type: String, required: true, trim: true },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    environment: { type: String, default: "development" },
    secretRef: { type: String, select: false },
    configuration: { type: Schema.Types.Mixed },
    status: {
      type: String,
      enum: ["not_configured", "configuring", "connected", "degraded", "error", "disabled", "revoked"],
      default: "not_configured",
    },
    connectedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    connectedAt: { type: Date },
    lastSuccessAt: { type: Date },
    lastErrorSummary: { type: String },
    disabledAt: { type: Date },
    disabledByUserId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

integrationConnectionSchema.index({ providerId: 1, connectionName: 1 }, { unique: true });

export const IntegrationConnection =
  models.IntegrationConnection ??
  model<IIntegrationConnection>("IntegrationConnection", integrationConnectionSchema);
