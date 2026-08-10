import { Schema, model, models } from "mongoose";
import type { LeanDoc } from "./shared";

export type TestimonialStatus = "published" | "unpublished";

export interface ITestimonial {
  quote: string;
  attribution: string;
  company?: string;
  status: TestimonialStatus;
  isPlaceholder: boolean;
}

export type TestimonialLean = LeanDoc<ITestimonial>;

const testimonialSchema = new Schema<ITestimonial>(
  {
    quote: { type: String, required: true },
    attribution: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    status: {
      type: String,
      enum: ["published", "unpublished"],
      default: "unpublished",
    },
    isPlaceholder: { type: Boolean, default: false },
  },
  { timestamps: true },
);

testimonialSchema.index({ status: 1, isPlaceholder: 1 });

export const Testimonial =
  models.Testimonial ?? model<ITestimonial>("Testimonial", testimonialSchema);
