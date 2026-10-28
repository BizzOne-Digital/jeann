"use client";

import { FormEvent, useState } from "react";

const INSTRUMENT_TYPES = [
  { value: "irrevocable_documentary_lc", label: "Irrevocable documentary LC (at sight)" },
  { value: "standby_lc", label: "Standby LC" },
  { value: "bank_guarantee", label: "Bank guarantee" },
  { value: "documentary_collection", label: "Documentary collection" },
];

/** Step 6: the buyer records the instrument details arranged with its own bank. Records metadata only. */
export function BuyerLcDetailsForm({
  transactionId,
  onSaved,
}: {
  transactionId: string;
  onSaved?: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const text = (k: string) => String(f.get(k) ?? "").trim() || undefined;
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/transactions/${transactionId}/banking`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "record_lc_details",
          instrumentType: text("instrumentType"),
          lcNumber: text("lcNumber"),
          issuingBank: text("issuingBank"),
          advisingBank: text("advisingBank"),
          amount: text("amount"),
          currency: text("currency"),
          expiryDate: text("expiryDate"),
          notes: text("notes"),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to save.");
      setMessage("Details saved.");
      onSaved?.();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Unable to save.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mb-6 space-y-3 rounded-lg border border-[var(--line)] bg-white p-5">
      <h2 className="font-semibold text-[var(--navy)]">Step 6 - your banking instrument</h2>
      <p className="text-xs text-[var(--stone)]">
        Enter the details of the instrument you arranged with your bank. This portal records the
        details only. It does not issue a letter of credit and does not replace your bank.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <select name="instrumentType" className="field" required defaultValue="irrevocable_documentary_lc">
          {INSTRUMENT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <input name="lcNumber" className="field" placeholder="LC / instrument number" maxLength={80} />
        <input name="issuingBank" className="field" placeholder="Issuing bank" maxLength={200} />
        <input name="advisingBank" className="field" placeholder="Advising bank" maxLength={200} />
        <input name="amount" className="field" placeholder="Amount (e.g. 250000.00)" inputMode="decimal" />
        <input name="currency" className="field" placeholder="Currency (USD)" maxLength={3} />
        <input name="expiryDate" className="field" type="date" />
      </div>
      <textarea name="notes" className="field min-h-20" placeholder="Notes" maxLength={2000} />
      <button className="btn btn-primary" type="submit" disabled={busy}>
        {busy ? "Saving..." : "Save instrument details"}
      </button>
      {message ? <p className="text-sm text-[var(--stone)]">{message}</p> : null}
    </form>
  );
}
