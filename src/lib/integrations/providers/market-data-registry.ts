import { getEnv } from "@/lib/config/env";
import { allowDevelopmentMock } from "@/lib/integrations/env";
import { MOCK_DISCLAIMER, type ProviderHealthResult } from "@/lib/integrations/types";
import {
  MockMarketDataProvider,
  UnconfiguredMarketDataProvider,
  type MarketDataProvider,
} from "@/lib/integrations/providers/market-data-provider";

class VesperMarketDataProvider implements MarketDataProvider {
  readonly name = "vesper";
  readonly adapterCode = "vesper";

  async healthCheck() {
    if (!process.env.VESPER_API_KEY || process.env.VESPER_ENABLED !== "true") {
      return {
        ok: false,
        status: "not_configured" as const,
        message: "Vesper API not configured.",
        checkedAt: new Date().toISOString(),
      };
    }
    return {
      ok: true,
      status: "connected" as const,
      message: "Vesper credentials present.",
      checkedAt: new Date().toISOString(),
    };
  }

  async fetchObservations(commodity: string, region: string) {
    return {
      ok: false,
      status: "not_configured" as const,
      observations: [],
      disclaimer: "Vesper licensed API adapter — configure VESPER_API_KEY.",
      errorSummary: "not_configured",
    };
  }
}

let cached: MarketDataProvider | null = null;

export function getMarketDataProvider(): MarketDataProvider {
  if (cached) return cached;
  if (process.env.VESPER_API_KEY && process.env.VESPER_ENABLED === "true") {
    cached = new VesperMarketDataProvider();
    return cached;
  }
  if (allowDevelopmentMock()) {
    cached = new MockMarketDataProvider();
    return cached;
  }
  cached = new UnconfiguredMarketDataProvider();
  return cached;
}

export async function getMarketDataHealth(): Promise<ProviderHealthResult> {
  const p = getMarketDataProvider();
  if (p.adapterCode === "development_mock_vesper" && !allowDevelopmentMock()) {
    return {
      ok: false,
      status: "not_configured",
      message: MOCK_DISCLAIMER,
      checkedAt: new Date().toISOString(),
    };
  }
  return p.healthCheck();
}
