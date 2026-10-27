import { tryConnectMongo } from "@/lib/db/mongoose";
import { getAccountingProvider } from "@/lib/finance/accounting-provider";
import { normalizeRate } from "@/lib/finance/transaction-summary";

export type CorporateTaxResult =
  | { status: "not_configured"; message: string }
  | { status: "no_rate"; message: string }
  | { status: "failed"; message: string }
  | { status: "ok"; provider: string; rate: string; operationalProfit: string; estimatedTax: string; message?: string };

/**
 * Optional corporate tax estimate delegated to the accounting provider adapter.
 * Never computes a figure itself: without a configured provider that supports it, returns not_configured.
 */
export async function estimateCorporateTax(input: {
  periodLabel: string;
  currency: string;
  operationalProfit: string;
  rateOverride?: string;
}): Promise<CorporateTaxResult> {
  const provider = getAccountingProvider();
  if (process.env.ACCOUNTING_PROVIDER_CONFIGURED !== "true" || typeof provider.estimateCorporateTax !== "function") {
    return {
      status: "not_configured",
      message: "No corporate tax or accounting provider is configured. Connect one in Integrations; no estimate is shown.",
    };
  }
  await tryConnectMongo();
  const { FinancialSettings } = await import("@/models");
  const settings = await FinancialSettings.findOne().lean();
  const rate = normalizeRate(input.rateOverride) ?? normalizeRate(settings?.corporateTaxRate);
  if (!rate) {
    return { status: "no_rate", message: "Set a corporate tax rate in financial settings to request an estimate." };
  }
  try {
    const res = await provider.estimateCorporateTax({
      periodLabel: input.periodLabel,
      currency: input.currency,
      operationalProfit: input.operationalProfit,
      rate,
    });
    if (!res.ok || !res.estimatedTax) {
      return { status: "failed", message: res.message ?? "Provider returned no estimate." };
    }
    return {
      status: "ok",
      provider: provider.name,
      rate,
      operationalProfit: input.operationalProfit,
      estimatedTax: res.estimatedTax,
      message: res.message,
    };
  } catch {
    return { status: "failed", message: "Provider request failed." };
  }
}
