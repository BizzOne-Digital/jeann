import { Schema, model, models } from "mongoose";
import type { LeanDoc } from "./shared";
import type { TransactionSide } from "./Transaction";

export interface WorkflowTemplateStep {
  key: string;
  order: number;
  title: string;
  description?: string;
  required: boolean;
  ownerRole?: string;
}

export interface IWorkflowTemplate {
  key: string;
  side: TransactionSide;
  name: string;
  steps: WorkflowTemplateStep[];
  version: number;
  active: boolean;
}

export type WorkflowTemplateLean = LeanDoc<IWorkflowTemplate>;

const workflowTemplateStepSchema = new Schema<WorkflowTemplateStep>(
  {
    key: { type: String, required: true },
    order: { type: Number, required: true, min: 0 },
    title: { type: String, required: true },
    description: { type: String },
    required: { type: Boolean, default: true },
    ownerRole: { type: String },
  },
  { _id: false },
);

const workflowTemplateSchema = new Schema<IWorkflowTemplate>(
  {
    key: { type: String, required: true, trim: true },
    side: { type: String, enum: ["buyer", "supplier"], required: true },
    name: { type: String, required: true, trim: true },
    steps: [workflowTemplateStepSchema],
    version: { type: Number, required: true, min: 1 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

workflowTemplateSchema.index({ key: 1, version: 1 }, { unique: true });
workflowTemplateSchema.index({ key: 1, side: 1, active: 1 });

export const WorkflowTemplate =
  models.WorkflowTemplate ?? model<IWorkflowTemplate>("WorkflowTemplate", workflowTemplateSchema);
