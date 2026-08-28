import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export type UATTestStatus = "pending" | "passed" | "failed" | "blocked" | "skipped";

export interface IUATTestCase {
  testId: string;
  module: string;
  role: string;
  preconditions?: string;
  steps: string;
  expectedResult: string;
  actualResult?: string;
  status: UATTestStatus;
  testerUserId?: Types.ObjectId;
  evidenceRef?: string;
  defectReference?: string;
  testDate?: Date;
}

export type UATTestCaseLean = LeanDoc<IUATTestCase>;

const uatTestCaseSchema = new Schema<IUATTestCase>(
  {
    testId: { type: String, required: true, unique: true },
    module: { type: String, required: true },
    role: { type: String, required: true },
    preconditions: { type: String },
    steps: { type: String, required: true },
    expectedResult: { type: String, required: true },
    actualResult: { type: String },
    status: {
      type: String,
      enum: ["pending", "passed", "failed", "blocked", "skipped"],
      default: "pending",
    },
    testerUserId: { type: Schema.Types.ObjectId, ref: "User" },
    evidenceRef: { type: String },
    defectReference: { type: String },
    testDate: { type: Date },
  },
  { timestamps: true },
);

uatTestCaseSchema.index({ module: 1, role: 1 });

export const UATTestCase =
  models.UATTestCase ?? model<IUATTestCase>("UATTestCase", uatTestCaseSchema);
