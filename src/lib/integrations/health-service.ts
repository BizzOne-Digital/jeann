import { getEnv } from "@/lib/config/env";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { getAIProviderHealth } from "@/lib/integrations/providers/ai-registry";
import { getMarketDataHealth } from "@/lib/integrations/providers/market-data-registry";
import { getESignatureHealth } from "@/lib/integrations/providers/esignature-registry";
import { getScreeningHealth } from "@/lib/integrations/providers/screening-registry";
import { getAccountingProvider } from "@/lib/finance/accounting-provider";
import { integrationStatus } from "@/lib/config/env";
import { listFeatureFlags } from "@/lib/integrations/feature-flags";

export async function getIntegrationHealthDashboard() {
  const env = getEnv();
  const accounting = getAccountingProvider();
  const accountingHealth = await accounting.testConnection();

  const [ai, market, esign, screening, flags] = await Promise.all([
    getAIProviderHealth(),
    getMarketDataHealth(),
    getESignatureHealth(),
    getScreeningHealth(),
    listFeatureFlags(),
  ]);

  let jobStats = { pending: 0, failed: 0, deadLetter: 0 };
  let webhookStats = { failed: 0, recent: 0 };
  const { isMongoConfigured } = await import("@/lib/db/mongoose");
  if (isMongoConfigured()) {
    await tryConnectMongo();
    const { IntegrationJob, WebhookEvent } = await import("@/models");
    jobStats = {
      pending: await IntegrationJob.countDocuments({ status: "pending" }),
      failed: await IntegrationJob.countDocuments({ status: "failed" }),
      deadLetter: await IntegrationJob.countDocuments({ status: "dead_letter" }),
    };
    webhookStats = {
      failed: await WebhookEvent.countDocuments({ processingStatus: "failed" }),
      recent: await WebhookEvent.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      }),
    };
  }

  return {
    environment: env.NODE_ENV,
    integrations: integrationStatus(),
    providers: {
      ai,
      marketData: market,
      esignature: esign,
      screening,
      accounting: {
        ok: accountingHealth.ok,
        status: accountingHealth.ok ? "connected" : "not_configured",
        message: accountingHealth.message,
        checkedAt: new Date().toISOString(),
      },
      email: { provider: env.EMAIL_PROVIDER },
      sms: { provider: env.SMS_PROVIDER },
      shipmentTracking: { provider: env.SHIPMENT_TRACKING_PROVIDER },
    },
    jobs: jobStats,
    webhooks: webhookStats,
    featureFlags: flags.map((f: { key: string; label: string; enabled: boolean; environments: string[] }) => ({
      key: f.key,
      label: f.label,
      enabled: f.enabled,
      environments: f.environments,
    })),
    disclaimer: "Provider health is operational status only — not certification of external services.",
  };
}
