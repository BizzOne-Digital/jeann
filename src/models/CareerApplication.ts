import { Schema, model, models } from "mongoose";
import type { LeanDoc } from "./shared";

export type CareerApplicationStatus = "new" | "reviewing" | "archived";

export interface ICareerApplication {
  reference: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  linkedIn?: string;
  location?: string;
  coverLetter?: string;
  resumeUrl: string;
  resumeFilename: string;
  resumeMimeType: string;
  resumeSize: number;
  status: CareerApplicationStatus;
  ipHash?: string;
}

export type CareerApplicationLean = LeanDoc<ICareerApplication>;

const careerApplicationSchema = new Schema<ICareerApplication>(
  {
    reference: { type: String, required: true, unique: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    linkedIn: { type: String, trim: true },
    location: { type: String, trim: true },
    coverLetter: { type: String, trim: true },
    resumeUrl: { type: String, required: true, trim: true },
    resumeFilename: { type: String, required: true, trim: true },
    resumeMimeType: { type: String, required: true },
    resumeSize: { type: Number, required: true },
    status: {
      type: String,
      enum: ["new", "reviewing", "archived"],
      default: "new",
    },
    ipHash: { type: String },
  },
  { timestamps: true },
);

careerApplicationSchema.index({ email: 1, createdAt: -1 });

export const CareerApplication =
  models.CareerApplication ??
  model<ICareerApplication>("CareerApplication", careerApplicationSchema);
