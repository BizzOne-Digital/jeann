import {
  PAYMENT_TERM_STRUCTURES,
  type PaymentTermStructure,
} from "@/lib/content/payment-terms";
import { SITE_SETTINGS_KEY } from "@/models/SiteSettings";

export type PaymentTermsConfig = {
  enabledIds: string[];
  /** Structure id admin marks as best fit for current programmes */
  preferredId: string | null;
};

export type PaymentTermOption = PaymentTermStructure & { enabled: boolean };

export const DEFAULT_PAYMENT_TERMS_CONFIG: PaymentTermsConfig = {
  enabledIds: PAYMENT_TERM_STRUCTURES.filter((item) => item.enabledByDefault).map(
    (item) => item.id,
  ),
  preferredId: "lc-at-sight-sblc",
};

function normalizeConfig(raw: unknown): PaymentTermsConfig {
  if (!raw || typeof raw !== "object") return DEFAULT_PAYMENT_TERMS_CONFIG;
  const data = raw as { enabledIds?: unknown; preferredId?: unknown };
  const validIds = new Set(PAYMENT_TERM_STRUCTURES.map((item) => item.id));
  const enabledIds = Array.isArray(data.enabledIds)
    ? data.enabledIds.filter((id): id is string => typeof id === "string" && validIds.has(id))
    : DEFAULT_PAYMENT_TERMS_CONFIG.enabledIds;
  const preferredId =
    typeof data.preferredId === "string" && validIds.has(data.preferredId)
      ? data.preferredId
      : DEFAULT_PAYMENT_TERMS_CONFIG.preferredId;

  return {
    enabledIds: enabledIds.length ? enabledIds : DEFAULT_PAYMENT_TERMS_CONFIG.enabledIds,
    preferredId,
  };
}

export async function loadPaymentTermsConfig(): Promise<PaymentTermsConfig> {
  const { isMongoConfigured, tryConnectMongo } = await import("@/lib/db/mongoose");
  if (!isMongoConfigured() || !(await tryConnectMongo())) {
    return DEFAULT_PAYMENT_TERMS_CONFIG;
  }
  const { SiteSettings } = await import("@/models");
  const doc = await SiteSettings.findOne({ key: SITE_SETTINGS_KEY }).lean();
  return normalizeConfig(doc?.paymentTermsConfig);
}

export async function savePaymentTermsConfig(config: PaymentTermsConfig) {
  const { tryConnectMongo } = await import("@/lib/db/mongoose");
  if (!(await tryConnectMongo())) throw new Error("Database unavailable.");
  const { SiteSettings } = await import("@/models");
  const normalized = normalizeConfig(config);
  await SiteSettings.findOneAndUpdate(
    { key: SITE_SETTINGS_KEY },
    { $set: { paymentTermsConfig: normalized } },
    { upsert: true },
  );
  return normalized;
}

export function mergePaymentTermsWithConfig(config: PaymentTermsConfig): PaymentTermOption[] {
  const enabledSet = new Set(config.enabledIds);
  return PAYMENT_TERM_STRUCTURES.map((item) => ({
    ...item,
    enabled: enabledSet.has(item.id),
  }));
}

export function getEnabledPaymentTerms(config: PaymentTermsConfig): PaymentTermStructure[] {
  const enabledSet = new Set(config.enabledIds);
  return PAYMENT_TERM_STRUCTURES.filter((item) => enabledSet.has(item.id));
}
