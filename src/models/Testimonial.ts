import { Schema, model, models } from "mongoose";
import type { LeanDoc } from "./shared";

export type TestimonialStatus = "published" | "unpublished";

export interface ITestimonial {
  quote: string;
  name: string;
  position: string;
  company?: string;
  photo?: string;
  rating: number;
  reviewedAt?: Date;
  /** @deprecated Legacy field — use `position` instead. */
  attribution?: string;
  status: TestimonialStatus;
  isPlaceholder: boolean;
}

export type TestimonialLean = LeanDoc<ITestimonial>;

const testimonialSchema = new Schema<ITestimonial>(
  {
    quote: { type: String, required: true },
    name: { type: String, trim: true, default: "" },
    position: { type: String, trim: true, default: "" },
    company: { type: String, trim: true },
    photo: { type: String, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    reviewedAt: { type: Date },
    attribution: { type: String, trim: true },
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
