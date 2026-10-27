import { money } from "@/lib/finance/money";

/** Default Canadian HST rate (Ontario 13%). Callers may override with a TaxConfiguration rate. */
export const CANADA_HST_RATE = "0.13";

export type RollupGranularity = "month" | "quarter" | "year";

export interface TransactionFinanceInput {
  transactionId: string;
  transactionNumber: string;
  status: string;
  currency?: string;
  buyerName?: string;
  supplierName?: string;
  productName?: string;
  /** Where periodDate came from. */
  periodSource?: "delivery" | "invoice" | "created";
  /** Costs that could not be expressed in the row currency and were excluded. */
  unconvertedCosts?: number;
  /** Date used for period roll-ups (first invoice date, falling back to creation). */
  periodDate: Date;
  /** Full contract total per PSA/SPA (buyer-side invoiced/contract amount). */
  contractTotal: string;
  /** Purchasing cost excluding any HST/GST (supplier bill subtotal). */
  purchasingCost: string;
  bankingFees: string;
  agentFees: string;
  /** Other posted direct costs (freight, inspection, etc.); defaults to 0. */
  otherCosts?: string;
  /** True when the supplier organisation is in Canada (local purchase). */
  canadianSupplier: boolean;
  /** Optional override of HST rate (decimal string). */
  hstRate?: string;
}

export interface TransactionFinanceRow {
  transactionId: string;
  transactionNumber: string;
  status: string;
  currency: string;
  periodSource: "delivery" | "invoice" | "created";
  unconvertedCosts: number;
  buyerName?: string;
  supplierName?: string;
  productName?: string;
  periodDate: string;
  contractTotal: string;
  purchasingCost: string;
  bankingFees: string;
  agentFees: string;
  otherCosts: string;
  canadianSupplier: boolean;
  hstRate: string;
  /** HST/GST on local Canadian purchase, deducted automatically; "0.00" when not applicable. */
  hstAmount: string;
  /** Profit = contract total - purchasing - banking - agent - other costs - HST. */
  profit: string;
}

export function computeCanadaHst(purchasingCost: string, canadian: boolean, rate = CANADA_HST_RATE) {
  if (!canadian) return "0.00";
  return money(purchasingCost).times(rate).toDecimalPlaces(2).toFixed(2);
}

export function buildTransactionFinanceRow(input: TransactionFinanceInput): TransactionFinanceRow {
  const rate = input.hstRate ?? CANADA_HST_RATE;
  const hst = computeCanadaHst(input.purchasingCost, input.canadianSupplier, rate);
  const other = input.otherCosts ?? "0";
  const profit = money(input.contractTotal)
    .minus(input.purchasingCost)
    .minus(input.bankingFees)
    .minus(input.agentFees)
    .minus(other)
    .minus(hst)
    .toDecimalPlaces(2)
    .toFixed(2);
  return {
    transactionId: input.transactionId,
    transactionNumber: input.transactionNumber,
    status: input.status,
    currency: input.currency ?? "USD",
    periodSource: input.periodSource ?? "created",
    unconvertedCosts: input.unconvertedCosts ?? 0,
    buyerName: input.buyerName,
    supplierName: input.supplierName,
    productName: input.productName,
    periodDate: input.periodDate.toISOString(),
    contractTotal: input.contractTotal,
    purchasingCost: input.purchasingCost,
    bankingFees: input.bankingFees,
    agentFees: input.agentFees,
    otherCosts: other,
    canadianSupplier: input.canadianSupplier,
    hstRate: input.canadianSupplier ? rate : "0",
    hstAmount: hst,
    profit,
  };
}

export function periodKey(date: Date, granularity: RollupGranularity): string {
  const y = date.getUTCFullYear();
  if (granularity === "year") return String(y);
  const m = date.getUTCMonth();
  if (granularity === "quarter") return `${y}-Q${Math.floor(m / 3) + 1}`;
  return `${y}-${String(m + 1).padStart(2, "0")}`;
}

export interface RollupRow {
  period: string;
  currency: string;
  transactions: number;
  contractTotal: string;
  purchasingCost: string;
  bankingFees: string;
  agentFees: string;
  otherCosts: string;
  hstAmount: string;
  profit: string;
}

const FIELDS = ["contractTotal", "purchasingCost", "bankingFees", "agentFees", "otherCosts", "hstAmount", "profit"] as const;

export function rollupRows(rows: TransactionFinanceRow[], granularity: RollupGranularity): RollupRow[] {
  const map = new Map<string, { n: number; sums: Record<(typeof FIELDS)[number], ReturnType<typeof money>> }>();
  for (const r of rows) {
    const key = `${periodKey(new Date(r.periodDate), granularity)}|${r.currency}`;
    const acc = map.get(key) ?? {
      n: 0,
      sums: Object.fromEntries(FIELDS.map((f) => [f, money(0)])) as Record<(typeof FIELDS)[number], ReturnType<typeof money>>,
    };
    acc.n += 1;
    for (const f of FIELDS) acc.sums[f] = acc.sums[f].plus(r[f]);
    map.set(key, acc);
  }
  return [...map.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([key, a]) => ({
      period: key.split("|")[0],
      currency: key.split("|")[1],
      transactions: a.n,
      ...(Object.fromEntries(FIELDS.map((f) => [f, a.sums[f].toFixed(2)])) as Record<(typeof FIELDS)[number], string>),
    }));
}

export function matchesSearch(row: TransactionFinanceRow, q: string): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return [row.transactionNumber, row.buyerName, row.supplierName, row.productName, row.status]
    .filter(Boolean)
    .some((v) => String(v).toLowerCase().includes(needle));
}

/** Accepts "0.13" or "13" / "13%" and returns a decimal-string rate, or null if invalid. */
export function normalizeRate(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const cleaned = raw.trim().replace(/%$/, "");
  if (!/^\d+(\.\d+)?$/.test(cleaned)) return null;
  const d = money(cleaned);
  const rate = d.gt(1) || raw.trim().endsWith("%") ? d.div(100) : d;
  if (rate.lte(0) || rate.gt(1)) return null;
  return rate.toString();
}
