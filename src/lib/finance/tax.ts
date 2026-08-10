import { multiplyMoney, toDecimal, type MoneyInput } from "@/lib/finance/money";

export interface TaxLineConfig {
  code: string;
  /** Rate as decimal string, e.g. "0.13" for 13% — sourced from TaxConfiguration, not hardcoded law. */
  rate: string;
  label?: string;
}

export interface TaxConfig {
  lines: TaxLineConfig[];
}

/** Example seed config for Ontario HST illustration — replace with DB TaxConfiguration at runtime. */
export const EXAMPLE_HST_ON_CONFIG: TaxConfig = {
  lines: [{ code: "HST_ON", rate: "0.13", label: "HST (example 13%)" }],
};

export interface TaxBreakdownLine {
  code: string;
  label: string;
  rate: string;
  amount: string;
}

export interface TaxResult {
  subtotal: string;
  taxTotal: string;
  total: string;
  lines: TaxBreakdownLine[];
}

export function applyTax(subtotal: MoneyInput, config: TaxConfig): TaxResult {
  const base = toDecimal(subtotal);
  const lines: TaxBreakdownLine[] = [];
  let taxTotal = toDecimal("0");

  for (const line of config.lines) {
    const amount = multiplyMoney(base, line.rate);
    taxTotal = taxTotal.plus(amount);
    lines.push({
      code: line.code,
      label: line.label ?? line.code,
      rate: line.rate,
      amount: amount.toFixed(2),
    });
  }

  const total = base.plus(taxTotal);

  return {
    subtotal: base.toFixed(2),
    taxTotal: taxTotal.toFixed(2),
    total: total.toFixed(2),
    lines,
  };
}
