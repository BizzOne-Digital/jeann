"use client";

import { useCallback, useEffect, useState } from "react";
import type { RollupRow, TransactionFinanceRow } from "@/lib/finance/transaction-summary";

type Summary = {
  rows: TransactionFinanceRow[];
  canadaRows: TransactionFinanceRow[];
  rollups: Record<"month" | "quarter" | "year", RollupRow[]>;
  hst: { rate: string; source: "tax_configuration" | "default" };
  disclaimer: string;
};

type TaxResult = { status: string; message?: string; estimatedTax?: string; rate?: string; provider?: string };

const TABS = [
  { id: "contracts", label: "1. Contract totals" },
  { id: "delivery", label: "2. Monthly delivery" },
  { id: "canada", label: "Purchase in Canada (HST/GST)" },
  { id: "rollups", label: "Monthly / Quarterly / Yearly" },
] as const;

const fmt = (v: string) => Number(v).toLocaleString(undefined, { minimumFractionDigits: 2 });
const SOURCE_LABEL = { delivery: "delivery", invoice: "invoice", created: "created" } as const;

/** Internal finance tabs. Pass transactionId to scope to a single contract (used in the transaction panel). */
export function FinanceTransactionTabs({ transactionId }: { transactionId?: string }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("contracts");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [granularity, setGranularity] = useState<"month" | "quarter" | "year">("month");
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [taxResults, setTaxResults] = useState<Record<string, TaxResult>>({});

  const load = useCallback(() => {
    const p = new URLSearchParams();
    if (transactionId) p.set("transactionId", transactionId);
    if (q) p.set("q", q);
    if (status) p.set("status", status);
    if (from) p.set("from", from);
    if (to) p.set("to", to);
    fetch(`/api/finance/summary?${p}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Unable to load finance summary");
        setData(json);
        setError(null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, [transactionId, q, status, from, to]);

  useEffect(() => {
    load();
  }, [load]);

  async function estimateTax(r: RollupRow) {
    const key = `${r.period}|${r.currency}`;
    try {
      const res = await fetch("/api/finance/corporate-tax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ periodLabel: r.period, currency: r.currency, operationalProfit: r.profit }),
      });
      const json = await res.json();
      setTaxResults((prev) => ({ ...prev, [key]: res.ok ? json : { status: "failed", message: json.error } }));
    } catch {
      setTaxResults((prev) => ({ ...prev, [key]: { status: "failed", message: "Request failed" } }));
    }
  }

  const th = "px-3 py-2 text-left text-xs uppercase text-[var(--stone)]";
  const td = "px-3 py-2 text-sm";
  const input = "rounded border border-[var(--line)] px-3 py-2 text-sm";

  return (
    <div className="space-y-4">
      {!transactionId ? (
        <div className="flex flex-wrap gap-2">
          <input className={input} placeholder="Search number, buyer, supplier, product" value={q} onChange={(e) => setQ(e.target.value)} />
          <input className={input} placeholder="Status" value={status} onChange={(e) => setStatus(e.target.value)} />
          <input type="date" aria-label="From" className={input} value={from} onChange={(e) => setFrom(e.target.value)} />
          <input type="date" aria-label="To" className={input} value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2 border-b border-[var(--line)]">
        {TABS.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`px-3 py-2 text-sm ${tab === t.id ? "border-b-2 border-[var(--navy)] font-semibold" : "text-[var(--stone)]"}`}>
            {t.label}
          </button>
        ))}
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {!data && !error ? <p className="text-sm text-[var(--stone)]">Loading…</p> : null}
      {data && tab === "contracts" ? (
        <div className="table-scroll rounded-lg border border-[var(--line)] bg-white">
          <table className="min-w-full">
            <thead><tr><th className={th}>Transaction</th><th className={th}>Buyer</th><th className={th}>Supplier</th><th className={th}>Status</th><th className={th}>Currency</th><th className={th}>Contract total</th></tr></thead>
            <tbody>
              {data.rows.map((r) => (
                <tr key={r.transactionId} className="border-t border-[var(--line)]">
                  <td className={td}>{r.transactionNumber}</td><td className={td}>{r.buyerName ?? "-"}</td><td className={td}>{r.supplierName ?? "-"}</td><td className={td}>{r.status}</td><td className={td}>{r.currency}</td><td className={td}>{fmt(r.contractTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.rows.length === 0 ? <p className="p-3 text-sm text-[var(--stone)]">No matching transactions.</p> : null}
        </div>
      ) : null}
      {data && (tab === "delivery" || tab === "canada") ? (
        <div className="table-scroll rounded-lg border border-[var(--line)] bg-white">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className={th}>Transaction</th><th className={th}>Month</th><th className={th}>Cur.</th><th className={th}>Total</th><th className={th}>Purchasing</th>
                {tab === "canada" ? <th className={th}>HST/GST {Number(data.hst.rate) * 100}%</th> : null}
                <th className={th}>Banking fee</th><th className={th}>Agent fee</th><th className={th}>Other</th><th className={th}>Profit</th>
              </tr>
            </thead>
            <tbody>
              {(tab === "canada" ? data.canadaRows : data.rows).map((r) => (
                <tr key={r.transactionId} className="border-t border-[var(--line)]">
                  <td className={td}>{r.transactionNumber}</td>
                  <td className={td}>{r.periodDate.slice(0, 7)} <span className="text-xs text-[var(--stone)]">({SOURCE_LABEL[r.periodSource]})</span></td>
                  <td className={td}>{r.currency}</td><td className={td}>{fmt(r.contractTotal)}</td><td className={td}>{fmt(r.purchasingCost)}</td>
                  {tab === "canada" ? <td className={td}>{fmt(r.hstAmount)}</td> : null}
                  <td className={td}>{fmt(r.bankingFees)}</td><td className={td}>{fmt(r.agentFees)}</td><td className={td}>{fmt(r.otherCosts)}</td>
                  <td className={td}>{fmt(r.profit)}{r.unconvertedCosts > 0 ? <span title="Some costs are in another currency and were excluded"> *</span> : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="p-3 text-xs text-[var(--stone)]">
            Profit deducts HST/GST on Canadian supplier purchases (rate {Number(data.hst.rate) * 100}%, source: {data.hst.source === "tax_configuration" ? "tax configuration" : "default 13%"}). Month = delivery date, else first invoice, else creation date. * = costs in a different currency excluded.
          </p>
        </div>
      ) : null}
      {data && tab === "rollups" ? (
        <div className="space-y-3">
          <select className={input} value={granularity} onChange={(e) => setGranularity(e.target.value as typeof granularity)}>
            <option value="month">Monthly</option><option value="quarter">Quarterly</option><option value="year">Yearly</option>
          </select>
          <div className="table-scroll rounded-lg border border-[var(--line)] bg-white">
            <table className="min-w-full">
              <thead><tr><th className={th}>Period</th><th className={th}>Cur.</th><th className={th}>Txns</th><th className={th}>Total</th><th className={th}>Purchasing</th><th className={th}>Banking</th><th className={th}>Agent</th><th className={th}>HST/GST</th><th className={th}>Profit</th><th className={th}>Corporate tax</th></tr></thead>
              <tbody>
                {data.rollups[granularity].map((r) => {
                  const key = `${r.period}|${r.currency}`;
                  const t = taxResults[key];
                  return (
                    <tr key={key} className="border-t border-[var(--line)]">
                      <td className={td}>{r.period}</td><td className={td}>{r.currency}</td><td className={td}>{r.transactions}</td><td className={td}>{fmt(r.contractTotal)}</td><td className={td}>{fmt(r.purchasingCost)}</td><td className={td}>{fmt(r.bankingFees)}</td><td className={td}>{fmt(r.agentFees)}</td><td className={td}>{fmt(r.hstAmount)}</td><td className={td}>{fmt(r.profit)}</td>
                      <td className={td}>
                        {t ? (
                          t.status === "ok" ? `${r.currency} ${fmt(t.estimatedTax ?? "0")} (${t.provider})` : <span className="text-xs text-amber-800">{t.status === "not_configured" ? "Not configured" : t.message}</span>
                        ) : (
                          <button type="button" className="text-xs underline" onClick={() => void estimateTax(r)}>Estimate</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[var(--stone)]">Roll-ups are grouped by currency; currencies are never added together. Corporate tax estimates come only from a configured accounting provider.</p>
        </div>
      ) : null}
      {data ? <p className="text-xs text-[var(--stone)]">{data.disclaimer}</p> : null}
    </div>
  );
}
