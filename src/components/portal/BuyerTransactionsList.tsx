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
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 25;

  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (q.trim()) params.set("q", q.trim());
      if (status) params.set("status", status);
      fetch(`/api/portal/buyer/transactions?${params}`)
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error ?? "Unable to load transactions");
          setItems(data.items ?? []);
          setTotal(data.total ?? 0);
          setError(null);
        })
        .catch((e) => setError(e instanceof Error ? e.message : "Error"))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [q, status, page]);

  if (loading) return <p className="text-sm text-[var(--stone)]">Loading transactions…</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  if (!items.length && !q && !status) {
    return (
      <p className="text-sm text-[var(--stone)]">
        No formal transactions yet. Submit a purchase request for qualification.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <input
          className="field"
          placeholder="Search by transaction number"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
        />
        <select
          className="field"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All statuses</option>
          <option value="offer_sent">Offer sent</option>
          <option value="icpo_pending">ICPO pending</option>
          <option value="contract_draft">Contract draft</option>
          <option value="awaiting_buyer_signature">Awaiting your signature</option>
          <option value="contract_executed">Contract executed</option>
          <option value="banking_setup">Banking setup</option>
        </select>
      </div>
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
      <div className="flex items-center gap-3 text-sm text-[var(--stone)]">
        <button type="button" className="btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <span>
          Page {page} of {Math.max(1, Math.ceil(total / pageSize))} ({total} total)
        </span>
        <button type="button" className="btn" disabled={page * pageSize >= total} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
