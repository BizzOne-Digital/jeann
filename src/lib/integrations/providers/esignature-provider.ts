import { MOCK_DISCLAIMER, type ProviderHealthResult } from "@/lib/integrations/types";

export type ESignatureEnvelopeInput = {
  documentVersionId: string;
  recipients: Array<{ legalName: string; email: string; signingOrder: number; role: string }>;
};

export interface ESignatureProvider {
  readonly name: string;
  readonly adapterCode: string;
  healthCheck(): Promise<ProviderHealthResult>;
  createEnvelope(input: ESignatureEnvelopeInput): Promise<{
    ok: boolean;
    status: "not_configured" | "success" | "failed";
    providerEnvelopeId?: string;
    errorSummary?: string;
    disclaimer: string;
  }>;
  sendEnvelope(providerEnvelopeId: string): Promise<{ ok: boolean; disclaimer: string }>;
  getStatus(providerEnvelopeId: string): Promise<{
    status: string;
    disclaimer: string;
  }>;
  processWebhook(payload: unknown, signature?: string): Promise<{
    ok: boolean;
    eventType?: string;
    providerEnvelopeId?: string;
    disclaimer: string;
  }>;
}

export class MockESignatureProvider implements ESignatureProvider {
  readonly name = "mock_esignature";
  readonly adapterCode = "development_mock_esignature";

  async healthCheck(): Promise<ProviderHealthResult> {
    return {
      ok: true,
      status: "connected",
      message: `${MOCK_DISCLAIMER} — Mock e-signature.`,
      checkedAt: new Date().toISOString(),
    };
  }

  async createEnvelope(_input: ESignatureEnvelopeInput) {
    return {
      ok: true,
      status: "success" as const,
      providerEnvelopeId: `MOCK-ESIGN-${Date.now()}`,
      disclaimer: MOCK_DISCLAIMER,
    };
  }

  async sendEnvelope(_providerEnvelopeId: string) {
    return { ok: true, disclaimer: MOCK_DISCLAIMER };
  }

  async getStatus(providerEnvelopeId: string) {
    return { status: "sent", disclaimer: MOCK_DISCLAIMER };
  }

  async processWebhook(_payload: unknown, signature?: string) {
    if (!signature) {
      return { ok: false, disclaimer: "Webhook signature required." };
    }
    return {
      ok: true,
      eventType: "completed",
      providerEnvelopeId: "MOCK-ESIGN",
      disclaimer: MOCK_DISCLAIMER,
    };
  }
}

export class UnconfiguredESignatureProvider implements ESignatureProvider {
  readonly name = "unconfigured_esignature";
  readonly adapterCode = "unconfigured";

  async healthCheck(): Promise<ProviderHealthResult> {
    return {
      ok: false,
      status: "not_configured",
      message: "E-signature provider is not configured.",
      checkedAt: new Date().toISOString(),
    };
  }

  async createEnvelope() {
    return {
      ok: false,
      status: "not_configured" as const,
      disclaimer: "E-signature provider not configured.",
      errorSummary: "not_configured",
    };
  }

  async sendEnvelope() {
    return { ok: false, disclaimer: "E-signature provider not configured." };
  }

  async getStatus() {
    return { status: "not_configured", disclaimer: "E-signature provider not configured." };
  }

  async processWebhook() {
    return { ok: false, disclaimer: "E-signature provider not configured." };
  }
}
