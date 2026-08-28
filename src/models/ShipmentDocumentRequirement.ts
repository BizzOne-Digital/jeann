import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export interface IShipmentDocumentRequirement {
  checklistId: Types.ObjectId;
  documentType: string;
  required: boolean;
  responsibleParty: string;
  expectedIssuer?: string;
  requiredFormat?: string;
  originalCount?: number;
  copyCount?: number;
  signatureRequired?: boolean;
  certificationRequired?: boolean;
  dueDate?: Date;
  bankingRequirement?: boolean;
  destinationRequirement?: boolean;
  uploadStatus: string;
  validationStatus: string;
  approvalStatus: string;
  presentationStatus: string;
  notes?: string;
  linkedDocumentId?: Types.ObjectId;
}

export type ShipmentDocumentRequirementLean = LeanDoc<IShipmentDocumentRequirement>;

const shipmentDocumentRequirementSchema = new Schema<IShipmentDocumentRequirement>(
  {
    checklistId: { type: Schema.Types.ObjectId, ref: "ShipmentDocumentChecklist", required: true },
    documentType: { type: String, required: true },
    required: { type: Boolean, default: true },
    responsibleParty: { type: String, required: true },
    expectedIssuer: { type: String },
    requiredFormat: { type: String },
    originalCount: { type: Number },
    copyCount: { type: Number },
    signatureRequired: { type: Boolean },
    certificationRequired: { type: Boolean },
    dueDate: { type: Date },
    bankingRequirement: { type: Boolean, default: false },
    destinationRequirement: { type: Boolean, default: false },
    uploadStatus: { type: String, default: "not_started" },
    validationStatus: { type: String, default: "pending" },
    approvalStatus: { type: String, default: "pending" },
    presentationStatus: { type: String, default: "not_started" },
    notes: { type: String },
    linkedDocumentId: { type: Schema.Types.ObjectId, ref: "Document" },
  },
  { timestamps: true },
);

shipmentDocumentRequirementSchema.index({ checklistId: 1 });

export const ShipmentDocumentRequirement =
  models.ShipmentDocumentRequirement ??
  model<IShipmentDocumentRequirement>("ShipmentDocumentRequirement", shipmentDocumentRequirementSchema);
