"use client";

import { useEffect, useState } from "react";

type Dashboard = {
  currency: string;
  revenue: string;
  procurementCost: string;
  grossTradingMargin: string;
  directOperationalCosts: string;
  contributionProfit: string;
  receivables: string;
  payables: string;
  pendingPaymentVerifications: number;
  disclaimer: string;
  labels: Record<string, string>;
};

export function FinanceDashboard() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/finance/dashboard")
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Unable to load finance dashboard");
        setData(json);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!data) return <p className="text-sm text-[var(--stone)]">Loading finance dashboard…</p>;

  const cards = [
    { label: data.labels.revenue, value: data.revenue },
    { label: data.labels.procurementCost, value: data.procurementCost },
    { label: data.labels.grossTradingMargin, value: data.grossTradingMargin },
    { label: data.labels.directOperationalCosts, value: data.directOperationalCosts },
    { label: data.labels.contributionProfit, value: data.contributionProfit },
    { label: data.labels.receivables, value: data.receivables },
    { label: data.labels.payables, value: data.payables },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border border-[var(--line)] bg-white p-4">
            <p className="text-xs text-[var(--stone)]">{c.label}</p>
            <p className="mt-1 text-lg font-semibold text-[var(--navy)]">
              {data.currency} {Number(c.value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        ))}
      </div>
      <p className="text-xs text-[var(--stone)]">{data.disclaimer}</p>
      {data.pendingPaymentVerifications > 0 && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded p-3">
          {data.pendingPaymentVerifications} payment(s) awaiting verification.
        </p>
      )}
    </div>
  );
}
