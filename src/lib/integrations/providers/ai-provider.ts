import type { ProviderHealthResult } from "@/lib/integrations/types";
import { getEnv } from "@/lib/config/env";
import { MOCK_DISCLAIMER } from "@/lib/integrations/types";

export type AICapability =
  | "extract_document_fields"
  | "compare_documents"
  | "draft_narrative"
  | "summarize_content"
  | "answer_knowledge"
  | "classify_lead";

export type AIStructuredField = {
  fieldKey: string;
  extractedValue: string;
  confidence: number;
  sourceHint?: string;
};

export type AIComparisonFinding = {
  severity: "deterministic_error" | "ai_suggested_risk" | "ai_review_point";
  field?: string;
  description: string;
  confidence?: number;
};

export type AIProviderResult<T> = {
  ok: boolean;
  status: "not_configured" | "success" | "failed";
  data?: T;
  rawText?: string;
  model: string;
  tokenUsage?: number;
  errorSummary?: string;
  disclaimer: string;
};

export interface AIProvider {
  readonly name: string;
  readonly adapterCode: string;
  healthCheck(): Promise<ProviderHealthResult>;
  extractDocumentFields(input: {
    documentType: string;
    text: string;
    model?: string;
  }): Promise<AIProviderResult<{ fields: AIStructuredField[] }>>;
  compareDocuments(input: {
    leftLabel: string;
    leftText: string;
    rightLabel: string;
    rightText: string;
    model?: string;
  }): Promise<AIProviderResult<{ findings: AIComparisonFinding[] }>>;
  draftNarrative(input: {
    templateName: string;
    structuredContext: Record<string, string>;
    model?: string;
  }): Promise<AIProviderResult<{ narrative: string; unresolvedFields: string[] }>>;
  summarizeContent(input: { text: string; model?: string }): Promise<AIProviderResult<{ summary: string }>>;
  answerKnowledgeQuestion(input: {
    question: string;
    knowledgeContext: string;
    model?: string;
  }): Promise<AIProviderResult<{ answer: string; sources: string[] }>>;
}

export class MockAIProvider implements AIProvider {
  readonly name = "mock_ai";
  readonly adapterCode = "development_mock_ai";

  async healthCheck(): Promise<ProviderHealthResult> {
    return {
      ok: true,
      status: "connected",
      message: `${MOCK_DISCLAIMER} — Mock AI provider.`,
      checkedAt: new Date().toISOString(),
    };
  }

  async extractDocumentFields(input: {
    documentType: string;
    text: string;
  }): Promise<AIProviderResult<{ fields: AIStructuredField[] }>> {
    return {
      ok: true,
      status: "success",
      model: "mock-model",
      disclaimer: MOCK_DISCLAIMER,
      data: {
        fields: [
          {
            fieldKey: "product_name",
            extractedValue: "Refined Sunflower Oil",
            confidence: 0.85,
            sourceHint: input.documentType,
          },
          {
            fieldKey: "quantity",
            extractedValue: "1000",
            confidence: 0.9,
          },
        ],
      },
      rawText: MOCK_DISCLAIMER,
    };
  }

  async compareDocuments(input: {
    leftLabel: string;
    rightLabel: string;
  }): Promise<AIProviderResult<{ findings: AIComparisonFinding[] }>> {
    return {
      ok: true,
      status: "success",
      model: "mock-model",
      disclaimer: MOCK_DISCLAIMER,
      data: {
        findings: [
          {
            severity: "ai_review_point",
            field: "quantity",
            description: `Review quantity alignment between ${input.leftLabel} and ${input.rightLabel}.`,
            confidence: 0.7,
          },
        ],
      },
    };
  }

  async draftNarrative(input: {
    templateName: string;
    structuredContext: Record<string, string>;
  }): Promise<AIProviderResult<{ narrative: string; unresolvedFields: string[] }>> {
    const unresolved = Object.entries(input.structuredContext)
      .filter(([, v]) => !v)
      .map(([k]) => k);
    return {
      ok: true,
      status: "success",
      model: "mock-model",
      disclaimer: MOCK_DISCLAIMER,
      data: {
        narrative: `${MOCK_DISCLAIMER} Draft for ${input.templateName}.`,
        unresolvedFields: unresolved,
      },
    };
  }

  async summarizeContent(input: { text: string }): Promise<AIProviderResult<{ summary: string }>> {
    return {
      ok: true,
      status: "success",
      model: "mock-model",
      disclaimer: MOCK_DISCLAIMER,
      data: { summary: `${MOCK_DISCLAIMER} Summary of ${input.text.slice(0, 80)}…` },
    };
  }

  async answerKnowledgeQuestion(input: {
    question: string;
    knowledgeContext: string;
  }): Promise<AIProviderResult<{ answer: string; sources: string[] }>> {
    return {
      ok: true,
      status: "success",
      model: "mock-model",
      disclaimer: MOCK_DISCLAIMER,
      data: {
        answer: `${MOCK_DISCLAIMER} Based on approved knowledge only.`,
        sources: ["approved_knowledge"],
      },
      rawText: input.knowledgeContext.slice(0, 200),
    };
  }
}

export class UnconfiguredAIProvider implements AIProvider {
  readonly name = "unconfigured_ai";
  readonly adapterCode = "unconfigured";

  async healthCheck(): Promise<ProviderHealthResult> {
    return {
      ok: false,
      status: "not_configured",
      message: "AI provider is not configured for this environment.",
      checkedAt: new Date().toISOString(),
    };
  }

  private notConfigured<T>(): AIProviderResult<T> {
    return {
      ok: false,
      status: "not_configured",
      model: "none",
      disclaimer: "AI provider not configured.",
      errorSummary: "not_configured",
    };
  }

  async extractDocumentFields() {
    return this.notConfigured<{ fields: AIStructuredField[] }>();
  }
  async compareDocuments() {
    return this.notConfigured<{ findings: AIComparisonFinding[] }>();
  }
  async draftNarrative() {
    return this.notConfigured<{ narrative: string; unresolvedFields: string[] }>();
  }
  async summarizeContent() {
    return this.notConfigured<{ summary: string }>();
  }
  async answerKnowledgeQuestion() {
    return this.notConfigured<{ answer: string; sources: string[] }>();
  }
}
