import { Schema, model, models } from "mongoose";
import type { LeanDoc } from "./shared";

export type TeamMemberStatus = "published" | "unpublished";

export type TeamMemberTier = "board" | "staff";

export interface ITeamMember {
  name: string;
  roleTitle: string;
  department?: string;
  tier: TeamMemberTier;
  bio?: string;
  photo?: string;
  displayOrder: number;
  status: TeamMemberStatus;
}

export type TeamMemberLean = LeanDoc<ITeamMember>;

const teamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true, trim: true },
    roleTitle: { type: String, required: true, trim: true },
    department: { type: String, trim: true },
    tier: {
      type: String,
      enum: ["board", "staff"],
      default: "staff",
    },
    bio: { type: String },
    photo: { type: String },
    displayOrder: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["published", "unpublished"],
      default: "unpublished",
    },
  },
  { timestamps: true },
);

teamMemberSchema.index({ status: 1, displayOrder: 1 });

export const TeamMember =
  models.TeamMember ?? model<ITeamMember>("TeamMember", teamMemberSchema);
