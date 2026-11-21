"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PortalPage } from "@/components/portal/PortalPage";

type Item = {
  id: string;
  transactionNumber: string;
  companyName?: string;
  workflowLabel: string;
  side: string;
  transactionType: string;
  status?: string;
  locked?: boolean;
  createdAt?: string;
};

export default function WorkspaceTransactionsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      if (status === "closed") params.set("closed", "1");
      else if (status) params.set("status", status);
      fetch(`/api/workspace/transactions?${params}`, { credentials: "same-origin" })
        .then(async (res) => {
          const json = await res.json();
          if (!res.ok) throw new Error(json.error ?? "Unable to load");
          setItems(json.items ?? []);
          setError(null);
        })
        .catch((e) => setError(e instanceof Error ? e.message : "Error"));
    }, 250);
    return () => clearTimeout(t);
  }, [q, from, to, status]);

  return (
    <PortalPage
      title="Transactions"
      description="Operate buyer and supplier workflows, documents, finance, and banking from one workspace."
    >
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <input
          className="field"
          placeholder="Search by company name, order number or email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <label className="text-xs text-[var(--stone)]">
          From
          <input type="date" className="field block" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="text-xs text-[var(--stone)]">
          To
          <input type="date" className="field block" value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
        <select className="field" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All records</option>
          <option value="active">Open</option>
          <option value="closed">Closed (locked)</option>
          <option value="on_hold">On hold</option>
          <option value="cancelled">Cancelled (locked)</option>
        </select>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {items.length === 0 && !error ? (
        <p className="text-sm text-[var(--stone)]">No transactions found.</p>
      ) : (
        <ul className="divide-y divide-[var(--line)] rounded-lg border border-[var(--line)] bg-white">
          {items.map((t) => (
            <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
              <div>
                <Link
                  href={`/workspace/transactions/${t.id}`}
                  className="font-semibold text-[var(--navy)] underline"
                >
                  {t.transactionNumber}
                </Link>
                <p className="text-xs text-[var(--stone)]">
                  {t.companyName ? `${t.companyName} · ` : ""}
                  {t.transactionType} · {t.side} · {t.workflowLabel}
                  {t.createdAt ? ` · ${new Date(t.createdAt).toLocaleDateString()}` : ""}
                  {t.locked ? " · Locked" : ""}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </PortalPage>
  );
}
