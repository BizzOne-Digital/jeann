"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

type TransactionRow = {
  id: string;
  transactionNumber: string;
  workflowLabel: string;
  currentStepKey?: string;
};

export function BuyerLoiUploadPanel() {
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [transactionId, setTransactionId] = useState("");
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/portal/buyer/transactions", { credentials: "same-origin" })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Unable to load");
        const items = json.items ?? [];
        setTransactions(items);
        if (items[0]?.id) setTransactionId(items[0].id);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!transactionId) return;
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) return;

    setBusy(true);
    setMessage(null);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("documentType", "loi");
      body.append("title", title || `LOI — ${transactions.find((t) => t.id === transactionId)?.transactionNumber ?? "transaction"}`);
      body.append("submitForReview", "true");

      const res = await fetch(`/api/transactions/${transactionId}/documents/upload`, {
        method: "POST",
        credentials: "same-origin",
        body,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      setMessage("LOI uploaded and submitted for review.");
      form.reset();
      setTitle("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  if (error && !transactions.length) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!transactions.length) {
    return (
      <div className="space-y-3 text-sm text-[var(--stone)]">
        <p>
          LOI uploads are linked to a formal transaction. Submit a{" "}
          <Link href="/portal/buyer/new-request" className="font-medium text-[var(--navy)] underline">
            purchase request
          </Link>{" "}
          first, then return here once a transaction is opened.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--stone)]">
        Upload your Letter of Intent (LOI) for an active transaction. Each LOI is stored separately
        and enters the document review workflow.
      </p>

      <form onSubmit={onSubmit} className="max-w-xl space-y-4 rounded-lg border border-[var(--line)] bg-white p-5">
        <label className="label text-sm">
          Transaction
          <select
            className="field mt-1"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            required
          >
            {transactions.map((t) => (
              <option key={t.id} value={t.id}>
                {t.transactionNumber} — {t.workflowLabel}
                {t.currentStepKey ? ` (${t.currentStepKey})` : ""}
              </option>
            ))}
          </select>
        </label>

        <label className="label text-sm">
          Title (optional)
          <input
            className="field mt-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="LOI — Sunflower oil Q2"
          />
        </label>

        <label className="label text-sm">
          LOI file (PDF)
          <input className="field mt-1" name="file" type="file" accept=".pdf" required />
        </label>

        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? "Uploading…" : "Upload LOI"}
        </button>
      </form>

      {message ? <p className="text-sm text-[var(--forest)]">{message}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <p className="text-xs text-[var(--stone)]">
        You can also upload LOI and other documents from the{" "}
        <Link href="/portal/buyer/transactions" className="underline">
          transaction workspace
        </Link>
        .
      </p>
    </div>
  );
}
