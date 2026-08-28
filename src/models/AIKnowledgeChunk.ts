import { Schema, model, models, Types } from "mongoose";
import type { LeanDoc } from "./shared";

export interface IAIKnowledgeChunk {
  knowledgeSourceId: Types.ObjectId;
  content: string;
  secureReference?: string;
  embeddingReference?: string;
  metadata?: Record<string, unknown>;
  visibility: string;
  version: number;
  active: boolean;
}

export type AIKnowledgeChunkLean = LeanDoc<IAIKnowledgeChunk>;

const aiKnowledgeChunkSchema = new Schema<IAIKnowledgeChunk>(
  {
    knowledgeSourceId: { type: Schema.Types.ObjectId, ref: "AIKnowledgeSource", required: true },
    content: { type: String, required: true },
    secureReference: { type: String },
    embeddingReference: { type: String },
    metadata: { type: Schema.Types.Mixed },
    visibility: { type: String, default: "internal" },
    version: { type: Number, default: 1 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

aiKnowledgeChunkSchema.index({ knowledgeSourceId: 1, version: 1 });

export const AIKnowledgeChunk =
  models.AIKnowledgeChunk ?? model<IAIKnowledgeChunk>("AIKnowledgeChunk", aiKnowledgeChunkSchema);
