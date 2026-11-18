import { Schema, model, models, Types } from "mongoose";

/** The signature image preloaded by admin. It is printed on final (approved) documents only. */
export interface ICompanySignature {
  key: string;
  mimeType: string;
  /** PNG with a transparent background, as base64. */
  dataBase64: string;
  updatedByUserId?: Types.ObjectId;
}

const companySignatureSchema = new Schema<ICompanySignature>(
  {
    key: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true },
    dataBase64: { type: String, required: true },
    updatedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

companySignatureSchema.index({ key: 1 }, { unique: true });

export const CompanySignature =
  models.CompanySignature ?? model<ICompanySignature>("CompanySignature", companySignatureSchema);
