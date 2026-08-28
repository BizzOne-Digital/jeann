import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export interface ICostCategory {
  code: string;
  name: string;
  description?: string;
  active: boolean;
  createdByUserId: Types.ObjectId;
}

export type CostCategoryLean = LeanDoc<ICostCategory>;

const costCategorySchema = new Schema<ICostCategory>(
  {
    code: { type: String, required: true, trim: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    active: { type: Boolean, default: true },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export const CostCategory =
  models.CostCategory ?? model<ICostCategory>("CostCategory", costCategorySchema);

export const DEFAULT_COST_CATEGORIES = [
  { code: "procurement", name: "Procurement Cost" },
  { code: "freight", name: "Freight" },
  { code: "insurance", name: "Insurance" },
  { code: "inspection", name: "Inspection" },
  { code: "port_charges", name: "Port Charges" },
  { code: "storage", name: "Storage" },
  { code: "bank_fees", name: "Bank Fees" },
  { code: "amendment_fees", name: "Amendment Fees" },
  { code: "agent_commission", name: "Agent Commission" },
  { code: "broker_commission", name: "Broker Commission" },
  { code: "customs_broker", name: "Customs/Broker Fees" },
  { code: "packaging", name: "Packaging" },
  { code: "claim_cost", name: "Claim Cost" },
  { code: "other_direct", name: "Other Direct Cost" },
];
