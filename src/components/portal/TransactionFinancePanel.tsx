"use client";

import { useEffect, useState } from "react";

type Profitability = {
  revenue?: string;
  procurementCost?: string;
  grossTradingMargin?: string;
  directOperationalCosts?: string;
  contributionProfit?: string;
  labels?: Record<string, string>;
  error?: string;
};

export function TransactionFinancePanel({
  transactionId,
  canView = true,
}: {
  transactionId: string;
  canView?: boolean;
}) {
  const [data, setData] = useState<Profitability | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canView) return;
    fetch(`/api/finance/profitability?transactionId=${transactionId}`, {
      credentials: "same-origin",
    })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Unable to load finance");
        setData(json);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, [transactionId, canView]);

  if (!canView) {
    return (
      <section className="rounded-lg border border-[var(--line)] bg-white p-5 text-sm text-[var(--stone)]">
        Profitability and internal finance details are restricted to authorized staff.
      </section>
    );
  }

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!data) return <p className="text-sm text-[var(--stone)]">Loading finance…</p>;

  const rows = [
    { label: data.labels?.revenue ?? "Revenue", value: data.revenue },
    { label: data.labels?.procurementCost ?? "Procurement cost", value: data.procurementCost },
    { label: data.labels?.grossTradingMargin ?? "Gross margin", value: data.grossTradingMargin },
    {
      label: data.labels?.directOperationalCosts ?? "Direct costs",
      value: data.directOperationalCosts,
    },
    {
      label: data.labels?.contributionProfit ?? "Contribution profit",
      value: data.contributionProfit,
      highlight: true,
    },
  ];

  return (
    <section className="rounded-lg border border-[var(--line)] bg-white p-5">
      <h2 className="font-semibold text-[var(--navy)]">Finance & profitability</h2>
      <p className="mt-1 text-xs text-[var(--stone)]">
        Per-transaction operational view. HST/GST applies per configured tax rules for Canadian suppliers.
      </p>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className={`rounded-md border p-3 ${row.highlight ? "border-[var(--forest)] bg-[var(--forest)]/5" : "border-[var(--line)]"}`}
          >
            <dt className="text-xs text-[var(--stone)]">{row.label}</dt>
            <dd className="mt-1 text-lg font-semibold text-[var(--navy)]">
              {row.value ?? "—"}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
