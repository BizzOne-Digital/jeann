import { Schema, model, models } from "mongoose";
import type { LeanDoc } from "./shared";

export type ContactSubmissionStatus = "new" | "in_progress" | "resolved" | "spam";

export interface IContactSubmission {
  name: string;
  email: string;
  phone?: string;
  department?: string;
  message: string;
  consent: boolean;
  status: ContactSubmissionStatus;
  ipHash?: string;
}

export type ContactSubmissionLean = LeanDoc<IContactSubmission>;

const contactSubmissionSchema = new Schema<IContactSubmission>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    department: { type: String, trim: true },
    message: { type: String, required: true },
    consent: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ["new", "in_progress", "resolved", "spam"],
      default: "new",
    },
    ipHash: { type: String },
  },
  { timestamps: true },
);

contactSubmissionSchema.index({ status: 1, createdAt: -1 });
contactSubmissionSchema.index({ email: 1, createdAt: -1 });

export const ContactSubmission =
  models.ContactSubmission ?? model<IContactSubmission>("ContactSubmission", contactSubmissionSchema);
