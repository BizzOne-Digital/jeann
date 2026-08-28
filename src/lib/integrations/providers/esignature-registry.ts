import { allowDevelopmentMock } from "@/lib/integrations/env";
import { MOCK_DISCLAIMER } from "@/lib/integrations/types";
import {
  MockESignatureProvider,
  UnconfiguredESignatureProvider,
  type ESignatureProvider,
} from "@/lib/integrations/providers/esignature-provider";

let cached: ESignatureProvider | null = null;

export function getESignatureProvider(): ESignatureProvider {
  if (cached) return cached;
  if (process.env.ESIGNATURE_PROVIDER === "docusign" && process.env.ESIGNATURE_API_KEY) {
    // Future: real DocuSign adapter — never use mock when production credentials exist.
    if (allowDevelopmentMock()) {
      cached = new MockESignatureProvider();
      return cached;
    }
    cached = new UnconfiguredESignatureProvider();
    return cached;
  }
  if (allowDevelopmentMock()) {
    cached = new MockESignatureProvider();
    return cached;
  }
  cached = new UnconfiguredESignatureProvider();
  return cached;
}

export async function getESignatureHealth() {
  const p = getESignatureProvider();
  if (p.adapterCode === "development_mock_esignature" && !allowDevelopmentMock()) {
    return {
      ok: false,
      status: "not_configured" as const,
      message: MOCK_DISCLAIMER,
      checkedAt: new Date().toISOString(),
    };
  }
  return p.healthCheck();
}
