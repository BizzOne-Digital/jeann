"use client";

import { useState } from "react";

/** Approve or decline a buyer from the email link. The decision is only made when a button is pressed. */
export function BuyerDecisionActions({ token }: { token: string }) {
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function decide(decision: "approved" | "rejected") {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/buyer-decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, decision, reason: reason.trim() || undefined }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Unable to record the decision.");
        return;
      }
      setDone(
        decision === "approved"
          ? "Buyer approved. They have been emailed and can now use the full portal."
          : "Buyer declined. They have been emailed.",
      );
    } catch {
      setError("Unable to record the decision.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{done}</p>;
  }

  return (
    <div className="space-y-3">
      <label className="label block">
        Note to the buyer (optional, included in the email if you decline)
        <textarea className="field mt-1 min-h-16" value={reason} onChange={(e) => setReason(e.target.value)} />
      </label>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn btn-primary" disabled={busy} onClick={() => decide("approved")}>
          Approve buyer
        </button>
        <button type="button" className="btn border border-red-300 text-red-700" disabled={busy} onClick={() => decide("rejected")}>
          Decline buyer
        </button>
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
