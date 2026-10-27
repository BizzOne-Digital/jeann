"use client";

import { useCallback, useEffect, useState } from "react";

type Entry = {
  id: string;
  entryNumber: string;
  entryType: string;
  costCategoryCode?: string;
  description: string;
  amount: string;
  currency: string;
  entryDate: string;
  status: string;
};

async function post(body: unknown) {
  const res = await fetch("/api/finance/entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error ?? "Request failed");
}

const TYPES = [
  { value: "direct_cost", label: "Direct cost" },
  { value: "fee", label: "Banking / other fee" },
  { value: "commission", label: "Agent commission" },
  { value: "procurement_cost", label: "Procurement cost" },
];

/** Internal-only: add costs to this contract and approve / post / reverse (remove) them. */
export function TransactionEntriesManager({ transactionId }: { transactionId: string }) {
  const [items, setItems] = useState<Entry[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    entryType: "direct_cost",
    costCategoryCode: "bank_fees",
    description: "",
    originalAmount: "",
    currency: "USD",
    entryDate: new Date().toISOString().slice(0, 10),
  });

  const load = useCallback(() => {
    fetch(`/api/finance/entries?transactionId=${transactionId}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Unable to load entries");
        setItems(json.items);
      })
      .catch((e) => setMessage(e instanceof Error ? e.message : "Error"));
  }, [transactionId]);

  useEffect(() => {
    load();
  }, [load]);

  async function run(fn: () => Promise<void>, ok: string) {
    setMessage(null);
    try {
      await fn();
      setMessage(ok);
      load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error");
    }
  }

  const input = "rounded border border-[var(--line)] px-2 py-1 text-sm";
  return (
    <section className="space-y-3 rounded-lg border border-[var(--line)] bg-white p-5">
      <h3 className="font-semibold text-[var(--navy)]">Cost entries for this contract</h3>
      <p className="text-xs text-[var(--stone)]">
        Entries are per contract. Flow: add (draft), approve (a different user than the creator), post, then reverse to remove. Only posted entries count in the totals.
      </p>
      {message ? <p className="text-sm">{message}</p> : null}
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void run(() => post({ ...form, transactionId }), "Entry added as draft.");
        }}
      >
        <select className={input} value={form.entryType} onChange={(e) => setForm({ ...form, entryType: e.target.value })}>
          {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <input className={input} placeholder="Category code (e.g. bank_fees)" value={form.costCategoryCode} onChange={(e) => setForm({ ...form, costCategoryCode: e.target.value })} required />
        <input className={input} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <input className={input} placeholder="Amount" inputMode="decimal" pattern="\d+(\.\d+)?" value={form.originalAmount} onChange={(e) => setForm({ ...form, originalAmount: e.target.value })} required />
        <input className={`${input} w-20`} maxLength={3} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })} required />
        <input type="date" className={input} value={form.entryDate} onChange={(e) => setForm({ ...form, entryDate: e.target.value })} required />
        <button type="submit" className="rounded bg-[var(--navy)] px-3 py-1 text-sm text-white">Add entry</button>
      </form>
      <div className="table-scroll">
        <table className="min-w-full text-sm">
          <tbody>
            {items.map((e) => (
              <tr key={e.id} className="border-t border-[var(--line)]">
                <td className="px-2 py-2">{e.entryNumber}</td>
                <td className="px-2 py-2">{e.entryType}{e.costCategoryCode ? ` / ${e.costCategoryCode}` : ""}</td>
                <td className="px-2 py-2">{e.description}</td>
                <td className="px-2 py-2">{e.currency} {Number(e.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="px-2 py-2">{e.status}</td>
                <td className="px-2 py-2">
                  {e.status === "draft" ? <button type="button" className="underline" onClick={() => void run(() => post({ action: "approve", entryId: e.id }), "Approved.")}>Approve</button> : null}
                  {e.status === "approved" ? <button type="button" className="underline" onClick={() => void run(() => post({ action: "post", entryId: e.id }), "Posted.")}>Post</button> : null}
                  {e.status === "posted" ? <button type="button" className="text-red-700 underline" onClick={() => { const reason = window.prompt("Reason for removing this entry?"); if (reason) void run(() => post({ action: "reverse", entryId: e.id, reason }), "Entry reversed."); }}>Remove (reverse)</button> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 ? <p className="text-sm text-[var(--stone)]">No entries yet.</p> : null}
      </div>
    </section>
  );
}
