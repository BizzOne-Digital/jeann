import Decimal from "decimal.js";

Decimal.set({ precision: 28, rounding: Decimal.ROUND_HALF_UP });

export type MoneyInput = string | number | Decimal;
export type Money = Decimal;

export function money(value: MoneyInput): Decimal {
  return new Decimal(value);
}

/** @deprecated Prefer money() */
export function toDecimal(value: MoneyInput): Decimal {
  return money(value);
}

export function addMoney(a: MoneyInput, b: MoneyInput): Decimal {
  return money(a).plus(money(b));
}

export function mulMoney(a: MoneyInput, b: MoneyInput): Decimal {
  return money(a).times(money(b));
}

export function multiplyMoney(a: MoneyInput, b: MoneyInput): Decimal {
  return mulMoney(a, b);
}

export function formatMoney(value: MoneyInput, currency: string): string {
  const n = money(value).toFixed(2);
  return `${currency} ${n}`;
}

export function applyTaxAmount(
  amount: MoneyInput,
  ratePercent: MoneyInput,
): { tax: Decimal; total: Decimal } {
  const base = money(amount);
  const tax = base.times(money(ratePercent)).dividedBy(100);
  return { tax, total: base.plus(tax) };
}
