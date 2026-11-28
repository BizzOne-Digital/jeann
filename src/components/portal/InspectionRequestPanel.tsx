"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type Status = "requested" | "granted" | "declined" | "report_received";

type Item = {
  id: string;
  inspectionCompany: string;
  scope: string;
  loadingPort: string;
  requestedBy: "buyer" | "staff";
  status: Status;
  statusLabel: string;
  decisionNote: string;
  reportReceivedAt: string | null;
};

/**
 * The buyer's inspection request at the loading port. The buyer asks here (stage 1). When Finekarts grants it, the supplier
 * order (stage 2) asks the supplier for the inspection report, and the buyer is told when the report has been received.
 */
export function InspectionRequestPanel({ transactionId, isStaff }: { transactionId: string; isStaff: boolean }) {
  const base = `/api/transactions/${transactionId}/inspection-requests`;
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState("");
  const [port, setPort] = useState("");
  const [scope, setScope] = useState("");
  const [note, setNote] = useState("");

  const load = useCallback(() => {
    fetch(base, { credentials: "same-origin" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Unable to load the requests.");
        setItems(data.items ?? []);
        setError(null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Unable to load the requests."))
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
    const ok = await call(base, "POST", {
      inspectionCompany: company.trim() || undefined,
      loadingPort: port.trim() || undefined,
      scope: scope.trim() || undefined,
    });
    if (ok) {
      setCompany("");
      setPort("");
      setScope("");
    }
  }

  if (loading) return <p className="text-sm text-[var(--stone)]">Loading…</p>;

  return (
    <section className="space-y-4 rounded-lg border border-[var(--line)] bg-white p-5">
      <div>
        <h2 className="font-semibold text-[var(--navy)]">Inspection at the loading port</h2>
        <p className="mt-1 text-xs text-[var(--stone)]">
          Ask for the goods to be inspected at the loading port. Finekarts reviews the request and, once it is granted, collects the
          inspection report from the supplier and gives it to you.
        </p>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      {items.length === 0 ? (
        <p className="text-sm text-[var(--stone)]">No inspection has been requested on this transaction.</p>
      ) : (
        <ul className="divide-y divide-[var(--line)] text-sm">
          {items.map((it) => (
            <li key={it.id} className="space-y-2 py-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-[var(--navy)]">
                    {it.statusLabel}
                    {it.inspectionCompany ? ` · ${it.inspectionCompany}` : ""}
                    {it.loadingPort ? ` · ${it.loadingPort}` : ""}
                  </p>
                  {it.scope ? <p className="mt-0.5 text-xs text-[var(--stone)]">{it.scope}</p> : null}
                  {it.decisionNote ? <p className="mt-0.5 text-xs text-[var(--stone)]">Note from Finekarts: {it.decisionNote}</p> : null}
                  {it.reportReceivedAt ? (
                    <p className="mt-0.5 text-xs text-[var(--stone)]">Report received {new Date(it.reportReceivedAt).toLocaleDateString()}. Find it in the Documents tab.</p>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {isStaff ? (
                    <>
                      {it.status === "requested" ? (
                        <>
                          <button type="button" className="btn btn-primary text-xs" disabled={busy} onClick={() => call(`${base}/${it.id}`, "PATCH", { status: "granted", note: note.trim() || undefined })}>
                            Grant
                          </button>
                          <button type="button" className="btn text-xs" disabled={busy} onClick={() => call(`${base}/${it.id}`, "PATCH", { status: "declined", note: note.trim() || undefined })}>
                            Decline
                          </button>
                        </>
                      ) : null}
                      {it.status === "granted" ? (
                        <button type="button" className="btn btn-primary text-xs" disabled={busy} onClick={() => call(`${base}/${it.id}`, "PATCH", { status: "report_received" })}>
                          Report received
                        </button>
                      ) : null}
                      <button type="button" className="btn text-xs" disabled={busy} onClick={() => call(`${base}/${it.id}`, "DELETE")}>
                        Remove
                      </button>
                    </>
                  ) : it.requestedBy === "buyer" && it.status === "requested" ? (
                    <button type="button" className="btn text-xs" disabled={busy} onClick={() => call(`${base}/${it.id}`, "DELETE")}>
                      Withdraw
                    </button>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isStaff && items.some((i) => i.status === "requested") ? (
        <input className="field" placeholder="Note to the buyer with the decision (optional)" maxLength={1000} value={note} onChange={(e) => setNote(e.target.value)} />
      ) : null}

      <form onSubmit={add} className="space-y-2 border-t border-[var(--line)] pt-4">
        <p className="text-sm font-medium text-[var(--navy)]">Request an inspection</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <input className="field" placeholder="Inspection company (optional)" maxLength={200} value={company} onChange={(e) => setCompany(e.target.value)} />
          <input className="field" placeholder="Loading port (optional)" maxLength={200} value={port} onChange={(e) => setPort(e.target.value)} />
        </div>
        <textarea className="field min-h-16" placeholder="What should be checked (optional)" maxLength={1000} value={scope} onChange={(e) => setScope(e.target.value)} />
        <button className="btn btn-primary" type="submit" disabled={busy}>
          Request inspection
        </button>
      </form>
    </section>
  );
}
