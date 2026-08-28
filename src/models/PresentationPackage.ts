import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type PresentationPackageStatus =
  | "draft"
  | "validation_pending"
  | "blocked"
  | "approved"
  | "ready_for_presentation"
  | "presented"
  | "superseded";

export interface IPresentationPackage {
  shipmentLotId: Types.ObjectId;
  bankingInstrumentId: Types.ObjectId;
  checklistId: Types.ObjectId;
  packageReference: string;
  documentManifest: string[];
  checksum?: string;
  status: PresentationPackageStatus;
  validationSummary?: string;
  approvedByUserId?: Types.ObjectId;
  approvedAt?: Date;
  bankPresentationId?: Types.ObjectId;
  createdByUserId: Types.ObjectId;
}

export type PresentationPackageLean = LeanDoc<IPresentationPackage>;

const presentationPackageSchema = new Schema<IPresentationPackage>(
  {
    shipmentLotId: { type: Schema.Types.ObjectId, ref: "ShipmentLot", required: true },
    bankingInstrumentId: { type: Schema.Types.ObjectId, ref: "BankingInstrument", required: true },
    checklistId: { type: Schema.Types.ObjectId, ref: "ShipmentDocumentChecklist", required: true },
    packageReference: { type: String, required: true, trim: true },
    documentManifest: [{ type: String }],
    checksum: { type: String },
    status: {
      type: String,
      enum: [
        "draft",
        "validation_pending",
        "blocked",
        "approved",
        "ready_for_presentation",
        "presented",
        "superseded",
      ],
      default: "draft",
    },
    validationSummary: { type: String },
    approvedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    bankPresentationId: { type: Schema.Types.ObjectId, ref: "BankPresentation" },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

presentationPackageSchema.index({ packageReference: 1 }, { unique: true });
presentationPackageSchema.index({ shipmentLotId: 1 });

export const PresentationPackage =
  models.PresentationPackage ??
  model<IPresentationPackage>("PresentationPackage", presentationPackageSchema);
