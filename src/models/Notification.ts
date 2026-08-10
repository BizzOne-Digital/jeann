import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export interface INotification {
  userId: Types.ObjectId;
  type: string;
  title: string;
  body: string;
  href?: string;
  readAt?: Date;
  organizationId?: Types.ObjectId;
}

export type NotificationLean = LeanDoc<INotification>;

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    href: { type: String },
    readAt: { type: Date },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
  },
  { timestamps: true },
);

notificationSchema.index({ userId: 1, readAt: 1, createdAt: -1 });
notificationSchema.index({ organizationId: 1, userId: 1, createdAt: -1 });

export const Notification =
  models.Notification ?? model<INotification>("Notification", notificationSchema);
