import { MOCK_DISCLAIMER, type ProviderHealthResult } from "@/lib/integrations/types";

export type MarketObservationInput = {
  commodity: string;
  marketRegion: string;
  dataType: string;
  unit: string;
  currency: string;
  observationDate: string;
  value: string;
  providerReference?: string;
  licensingClassification?: string;
};

export interface MarketDataProvider {
  readonly name: string;
  readonly adapterCode: string;
  healthCheck(): Promise<ProviderHealthResult>;
  fetchObservations(commodity: string, region: string): Promise<{
    ok: boolean;
    status: "not_configured" | "success" | "failed";
    observations: MarketObservationInput[];
    errorSummary?: string;
    disclaimer: string;
  }>;
}

export class MockMarketDataProvider implements MarketDataProvider {
  readonly name = "mock_vesper";
  readonly adapterCode = "development_mock_vesper";

  async healthCheck(): Promise<ProviderHealthResult> {
    return {
      ok: true,
      status: "connected",
      message: `${MOCK_DISCLAIMER} — Mock Vesper.`,
      checkedAt: new Date().toISOString(),
    };
  }

  async fetchObservations(commodity: string, region: string) {
    return {
      ok: true,
      status: "success" as const,
      disclaimer: MOCK_DISCLAIMER,
      observations: [
        {
          commodity,
          marketRegion: region,
          dataType: "spot",
          unit: "MT",
          currency: "USD",
          observationDate: new Date().toISOString(),
          value: "1050.00",
          providerReference: `MOCK-VESPER-${commodity}`,
          licensingClassification: "internal_only",
        },
      ],
    };
  }
}

export class UnconfiguredMarketDataProvider implements MarketDataProvider {
  readonly name = "unconfigured_market_data";
  readonly adapterCode = "unconfigured";

  async healthCheck(): Promise<ProviderHealthResult> {
    return {
      ok: false,
      status: "not_configured",
      message: "Market data provider is not configured.",
      checkedAt: new Date().toISOString(),
    };
  }

  async fetchObservations(_commodity: string, _region: string) {
    return {
      ok: false,
      status: "not_configured" as const,
      observations: [],
      disclaimer: "Market data provider not configured.",
      errorSummary: "not_configured",
    };
  }
}
