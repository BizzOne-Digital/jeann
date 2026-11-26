"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Folder = "pending" | "active" | "closed";

type TransactionRow = {
  id: string;
  transactionNumber: string;
  workflowLabel: string;
  currentStepKey?: string;
  createdAt: string;
  closedAt?: string | null;
  status: string;
};

type RequestRow = {
  id: string;
  reference: string;
  productName: string;
  status: string;
  quantity?: string;
  unit?: string;
  createdAt: string;
  convertedTransactionId: string | null;
};

/** A request is pending until Finekarts has opened a transaction from it or turned it down. */
const PENDING_STATUSES = ["draft", "new", "submitted", "under_review", "more_information_required", "qualified"];

const FOLDER_HELP: Record<Folder, string> = {
  pending: "Requests you started or sent to Finekarts that have not become a transaction yet.",
  active: "Transactions that are running. Open one to see its steps and its own documents.",
  closed: "Finished or cancelled transactions. Their documents stay available to view and download.",
};

function words(value: string) {
  return value.replaceAll("_", " ");
}

/** The buyer's transactions in three folders, each transaction with its own documents inside it. */
export function BuyerTransactionFolders() {
  const [folder, setFolder] = useState<Folder>("active");
  const [q, setQ] = useState("");
  const [pending, setPending] = useState<RequestRow[]>([]);
  const [rows, setRows] = useState<TransactionRow[]>([]);
  const [counts, setCounts] = useState({ pending: 0, active: 0, closed: 0 });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Pending requests and the folder counts load once.
  useEffect(() => {
    fetch("/api/portal/buyer/requests", { credentials: "same-origin" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Unable to load requests.");
        const open = ((data.items ?? []) as RequestRow[]).filter(
          (r) => PENDING_STATUSES.includes(r.status) && !r.convertedTransactionId,
        );
        setPending(open);
        setCounts((c) => ({ ...c, pending: open.length }));
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Unable to load requests."));
  }, []);

  // Active and closed transactions load when their folder is opened or searched.
  useEffect(() => {
    if (folder === "pending") {
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(() => {
      const params = new URLSearchParams({ folder, pageSize: "100" });
      if (q.trim()) params.set("q", q.trim());
      fetch(`/api/portal/buyer/transactions?${params}`, { credentials: "same-origin" })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error ?? "Unable to load transactions.");
          setRows(data.items ?? []);
          if (data.counts) setCounts((c) => ({ ...c, active: data.counts.active, closed: data.counts.closed }));
          setError(null);
        })
        .catch((e) => setError(e instanceof Error ? e.message : "Unable to load transactions."))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [folder, q]);

  const folders: { id: Folder; label: string }[] = [
    { id: "pending", label: "Pending" },
    { id: "active", label: "Active" },
    { id: "closed", label: "Closed" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {folders.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`rounded-md px-4 py-2 text-sm font-medium ${
                folder === f.id ? "bg-[var(--navy)] text-white" : "border border-[var(--line)] text-[var(--stone)] hover:bg-[var(--mist)]"
              }`}
              onClick={() => setFolder(f.id)}
            >
              {f.label} ({counts[f.id]})
            </button>
          ))}
        </div>
        <Link href="/portal/buyer/new-request" className="btn btn-primary">
          New transaction
        </Link>
      </div>

      <p className="text-sm text-[var(--stone)]">{FOLDER_HELP[folder]}</p>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      {folder !== "pending" ? (
        <input
          className="field max-w-xs"
          placeholder="Search by order number"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      ) : null}

      {folder === "pending" ? (
        pending.length === 0 ? (
          <p className="text-sm text-[var(--stone)]">Nothing is pending. Press &quot;New transaction&quot; to start one.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[var(--line)] bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-[var(--surface)] text-left text-[var(--stone)]">
                <tr>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Started</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((r) => (
                  <tr key={r.id} className="border-t border-[var(--line)]">
                    <td className="px-4 py-3 font-medium text-[var(--navy)]">{r.reference}</td>
                    <td className="px-4 py-3">{r.productName}</td>
                    <td className="px-4 py-3">{[r.quantity, r.unit].filter(Boolean).join(" ") || "—"}</td>
                    <td className="px-4 py-3 capitalize">
                      {r.status === "draft" ? "Draft, not sent yet" : words(r.status)}
                    </td>
                    <td className="px-4 py-3">{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : loading ? (
        <p className="text-sm text-[var(--stone)]">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-[var(--stone)]">
          {folder === "active" ? "No active transactions." : "No closed transactions."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[var(--line)] bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-[var(--surface)] text-left text-[var(--stone)]">
              <tr>
                <th className="px-4 py-3">Order number</th>
                <th className="px-4 py-3">Where it is now</th>
                <th className="px-4 py-3">{folder === "closed" ? "Closed" : "Started"}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id} className="border-t border-[var(--line)]">
                  <td className="px-4 py-3 font-medium text-[var(--navy)]">{t.transactionNumber}</td>
                  <td className="px-4 py-3">{t.status === "cancelled" ? "Cancelled" : t.workflowLabel}</td>
                  <td className="px-4 py-3">
                    {new Date(folder === "closed" && t.closedAt ? t.closedAt : t.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/portal/buyer/transactions/${t.id}`} className="btn text-xs">
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
