"use client";

import { FormEvent, useState } from "react";

/** Staff only: allow a transaction to proceed without an FIS. */
export function StaffFisWaiver({
  transactionId,
  waived,
  onChanged,
}: {
  transactionId: string;
  waived: boolean;
  onChanged?: () => void;
}) {
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: FormEvent, next: boolean) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/workspace/transactions/${transactionId}/fis-waiver`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ waived: next, reason: reason.trim() || undefined }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Request failed.");
      setMessage(next ? "FIS waived for this transaction." : "FIS requirement restored.");
      setReason("");
      onChanged?.();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Request failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-lg border border-[var(--line)] bg-white p-5">
      <h2 className="font-semibold text-[var(--navy)]">FIS requirement (staff)</h2>
      <p className="mt-1 text-xs text-[var(--stone)]">
        In some cases the transaction can proceed without an FIS because our bank obtains the
        buyer&apos;s banking information. Status: <strong>{waived ? "FIS waived" : "FIS required"}</strong>.
      </p>
      <form onSubmit={(e) => submit(e, !waived)} className="mt-3 space-y-2">
        {!waived ? (
          <input
            className="field"
            placeholder="Reason for waiving the FIS"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        ) : null}
        <button className="btn" type="submit" disabled={busy}>
          {waived ? "Restore FIS requirement" : "Waive FIS for this transaction"}
        </button>
      </form>
      {message ? <p className="mt-2 text-sm text-[var(--stone)]">{message}</p> : null}
    </section>
  );
}
