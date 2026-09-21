import { getEnv } from "@/lib/config/env";
import type { ShippingTrackingProvider } from "@/lib/shipments/tracking-provider";
import { Terminal49ShippingProvider } from "@/lib/integrations/providers/terminal49/provider";
import { isTerminal49Configured } from "@/lib/integrations/providers/terminal49/client";
import { EasyPostShippingProvider } from "@/lib/integrations/providers/easypost/provider";
import { isEasyPostConfigured } from "@/lib/integrations/providers/easypost/client";

class ManualShippingTrackingProvider implements ShippingTrackingProvider {
  readonly name = "manual";

  async createWatch(): Promise<void> {
    return;
  }

  async getCurrentStatus() {
    return null;
  }

  async getEventHistory() {
    return [];
  }

  async processWebhook() {
    return [];
  }

  normalizeEvent() {
    return null;
  }

  async healthCheck() {
    return { ok: true, message: "Manual milestone tracking (no live carrier feed)." };
  }
}

const manual = new ManualShippingTrackingProvider();

export function getShippingTrackingProviderByAdapter(adapter: string): ShippingTrackingProvider {
  switch (adapter) {
    case "terminal49":
      if (isTerminal49Configured()) return new Terminal49ShippingProvider();
      return manual;
    case "easypost":
      if (isEasyPostConfigured()) return new EasyPostShippingProvider();
      return manual;
    default:
      return manual;
  }
}

let cachedDefault: ShippingTrackingProvider | null = null;

/** Default adapter from SHIPMENT_TRACKING_PROVIDER (legacy single-provider mode). */
export function getShippingTrackingProvider(): ShippingTrackingProvider {
  if (cachedDefault) return cachedDefault;
  const env = getEnv();
  if (env.SHIPMENT_TRACKING_PROVIDER === "multi") {
    cachedDefault = manual;
    return cachedDefault;
  }
  cachedDefault = getShippingTrackingProviderByAdapter(env.SHIPMENT_TRACKING_PROVIDER);
  return cachedDefault;
}

export function isAnyLiveTrackingConfigured(): boolean {
  return isTerminal49Configured() || isEasyPostConfigured();
}

export async function getShippingTrackingHealth() {
  const [terminal49, easypost] = await Promise.all([
    getShippingTrackingProviderByAdapter("terminal49").healthCheck(),
    getShippingTrackingProviderByAdapter("easypost").healthCheck(),
  ]);
  const env = getEnv();
  return {
    mode: env.SHIPMENT_TRACKING_PROVIDER,
    terminal49: { adapter: "terminal49", ...terminal49, checkedAt: new Date().toISOString() },
    easypost: { adapter: "easypost", ...easypost, checkedAt: new Date().toISOString() },
    disclaimer: "Ocean (Terminal49) and parcel/courier (EasyPost) can run side by side per tracking reference.",
  };
}
