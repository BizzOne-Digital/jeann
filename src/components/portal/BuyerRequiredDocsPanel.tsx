"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  CIS_DESCRIPTION,
  FIS_DESCRIPTION,
  RWA_DESCRIPTION,
  hasQualifyingCis,
  hasQualifyingFis,
  hasQualifyingRwa,
} from "@/lib/banking/rwa";

type TransactionRow = { id: string; transactionNumber: string };
type Doc = { id: string; documentType?: string; workflowStatus: string };

const ITEMS = [
  {
    type: "rwa",
    label: "RWA",
    name: "Ready, Willing and Able letter",
    note: "Required on every LC transaction.",
    description: RWA_DESCRIPTION,
    has: hasQualifyingRwa,
  },
  {
    type: "cis",
    label: "CIS",
    name: "Corporate Information Sheet",
    note: "New buyers upload it once. Returning buyers already have it on record.",
    description: CIS_DESCRIPTION,
    has: hasQualifyingCis,
  },
  {
    type: "fis",
    label: "FIS",
    name: "Financial Information Services document",
    note: "Optional. Upload it if you can. If not, we proceed without it. Returning buyers already have it on record.",
    description: FIS_DESCRIPTION,
    has: hasQualifyingFis,
  },
] as const;

export function BuyerRequiredDocsPanel({ onNext }: { onNext?: () => void }) {
  const [transactions, setTransactions] = useState<TransactionRow[] | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [onRecord, setOnRecord] = useState({ cis: false, fis: false });
  const [busyType, setBusyType] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    fetch("/api/portal/buyer/transactions", { credentials: "same-origin" })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Unable to load transactions.");
        const items: TransactionRow[] = json.items ?? [];
        setTransactions(items);
        if (items[0]?.id) setTransactionId(items[0].id);
      })
      .catch((e) => {
        setTransactions([]);
        setError(e instanceof Error ? e.message : "Unable to load transactions.");
      });
  }, []);

  const loadDocuments = useCallback(async (id: string) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/portal/buyer/transactions/${id}`, { credentials: "same-origin" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to load documents.");
      setDocuments(json.documents ?? []);
      setOnRecord({
        cis: Boolean(json.cisOnRecord),
        fis: Boolean(json.fisOnRecord),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load documents.");
    }
  }, []);

  useEffect(() => {
    if (!transactionId) return;
    let cancelled = false;
    fetch(`/api/portal/buyer/transactions/${transactionId}`, { credentials: "same-origin" })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Unable to load documents.");
        if (cancelled) return;
        setDocuments(json.documents ?? []);
        setOnRecord({
          cis: Boolean(json.cisOnRecord),
          fis: Boolean(json.fisOnRecord),
        });
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Unable to load documents.");
      });
    return () => {
      cancelled = true;
    };
  }, [transactionId]);

  async function upload(type: (typeof ITEMS)[number], file: File) {
    setBusyType(type.type);
    setError(null);
    setMessage(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("documentType", type.type);
      body.append("title", `${type.label} - ${type.name}`);
      body.append("submitForReview", "true");
      const res = await fetch(`/api/transactions/${transactionId}/documents/upload`, {
        method: "POST",
        credentials: "same-origin",
        body,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed.");
      setMessage(`${type.label} uploaded and submitted for review.`);
      await loadDocuments(transactionId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusyType(null);
      const input = inputs.current[type.type];
      if (input) input.value = "";
    }
  }

  if (transactions === null) {
    return <p className="text-sm text-[var(--stone)]">Loading…</p>;
  }

  if (transactions.length === 0) {
    return (
      <div className="space-y-3 rounded-lg border border-[var(--line)] bg-white p-5 text-sm text-[var(--stone)] sm:p-8">
        <p className="font-semibold text-[var(--navy)]">CIS, RWA and FIS</p>
        <p>
          After your ICPO or LOI has been reviewed, Finekarts will request these documents and open
          your transaction. Once it is open, you can upload each document here.
        </p>
        {error ? <p className="text-red-700">{error}</p> : null}
        <Link href="/portal/buyer/requests" className="font-semibold text-[var(--navy)] underline">
          View my requests →
        </Link>
        <p className="border-t border-[var(--line)] pt-4">
          <strong className="text-[var(--navy)]">Next step:</strong> after review of your CIS, RWA and
          FIS, Finekarts sends you the PSA to sign and stamp.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-[var(--line)] bg-white p-5 sm:p-8">
      <div className="space-y-1 text-sm text-[var(--stone)]">
        <p className="font-semibold text-[var(--navy)]">Instructions</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>The RWA is required on every LC transaction.</li>
          <li>New buyers upload the RWA and the CIS. The FIS is optional.</li>
          <li>
            Returning buyers already have the CIS and FIS on record, so only the RWA is needed.
          </li>
          <li>
            If you can provide the FIS, please upload it. If you cannot, we proceed without it. For
            a very large transaction, the bank that handles the transaction may contact you or ask
            for it.
          </li>
        </ul>
        <p>A checkmark shows the document is received or already on record.</p>
      </div>

      {transactions.length > 1 ? (
        <label className="label block">
          Transaction
          <select
            className="field mt-1 w-full"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
          >
            {transactions.map((t) => (
              <option key={t.id} value={t.id}>
                {t.transactionNumber}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <p className="text-sm text-[var(--stone)]">
          Transaction: <strong>{transactions[0].transactionNumber}</strong>
        </p>
      )}

      <ul className="divide-y divide-[var(--line)]">
        {ITEMS.map((item) => {
          const uploaded = item.has(documents);
          const standing =
            !uploaded && ((item.type === "cis" && onRecord.cis) || (item.type === "fis" && onRecord.fis));
          const done = uploaded || standing;
          const busy = busyType === item.type;
          return (
            <li key={item.type} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div className="flex min-w-0 flex-1 gap-3">
                <span
                  aria-label={done ? "Received" : "Not received"}
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                    done
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-[var(--line)] bg-white text-transparent"
                  }`}
                >
                  ✓
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-[var(--navy)]">
                    {item.label} <span className="font-normal text-[var(--stone)]">- {item.name}</span>
                  </p>
                  <p className="text-xs text-[var(--stone)]">{item.note}</p>
                  {standing ? (
                    <p className="mt-1 text-xs font-medium text-green-800">
                      Already on record from your earlier transaction. No upload needed.
                    </p>
                  ) : null}
                  <p className="mt-1 text-xs text-[var(--stone)]">{item.description}</p>
                </div>
              </div>
              <div>
                <input
                  ref={(el) => {
                    inputs.current[item.type] = el;
                  }}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void upload(item, file);
                  }}
                />
                <button
                  type="button"
                  className="btn btn-primary text-sm"
                  disabled={busy || !transactionId}
                  onClick={() => inputs.current[item.type]?.click()}
                >
                  {busy ? "Uploading…" : uploaded ? `Replace ${item.label}` : `Upload ${item.label}`}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {message ? <p className="text-sm text-[var(--forest)]">{message}</p> : null}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-4 text-sm">
        <p className="text-[var(--stone)]">
          <strong className="text-[var(--navy)]">Next step:</strong> after review of your CIS, RWA and
          FIS, Finekarts sends you the PSA to sign and stamp.
        </p>
        {onNext ? (
          <button type="button" className="btn text-sm" onClick={onNext}>
            Go to PSA
          </button>
        ) : null}
      </div>
    </div>
  );
}
