import { Schema, model, models } from "mongoose";
import type { LeanDoc } from "./shared";

export interface ITeamMemberFieldDefinition {
  key: string;
  label: string;
  displayOrder: number;
}

export type TeamMemberFieldDefinitionLean = LeanDoc<ITeamMemberFieldDefinition>;

const teamMemberFieldDefinitionSchema = new Schema<ITeamMemberFieldDefinition>(
  {
    key: { type: String, required: true, trim: true, lowercase: true, unique: true },
    label: { type: String, required: true, trim: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const TeamMemberFieldDefinition =
  models.TeamMemberFieldDefinition ??
  model<ITeamMemberFieldDefinition>("TeamMemberFieldDefinition", teamMemberFieldDefinitionSchema);
