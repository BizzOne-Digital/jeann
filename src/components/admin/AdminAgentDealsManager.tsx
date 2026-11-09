"use client";

import { useCallback, useEffect, useState } from "react";

type Deal = {
  id: string;
  reference: string;
  agent: string;
  buyerCompanyName: string;
  supplierCompanyName: string;
  buyerContactName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerCountry: string;
  productName: string;
  quantity: string;
  notes: string;
  documentType: string;
  filename: string;
  status: string;
  staffNotes: string;
  createdAt: string;
};

const STATUSES = [
  { value: "submitted", label: "Submitted" },
  { value: "under_review", label: "Under review" },
  { value: "more_information_required", label: "More information needed" },
  { value: "accepted", label: "Accepted" },
  { value: "declined", label: "Declined" },
];

export function AdminAgentDealsManager({ channel = "agent" }: { channel?: "agent" | "broker" }) {
  const [items, setItems] = useState<Deal[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/agent-deals?channel=${channel}`, { credentials: "same-origin" });
    const data = (await res.json().catch(() => ({}))) as { items?: Deal[]; error?: string };
    if (!res.ok) {
      setError(data.error ?? "Unable to load submissions.");
      return;
    }
    setError(null);
    setItems(data.items ?? []);
  }, [channel]);

  useEffect(() => {
    const t = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(t);
  }, [load]);

  async function update(d: Deal, status: string, staffNotes: string) {
    setBusyId(d.id);
    setError(null);
    const res = await fetch(`/api/admin/agent-deals/${d.id}`, {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, staffNotes }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setBusyId(null);
    if (!res.ok) setError(data.error ?? "Unable to save.");
    else await load();
  }

  if (error && !items) return <p className="text-sm text-red-700">{error}</p>;
  if (!items) return <p className="text-sm text-[var(--stone)]">Loading…</p>;
  if (items.length === 0) return <p className="text-sm text-[var(--stone)]">No {channel} submissions yet.</p>;

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {items.map((d) => (
        <DealCard key={d.id} d={d} channel={channel} busy={busyId === d.id} onSave={update} />
      ))}
    </div>
  );
}

function DealCard({ d, channel, busy, onSave }: { d: Deal; channel: "agent" | "broker"; busy: boolean; onSave: (d: Deal, status: string, notes: string) => void }) {
  const [status, setStatus] = useState(d.status);
  const [notes, setNotes] = useState(d.staffNotes);
  return (
    <div className="rounded-lg border border-[var(--line)] bg-white p-4 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-semibold text-[var(--navy)]">
          {d.reference} · {d.documentType.toUpperCase()} · {d.buyerCompanyName}
        </p>
        <a className="font-semibold text-[var(--navy)] underline" href={`/api/admin/agent-deals/${d.id}/file`}>
          Download {d.filename}
        </a>
      </div>
      <p className="mt-1 text-[var(--stone)]">
        {channel === "broker" ? "Broker" : "Agent"}: {d.agent} · Product: {d.productName}
        {d.supplierCompanyName ? ` · Supplier: ${d.supplierCompanyName}` : ""}
        {d.quantity ? ` · Quantity: ${d.quantity}` : ""}
        {d.buyerCountry ? ` · ${d.buyerCountry}` : ""}
      </p>
      <p className="text-[var(--stone)]">
        Buyer contact: {[d.buyerContactName, d.buyerEmail, d.buyerPhone].filter(Boolean).join(" · ") || "not provided"}
      </p>
      {d.notes ? <p className="mt-1">Agent notes: {d.notes}</p> : null}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <select className="field w-56" value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <input className="field min-w-64 flex-1" placeholder="Internal notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <button type="button" className="btn btn-primary" disabled={busy} onClick={() => onSave(d, status, notes)}>
          {busy ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
