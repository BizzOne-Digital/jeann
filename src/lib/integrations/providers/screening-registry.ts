import { allowDevelopmentMock } from "@/lib/integrations/env";
import { MOCK_DISCLAIMER } from "@/lib/integrations/types";
import {
  MockScreeningProvider,
  UnconfiguredScreeningProvider,
  type ScreeningProvider,
} from "@/lib/integrations/providers/screening-provider";

let cached: ScreeningProvider | null = null;

export function getScreeningProvider(): ScreeningProvider {
  if (cached) return cached;
  if (allowDevelopmentMock()) {
    cached = new MockScreeningProvider();
    return cached;
  }
  cached = new UnconfiguredScreeningProvider();
  return cached;
}

export async function getScreeningHealth() {
  const p = getScreeningProvider();
  if (p.adapterCode === "development_mock_screening" && !allowDevelopmentMock()) {
    return {
      ok: false,
      status: "not_configured" as const,
      message: MOCK_DISCLAIMER,
      checkedAt: new Date().toISOString(),
    };
  }
  return p.healthCheck();
}
