import { MOCK_DISCLAIMER, type ProviderHealthResult } from "@/lib/integrations/types";

export type ScreeningMatchResult = {
  providerMatchId: string;
  matchType: string;
  matchedName: string;
  matchScore: string;
  country?: string;
  sourceListRef?: string;
};

export interface ScreeningProvider {
  readonly name: string;
  readonly adapterCode: string;
  healthCheck(): Promise<ProviderHealthResult>;
  submitScreening(input: {
    organizationName: string;
    country?: string;
    screeningType: string;
  }): Promise<{
    ok: boolean;
    status: "not_configured" | "success" | "failed";
    requestRef?: string;
    matches: ScreeningMatchResult[];
    riskLevel?: string;
    errorSummary?: string;
    disclaimer: string;
  }>;
}

export class MockScreeningProvider implements ScreeningProvider {
  readonly name = "mock_screening";
  readonly adapterCode = "development_mock_screening";

  async healthCheck(): Promise<ProviderHealthResult> {
    return {
      ok: true,
      status: "connected",
      message: `${MOCK_DISCLAIMER} — Mock screening.`,
      checkedAt: new Date().toISOString(),
    };
  }

  async submitScreening(input: { organizationName: string; screeningType: string }) {
    return {
      ok: true,
      status: "success" as const,
      requestRef: `MOCK-SCR-${Date.now()}`,
      riskLevel: "low",
      matches: [
        {
          providerMatchId: "MOCK-MATCH-1",
          matchType: input.screeningType,
          matchedName: input.organizationName,
          matchScore: "0.42",
          country: "CA",
          sourceListRef: "MOCK-LIST",
        },
      ],
      disclaimer: MOCK_DISCLAIMER,
    };
  }
}

export class UnconfiguredScreeningProvider implements ScreeningProvider {
  readonly name = "unconfigured_screening";
  readonly adapterCode = "unconfigured";

  async healthCheck(): Promise<ProviderHealthResult> {
    return {
      ok: false,
      status: "not_configured",
      message: "Screening provider is not configured.",
      checkedAt: new Date().toISOString(),
    };
  }

  async submitScreening() {
    return {
      ok: false,
      status: "not_configured" as const,
      matches: [],
      disclaimer: "Screening provider not configured.",
      errorSummary: "not_configured",
    };
  }
}
