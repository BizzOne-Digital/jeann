export const MOCK_DISCLAIMER =
  "DEVELOPMENT TEST RESPONSE — NOT FROM A REAL PROVIDER";

export type ProviderHealthResult = {
  ok: boolean;
  status: "not_configured" | "connected" | "degraded" | "error";
  message: string;
  checkedAt: string;
};

export type NormalizedProviderError = {
  code: string;
  message: string;
  retryable: boolean;
};

export type IntegrationJobInput = {
  providerAdapter: string;
  jobType: string;
  internalEntityType: string;
  internalEntityId: string;
  idempotencyKey: string;
  correlationId?: string;
  maxAttempts?: number;
};

export type UsageRecordInput = {
  providerAdapter: string;
  capability: string;
  userId?: string;
  organizationId?: string;
  transactionId?: string;
  documentId?: string;
  modelOrEndpoint?: string;
  inputSize?: number;
  outputSize?: number;
  tokenUsage?: number;
  estimatedCostUsd?: string;
  status: string;
  correlationId: string;
};
