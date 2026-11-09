import { Schema, model, models, Types } from "mongoose";

export const AGENT_DEAL_STATUSES = ["submitted", "under_review", "accepted", "declined", "more_information_required"] as const;
export type AgentDealStatus = (typeof AGENT_DEAL_STATUSES)[number];

/**
 * A deal an agent / broker brings to Finekarts by uploading the buyer's LOI or ICPO.
 * The agent is only the middleman: everything in here is the end buyer's information and the end buyer signs.
 */
export interface IAgentDeal {
  reference: string;
  agentOrganizationId: Types.ObjectId;
  submittedByUserId: Types.ObjectId;
  /** "agent" acts for one principal; "broker" is neutral and introduces both sides. */
  channel: "agent" | "broker";
  buyerCompanyName: string;
  buyerContactName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  buyerCountry?: string;
  /** Brokers introduce both sides, so they also name the supplier. */
  supplierCompanyName?: string;
  supplierContactName?: string;
  productName: string;
  quantity?: string;
  notes?: string;
  documentType: "loi" | "icpo";
  filename: string;
  mimeType: string;
  size: number;
  fileData?: Buffer;
  status: AgentDealStatus;
  staffNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const agentDealSchema = new Schema<IAgentDeal>(
  {
    reference: { type: String, required: true, unique: true },
    agentOrganizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    submittedByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    channel: { type: String, enum: ["agent", "broker"], default: "agent" },
    buyerCompanyName: { type: String, required: true, trim: true, maxlength: 200 },
    buyerContactName: { type: String, trim: true, maxlength: 120 },
    buyerEmail: { type: String, trim: true, lowercase: true, maxlength: 254 },
    buyerPhone: { type: String, trim: true, maxlength: 40 },
    buyerCountry: { type: String, trim: true, maxlength: 120 },
    supplierCompanyName: { type: String, trim: true, maxlength: 200 },
    supplierContactName: { type: String, trim: true, maxlength: 120 },
    productName: { type: String, required: true, trim: true, maxlength: 200 },
    quantity: { type: String, trim: true, maxlength: 80 },
    notes: { type: String, trim: true, maxlength: 4000 },
    documentType: { type: String, enum: ["loi", "icpo"], required: true },
    filename: { type: String, required: true, maxlength: 255 },
    mimeType: { type: String, required: true, maxlength: 120 },
    size: { type: Number, required: true },
    fileData: { type: Buffer, select: false },
    status: { type: String, enum: AGENT_DEAL_STATUSES, default: "submitted" },
    staffNotes: { type: String, trim: true, maxlength: 4000 },
  },
  { timestamps: true },
);

agentDealSchema.index({ agentOrganizationId: 1, createdAt: -1 });
agentDealSchema.index({ status: 1, createdAt: -1 });
agentDealSchema.index({ channel: 1, createdAt: -1 });

export const AgentDeal = models.AgentDeal ?? model<IAgentDeal>("AgentDeal", agentDealSchema);
