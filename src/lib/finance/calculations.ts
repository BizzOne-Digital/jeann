import { money, type MoneyInput } from "@/lib/finance/money";
import Decimal from "decimal.js";
import { Types } from "mongoose";

export function roundMoney(value: MoneyInput, precision = 2, mode: Decimal.Rounding = Decimal.ROUND_HALF_UP): Decimal {
  return money(value).toDecimalPlaces(precision, mode);
}

export function decimal128(value: MoneyInput): Types.Decimal128 {
  return Types.Decimal128.fromString(money(value).toString());
}

export function sumDecimal128(values: string[]): string {
  let total = money(0);
  for (const v of values) total = total.plus(money(v));
  return total.toString();
}

export function calculateLineTotal(quantity: MoneyInput, unitPrice: MoneyInput): Decimal {
  return roundMoney(money(quantity).times(money(unitPrice)));
}

export type TaxCalculationInput = {
  subtotal: MoneyInput;
  taxCode?: string;
  ratePercent?: MoneyInput;
  taxInclusive?: boolean;
  recoverable?: boolean;
};

export type TaxCalculationResult = {
  subtotal: Decimal;
  taxAmount: Decimal;
  total: Decimal;
  recoverableTax: Decimal;
  nonRecoverableTax: Decimal;
};

export function calculateTax(input: TaxCalculationInput): TaxCalculationResult {
  const subtotal = money(input.subtotal);
  if (!input.taxCode || !input.ratePercent || money(input.ratePercent).eq(0)) {
    return {
      subtotal,
      taxAmount: money(0),
      total: subtotal,
      recoverableTax: money(0),
      nonRecoverableTax: money(0),
    };
  }

  const rate = money(input.ratePercent).div(100);
  if (input.taxInclusive) {
    const taxAmount = roundMoney(subtotal.times(rate).div(rate.plus(1)));
    const net = subtotal.minus(taxAmount);
    const recoverable = input.recoverable ? taxAmount : money(0);
    return {
      subtotal: net,
      taxAmount,
      total: subtotal,
      recoverableTax: recoverable,
      nonRecoverableTax: input.recoverable ? money(0) : taxAmount,
    };
  }

  const taxAmount = roundMoney(subtotal.times(rate));
  const recoverable = input.recoverable ? taxAmount : money(0);
  return {
    subtotal,
    taxAmount,
    total: subtotal.plus(taxAmount),
    recoverableTax: recoverable,
    nonRecoverableTax: input.recoverable ? money(0) : taxAmount,
  };
}

export type ProfitabilityResult = {
  revenue: string;
  procurementCost: string;
  grossTradingMargin: string;
  directOperationalCosts: string;
  contributionProfit: string;
  currency: string;
};

export function calculateProfitability(input: {
  revenue: MoneyInput;
  procurementCost: MoneyInput;
  directCosts: MoneyInput;
  currency: string;
}): ProfitabilityResult {
  const revenue = roundMoney(input.revenue);
  const procurement = roundMoney(input.procurementCost);
  const direct = roundMoney(input.directCosts);
  const margin = revenue.minus(procurement);
  const contribution = margin.minus(direct);
  return {
    revenue: revenue.toString(),
    procurementCost: procurement.toString(),
    grossTradingMargin: margin.toString(),
    directOperationalCosts: direct.toString(),
    contributionProfit: contribution.toString(),
    currency: input.currency,
  };
}
