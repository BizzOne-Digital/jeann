import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type CareerApplicationStatus = "new" | "reviewing" | "archived";

export interface CareerEducationFields {
  highestLevel: string;
  fieldOfStudy: string;
  institution: string;
  countryGraduation: string;
  certifications?: string;
}

export interface CareerExperienceEntry {
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate: string;
  details: string;
}

export interface CareerQuestionnaire {
  education: CareerEducationFields;
  experience: {
    recent: CareerExperienceEntry;
    previous?: CareerExperienceEntry;
  };
  hr: {
    employmentStatus: string;
    currentLocation: string;
    workAuthorization: string;
    startDate: string;
    salaryExpectation: string;
    commodityFamiliarity: string[];
    tradeDocuments: string[];
    tradeFinance: string;
    logisticsScenario: string;
    qualityControl: string;
  };
  accuracyCertified: boolean;
}

export interface ICareerApplication {
  reference: string;
  applicantUserId?: Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  linkedIn?: string;
  location?: string;
  coverLetter?: string;
  questionnaire: CareerQuestionnaire;
  resumeUrl: string;
  resumeFilename: string;
  resumeMimeType: string;
  resumeSize: number;
  status: CareerApplicationStatus;
  ipHash?: string;
}

export type CareerApplicationLean = LeanDoc<ICareerApplication>;

const experienceEntrySchema = new Schema<CareerExperienceEntry>(
  {
    jobTitle: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    startDate: { type: String, required: true, trim: true },
    endDate: { type: String, required: true, trim: true },
    details: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const careerApplicationSchema = new Schema<ICareerApplication>(
  {
    reference: { type: String, required: true, unique: true, trim: true },
    applicantUserId: { type: Schema.Types.ObjectId, ref: "User" },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true, default: "Career portal application" },
    linkedIn: { type: String, trim: true },
    location: { type: String, trim: true },
    coverLetter: { type: String, trim: true },
    questionnaire: {
      type: new Schema<CareerQuestionnaire>(
        {
          education: {
            highestLevel: { type: String, required: true },
            fieldOfStudy: { type: String, required: true },
            institution: { type: String, required: true },
            countryGraduation: { type: String, required: true },
            certifications: { type: String },
          },
          experience: {
            recent: { type: experienceEntrySchema, required: true },
            previous: { type: experienceEntrySchema },
          },
          hr: {
            employmentStatus: { type: String, required: true },
            currentLocation: { type: String, required: true },
            workAuthorization: { type: String, required: true },
            startDate: { type: String, required: true },
            salaryExpectation: { type: String, required: true },
            commodityFamiliarity: [{ type: String }],
            tradeDocuments: [{ type: String }],
            tradeFinance: { type: String, required: true },
            logisticsScenario: { type: String, required: true },
            qualityControl: { type: String, required: true },
          },
          accuracyCertified: { type: Boolean, required: true },
        },
        { _id: false },
      ),
      required: true,
    },
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
