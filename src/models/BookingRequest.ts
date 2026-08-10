import { Schema, model, models, Types } from "mongoose";
import { contactSchema, type ContactFields, type LeanDoc } from "./shared";

export type BookingRequestStatus =
  | "requested"
  | "confirmed"
  | "declined"
  | "cancelled";

export interface PreferredSlot {
  startAt: Date;
  endAt: Date;
}

export interface IBookingRequest {
  contact: ContactFields;
  organizationId?: Types.ObjectId;
  topic: string;
  commodityInterest?: string;
  volume?: string;
  destination?: string;
  timezone: string;
  preferredSlots: PreferredSlot[];
  notes?: string;
  status: BookingRequestStatus;
  confirmedAt?: Date;
  confirmedBy?: Types.ObjectId;
}

export type BookingRequestLean = LeanDoc<IBookingRequest>;

const preferredSlotSchema = new Schema<PreferredSlot>(
  {
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
  },
  { _id: false },
);

const bookingRequestSchema = new Schema<IBookingRequest>(
  {
    contact: { type: contactSchema, required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
    topic: { type: String, required: true, trim: true },
    commodityInterest: { type: String },
    volume: { type: String },
    destination: { type: String },
    timezone: { type: String, required: true, default: "UTC" },
    preferredSlots: [preferredSlotSchema],
    notes: { type: String },
    status: {
      type: String,
      enum: ["requested", "confirmed", "declined", "cancelled"],
      default: "requested",
    },
    confirmedAt: { type: Date },
    confirmedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

bookingRequestSchema.index({ status: 1, createdAt: -1 });
bookingRequestSchema.index({ organizationId: 1, status: 1 });

export const BookingRequest =
  models.BookingRequest ?? model<IBookingRequest>("BookingRequest", bookingRequestSchema);
