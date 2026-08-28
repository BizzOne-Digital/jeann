"use client";

import { FormEvent, useState } from "react";

export function TransactionWorkflowActions({
  transactionId,
  allowedTransitions,
  isInternal,
  onAction,
}: {
  transactionId: string;
  allowedTransitions: string[];
  isInternal?: boolean;
  onAction?: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [skipReason, setSkipReason] = useState("");
  const [toStatus, setToStatus] = useState(allowedTransitions[0] ?? "");

  if (!isInternal) return null;

  async function transition(e: FormEvent) {
    e.preventDefault();
    if (!toStatus) return;
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/transactions/${transactionId}/transition`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ toStatus }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Transition failed");
      setMessage("Workflow updated.");
      onAction?.();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function skipStep1() {
    if (skipReason.trim().length < 16) {
      setMessage("Skip reason must be at least 16 characters.");
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const me = await fetch("/api/auth/session", { credentials: "same-origin" }).then((r) =>
        r.json(),
      );
      const res = await fetch(`/api/transactions/${transactionId}/skip-offer`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          reason: skipReason,
          approverUserId: me.userId,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Skip failed");
      setMessage("Step 1 skipped with recorded reason.");
      onAction?.();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-lg border border-[var(--line)] bg-white p-5">
      <h2 className="font-semibold text-[var(--navy)]">Staff workflow actions</h2>
      <p className="mt-1 text-xs text-[var(--stone)]">
        Advance workflow or skip Step 1 when parties agreed verbally (reason required).
      </p>

      {allowedTransitions.length > 0 ? (
        <form onSubmit={transition} className="mt-4 flex flex-wrap items-end gap-3">
          <label className="label text-xs">
            Transition to
            <select
              className="field mt-1"
              value={toStatus}
              onChange={(e) => setToStatus(e.target.value)}
            >
              {allowedTransitions.map((s) => (
                <option key={s} value={s}>
                  {s.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </label>
          <button className="btn btn-primary" type="submit" disabled={busy}>
            Apply transition
          </button>
        </form>
      ) : null}

      <div className="mt-4 border-t border-[var(--line)] pt-4">
        <label className="label text-xs">
          Skip Step 1 reason (verbal agreement)
          <textarea
            className="field mt-1 min-h-20"
            value={skipReason}
            onChange={(e) => setSkipReason(e.target.value)}
            placeholder="Describe the verbal agreement and approver reference…"
          />
        </label>
        <button
          type="button"
          className="btn mt-2"
          disabled={busy}
          onClick={skipStep1}
        >
          Skip Step 1
        </button>
      </div>

      {message ? <p className="mt-3 text-sm text-[var(--stone)]">{message}</p> : null}
    </section>
  );
}
