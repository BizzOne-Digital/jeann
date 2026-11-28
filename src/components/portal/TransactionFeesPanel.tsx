"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type Kind = "lc_fee" | "banking_fee" | "amendment_fee" | "mt101_deposit" | "supplier_payment" | "other";
type Status = "due" | "paid" | "waived";

type Fee = {
  id: string;
  kind: Kind;
  kindLabel: string;
  description: string;
  currency: string;
  amount: number;
  status: Status;
  dueDate: string | null;
  paidAt: string | null;
  reference: string;
  notes: string;
};

type Totals = { currency: string; due: number; paid: number; waived: number };

const KIND_OPTIONS: { value: Kind; label: string; supplierOnly?: boolean }[] = [
  { value: "lc_fee", label: "LC fee" },
  { value: "banking_fee", label: "Banking fee" },
  { value: "amendment_fee", label: "Amendment fee" },
  { value: "mt101_deposit", label: "MT101 deposit" },
  { value: "supplier_payment", label: "Supplier payment", supplierOnly: true },
  { value: "other", label: "Other" },
];

const money = (n: number, currency: string) => `${currency} ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/**
 * Staff only: the fees and payments of this transaction (LC fee, banking fee, amendment fee, MT101 deposit and the payment
 * to the supplier). Each line is due, paid or waived, and any line can be changed at any time.
 */
export function TransactionFeesPanel({ transactionId, isSupplierOrder }: { transactionId: string; isSupplierOrder: boolean }) {
  const base = `/api/transactions/${transactionId}/fees`;
  const [items, setItems] = useState<Fee[]>([]);
  const [totals, setTotals] = useState<Totals[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kind, setKind] = useState<Kind>(isSupplierOrder ? "supplier_payment" : "lc_fee");
  const [currency, setCurrency] = useState("USD");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [reference, setReference] = useState("");

  const load = useCallback(() => {
    fetch(base, { credentials: "same-origin" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Unable to load the fees.");
        setItems(data.items ?? []);
        setTotals(data.totals ?? []);
        setError(null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Unable to load the fees."))
      .finally(() => setLoading(false));
  }, [base]);

  useEffect(() => {
    load();
  }, [load]);

  async function call(url: string, method: string, body?: unknown) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(url, {
        method,
        credentials: "same-origin",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "That did not work.");
      load();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "That did not work.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function add(e: FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value < 0 || amount.trim() === "") {
      setError("Enter the amount as a number.");
      return;
    }
    const ok = await call(base, "POST", {
      kind,
      currency: currency.trim().toUpperCase(),
      amount: value,
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      reference: reference.trim() || undefined,
    });
    if (ok) {
      setAmount("");
      setDescription("");
      setDueDate("");
      setReference("");
    }
  }

  if (loading) return <p className="text-sm text-[var(--stone)]">Loading…</p>;

  return (
    <section className="space-y-4 rounded-lg border border-[var(--line)] bg-white p-5">
      <div>
        <h2 className="font-semibold text-[var(--navy)]">Fees and payments</h2>
        <p className="mt-1 text-xs text-[var(--stone)]">
          LC fee, banking fee, amendment fee, MT101 deposit{isSupplierOrder ? " and the payment to the supplier" : ""} for this transaction. Only
          Finekarts staff see this tab. Any line can be changed at any time.
        </p>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      {totals.length ? (
        <div className="flex flex-wrap gap-3 text-sm">
          {totals.map((t) => (
            <div key={t.currency} className="rounded border border-[var(--line)] px-3 py-2">
              <p className="text-xs text-[var(--stone)]">{t.currency}</p>
              <p>
                Due <strong>{money(t.due, t.currency)}</strong> · Paid <strong>{money(t.paid, t.currency)}</strong>
                {t.waived ? <> · Waived {money(t.waived, t.currency)}</> : null}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {items.length === 0 ? (
        <p className="text-sm text-[var(--stone)]">No fees or payments recorded yet.</p>
      ) : (
        <ul className="divide-y divide-[var(--line)] text-sm">
          {items.map((f) => (
            <li key={f.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
              <div>
                <p className="font-medium text-[var(--navy)]">
                  {f.kindLabel} · {money(f.amount, f.currency)}
                </p>
                {f.description ? <p className="mt-0.5 text-xs text-[var(--stone)]">{f.description}</p> : null}
                <p className="mt-0.5 text-xs text-[var(--stone)]">
                  {f.status === "paid" && f.paidAt ? `Paid ${new Date(f.paidAt).toLocaleDateString()}` : f.status === "waived" ? "Waived" : "Due"}
                  {f.dueDate ? ` · due ${new Date(f.dueDate).toLocaleDateString()}` : ""}
                  {f.reference ? ` · ref. ${f.reference}` : ""}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  className="field w-28 text-xs"
                  value={f.status}
                  disabled={busy}
                  onChange={(e) => call(`${base}/${f.id}`, "PATCH", { status: e.target.value })}
                >
                  <option value="due">Due</option>
                  <option value="paid">Paid</option>
                  <option value="waived">Waived</option>
                </select>
                <button type="button" className="btn text-xs" disabled={busy} onClick={() => call(`${base}/${f.id}`, "DELETE")}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={add} className="space-y-2 border-t border-[var(--line)] pt-4">
        <p className="text-sm font-medium text-[var(--navy)]">Add a fee or payment</p>
        <div className="grid gap-2 sm:grid-cols-4">
          <select className="field" value={kind} onChange={(e) => setKind(e.target.value as Kind)}>
            {KIND_OPTIONS.filter((o) => !o.supplierOnly || isSupplierOrder).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <input className="field" placeholder="Currency" maxLength={3} value={currency} onChange={(e) => setCurrency(e.target.value)} />
          <input className="field" placeholder="Amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <input className="field" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} title="Due date (optional)" />
        </div>
        <input className="field" placeholder="Details (optional)" maxLength={300} value={description} onChange={(e) => setDescription(e.target.value)} />
        <input className="field" placeholder="Bank reference, MT101 or MT103 number (optional)" maxLength={120} value={reference} onChange={(e) => setReference(e.target.value)} />
        <button className="btn btn-primary" type="submit" disabled={busy || !amount.trim()}>
          Add
        </button>
      </form>
    </section>
  );
}
