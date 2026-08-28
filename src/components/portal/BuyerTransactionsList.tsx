"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type TransactionRow = {
  id: string;
  transactionNumber: string;
  workflowStatus: string;
  workflowLabel: string;
  status: string;
  currentStepKey?: string;
  createdAt: string;
};

export function BuyerTransactionsList() {
  const [items, setItems] = useState<TransactionRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portal/buyer/transactions")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Unable to load transactions");
        setItems(data.items ?? []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-[var(--stone)]">Loading transactions…</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  if (!items.length) {
    return (
      <p className="text-sm text-[var(--stone)]">
        No formal transactions yet. Submit a purchase request for qualification.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--line)] bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-[var(--surface)] text-left text-[var(--stone)]">
          <tr>
            <th className="px-4 py-3">Number</th>
            <th className="px-4 py-3">Workflow</th>
            <th className="px-4 py-3">Step</th>
            <th className="px-4 py-3">Created</th>
          </tr>
        </thead>
        <tbody>
          {items.map((t) => (
            <tr key={t.id} className="border-t border-[var(--line)]">
              <td className="px-4 py-3">
                <Link
                  href={`/portal/buyer/transactions/${t.id}`}
                  className="font-medium text-[var(--navy)] hover:underline"
                >
                  {t.transactionNumber}
                </Link>
              </td>
              <td className="px-4 py-3">{t.workflowLabel}</td>
              <td className="px-4 py-3">{t.currentStepKey ?? "—"}</td>
              <td className="px-4 py-3">
                {new Date(t.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
