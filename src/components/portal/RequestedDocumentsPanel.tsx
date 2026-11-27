"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type Status = "requested" | "received_from_supplier" | "provided_to_buyer";

type Item = {
  id: string;
  title: string;
  notes: string;
  requestedBy: "buyer" | "staff";
  status: Status;
  createdAt: string;
};

const STATUS_LABEL: Record<Status, string> = {
  requested: "Requested",
  received_from_supplier: "Received from the supplier",
  provided_to_buyer: "Provided to the buyer",
};

/**
 * The documents and certificates requested on this transaction. The list belongs to the transaction: the
 * buyer asks for what they need, Finekarts asks the supplier for the same, and staff can change the list
 * at any time. The platform does not impose any documents.
 */
export function RequestedDocumentsPanel({
  transactionId,
  mode,
  isStaff,
}: {
  transactionId: string;
  mode: "buyer" | "supplier";
  isStaff: boolean;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const base = `/api/transactions/${transactionId}/requested-documents`;
  // The supplier only sees what Finekarts asks of them. The buyer and staff can add.
  const canAdd = isStaff || mode === "buyer";

  const load = useCallback(() => {
    fetch(base, { credentials: "same-origin" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Unable to load the list.");
        setItems(data.items ?? []);
        setError(null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Unable to load the list."))
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
    if (!title.trim()) return;
    if (await call(base, "POST", { title: title.trim(), notes: notes.trim() || undefined })) {
      setTitle("");
      setNotes("");
    }
  }

  async function saveEdit(id: string) {
    if (await call(`${base}/${id}`, "PATCH", { title: editTitle.trim(), notes: editNotes.trim() })) setEditingId(null);
  }

  if (loading) return <p className="text-sm text-[var(--stone)]">Loading…</p>;

  return (
    <section className="space-y-4 rounded-lg border border-[var(--line)] bg-white p-5">
      <div>
        <h2 className="font-semibold text-[var(--navy)]">Requested documents</h2>
        <p className="mt-1 text-xs text-[var(--stone)]">
          {mode === "supplier"
            ? "The documents and certificates Finekarts asks you to provide for this order."
            : "Any document or certificate you need for this transaction. Finekarts asks its supplier for the same, and you can see where each one stands. Upload the files themselves in the Documents tab."}
        </p>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      {items.length === 0 ? (
        <p className="text-sm text-[var(--stone)]">
          {canAdd ? "Nothing has been requested yet. Add the first document below." : "Nothing has been requested yet."}
        </p>
      ) : (
        <ul className="divide-y divide-[var(--line)] text-sm">
          {items.map((it) => (
            <li key={it.id} className="space-y-2 py-3">
              {editingId === it.id ? (
                <div className="space-y-2">
                  <input className="field" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                  <textarea className="field min-h-16" value={editNotes} onChange={(e) => setEditNotes(e.target.value)} />
                  <div className="flex gap-2">
                    <button type="button" className="btn btn-primary text-xs" disabled={busy} onClick={() => saveEdit(it.id)}>
                      Save
                    </button>
                    <button type="button" className="btn text-xs" onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-[var(--navy)]">{it.title}</p>
                    {it.notes ? <p className="mt-0.5 text-xs text-[var(--stone)]">{it.notes}</p> : null}
                    <p className="mt-0.5 text-xs text-[var(--stone)]">
                      {mode === "supplier" ? "" : it.requestedBy === "buyer" ? "Requested by the buyer · " : "Added by Finekarts · "}
                      {mode === "supplier" && it.status !== "requested" ? "Received by Finekarts" : STATUS_LABEL[it.status]}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {isStaff ? (
                      <>
                        <select
                          className="field w-56 text-xs"
                          value={it.status}
                          disabled={busy}
                          onChange={(e) => call(`${base}/${it.id}`, "PATCH", { status: e.target.value })}
                        >
                          <option value="requested">{STATUS_LABEL.requested}</option>
                          <option value="received_from_supplier">{STATUS_LABEL.received_from_supplier}</option>
                          <option value="provided_to_buyer">{STATUS_LABEL.provided_to_buyer}</option>
                        </select>
                        <button
                          type="button"
                          className="btn text-xs"
                          onClick={() => {
                            setEditingId(it.id);
                            setEditTitle(it.title);
                            setEditNotes(it.notes);
                          }}
                        >
                          Edit
                        </button>
                        <button type="button" className="btn text-xs" disabled={busy} onClick={() => call(`${base}/${it.id}`, "DELETE")}>
                          Remove
                        </button>
                      </>
                    ) : mode === "buyer" && it.requestedBy === "buyer" && it.status === "requested" ? (
                      <button type="button" className="btn text-xs" disabled={busy} onClick={() => call(`${base}/${it.id}`, "DELETE")}>
                        Withdraw
                      </button>
                    ) : null}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {canAdd ? (
        <form onSubmit={add} className="space-y-2 border-t border-[var(--line)] pt-4">
          <p className="text-sm font-medium text-[var(--navy)]">Add a document or certificate</p>
          <input
            className="field"
            placeholder="Name, in your own words (for example the certificate or label the destination port asks for)"
            value={title}
            maxLength={200}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="field min-h-16"
            placeholder="Details (optional)"
            value={notes}
            maxLength={1000}
            onChange={(e) => setNotes(e.target.value)}
          />
          <button className="btn btn-primary" type="submit" disabled={busy || !title.trim()}>
            Add
          </button>
        </form>
      ) : null}
    </section>
  );
}
