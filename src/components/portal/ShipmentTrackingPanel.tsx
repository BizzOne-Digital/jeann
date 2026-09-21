"use client";

import { useCallback, useEffect, useState } from "react";

type TrackingView = {
  provider: string;
  providers?: { terminal49: boolean; easypost: boolean };
  liveEnabled: boolean;
  capabilities: { canRefresh: boolean; canManageTracking: boolean };
  references: Array<{
    id: string;
    provider: string;
    referenceType: string;
    trackingNumber: string;
    carrier?: string;
    lastSynchronizedAt?: string;
  }>;
  snapshot: {
    reference: string;
    status: string;
    carrier?: string;
    originPort?: string;
    destinationPort?: string;
    etd?: string;
    eta?: string;
    liveTracking: boolean;
    milestones: Array<{ key: string; label: string; occurredAt?: string; locationLabel?: string }>;
  } | null;
  events: Array<{
    id: string;
    eventType: string;
    eventLabel: string;
    eventTimestamp: string;
    location?: string;
    description: string;
    confidence: string;
    source: string;
  }>;
  disclaimer: string;
};

export function ShipmentTrackingPanel({ lotId }: { lotId: string }) {
  const [data, setData] = useState<TrackingView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [form, setForm] = useState({
    integration: "terminal49" as "terminal49" | "easypost",
    referenceType: "container",
    trackingNumber: "",
    scac: "",
    carrier: "USPS",
  });

  const load = useCallback(() => {
    setLoading(true);
    return fetch(`/api/shipments/lots/${lotId}/tracking`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Unable to load tracking");
        setData(json);
        setError(null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"))
      .finally(() => setLoading(false));
  }, [lotId]);

  useEffect(() => {
    let cancelled = false;
    void fetch(`/api/shipments/lots/${lotId}/tracking`)
      .then(async (res) => {
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) throw new Error(json.error ?? "Unable to load tracking");
        setData(json);
        setError(null);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [lotId]);

  async function handleSync() {
    setSyncing(true);
    try {
      const res = await fetch(`/api/shipments/lots/${lotId}/tracking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Sync failed");
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setSyncing(true);
    try {
      const res = await fetch(`/api/shipments/lots/${lotId}/tracking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_reference",
          provider: form.integration,
          referenceType: form.integration === "easypost" ? "parcel" : form.referenceType,
          trackingNumber: form.trackingNumber.trim(),
          scac: form.integration === "terminal49" ? form.scac.trim() || undefined : undefined,
          carrier:
            form.integration === "easypost"
              ? form.carrier.trim() || undefined
              : form.scac.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not start tracking");
      setRegisterOpen(false);
      setForm({
        integration: "terminal49",
        referenceType: "container",
        trackingNumber: "",
        scac: "",
        carrier: "USPS",
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start tracking");
    } finally {
      setSyncing(false);
    }
  }

  if (loading && !data) {
    return <p className="text-sm text-[var(--stone)]">Loading shipment tracking…</p>;
  }
  if (error && !data) {
    return <p className="text-sm text-red-600">{error}</p>;
  }
  if (!data) return null;

  const snap = data.snapshot;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-[var(--navy)]">Live shipment tracking</h3>
          <p className="text-xs text-[var(--stone)]">
            {data.liveEnabled
              ? "Terminal49 (ocean) and EasyPost (parcel/courier) — same tracking view for buyer and Finekarts operations."
              : "Live carrier feed is not configured — showing recorded milestones only."}
          </p>
        </div>
        {data.capabilities.canRefresh && (
          <button
            type="button"
            onClick={handleSync}
            disabled={syncing}
            className="rounded bg-[var(--navy)] px-3 py-1.5 text-sm text-white disabled:opacity-60"
          >
            {syncing ? "Refreshing…" : "Refresh from carrier"}
          </button>
        )}
      </div>

      {data.capabilities.canManageTracking && (
        <div className="rounded border border-[var(--line)] bg-[var(--sand)]/30 p-3">
          {!registerOpen ? (
            <button
              type="button"
              className="text-sm font-medium text-[var(--navy)] underline"
              onClick={() => setRegisterOpen(true)}
            >
              Register tracking (Terminal49 or EasyPost)
            </button>
          ) : (
            <form onSubmit={handleRegister} className="grid gap-2 sm:grid-cols-2">
              <label className="text-sm sm:col-span-2">
                <span className="text-[var(--stone)]">Integration</span>
                <select
                  className="mt-1 w-full rounded border border-[var(--line)] px-2 py-1.5"
                  value={form.integration}
                  onChange={(ev) =>
                    setForm((f) => ({
                      ...f,
                      integration: ev.target.value as "terminal49" | "easypost",
                    }))
                  }
                >
                  <option value="terminal49">Terminal49 — ocean container / BOL</option>
                  <option value="easypost">EasyPost — parcel / courier</option>
                </select>
              </label>
              {form.integration === "terminal49" && (
                <label className="text-sm sm:col-span-2">
                  <span className="text-[var(--stone)]">Reference type</span>
                  <select
                    className="mt-1 w-full rounded border border-[var(--line)] px-2 py-1.5"
                    value={form.referenceType}
                    onChange={(ev) => setForm((f) => ({ ...f, referenceType: ev.target.value }))}
                  >
                    <option value="container">Container number</option>
                    <option value="booking_number">Booking number</option>
                    <option value="bill_of_lading">Bill of lading</option>
                  </select>
                </label>
              )}
              <label className="text-sm">
                <span className="text-[var(--stone)]">Tracking number</span>
                <input
                  required
                  className="mt-1 w-full rounded border border-[var(--line)] px-2 py-1.5"
                  value={form.trackingNumber}
                  onChange={(ev) => setForm((f) => ({ ...f, trackingNumber: ev.target.value }))}
                />
              </label>
              {form.integration === "terminal49" ? (
                <label className="text-sm">
                  <span className="text-[var(--stone)]">Carrier SCAC (optional)</span>
                  <input
                    className="mt-1 w-full rounded border border-[var(--line)] px-2 py-1.5"
                    value={form.scac}
                    onChange={(ev) => setForm((f) => ({ ...f, scac: ev.target.value }))}
                    placeholder="Auto-detect if empty"
                  />
                </label>
              ) : (
                <label className="text-sm">
                  <span className="text-[var(--stone)]">Carrier (required)</span>
                  <input
                    required
                    className="mt-1 w-full rounded border border-[var(--line)] px-2 py-1.5"
                    value={form.carrier}
                    onChange={(ev) => setForm((f) => ({ ...f, carrier: ev.target.value }))}
                    placeholder="USPS, UPS, FedEx, DHL…"
                  />
                </label>
              )}
              <div className="flex gap-2 sm:col-span-2">
                <button type="submit" disabled={syncing} className="rounded bg-[var(--navy)] px-3 py-1.5 text-sm text-white">
                  Start tracking
                </button>
                <button type="button" className="text-sm text-[var(--stone)]" onClick={() => setRegisterOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {snap && snap.liveTracking && (
        <div className="rounded-lg border border-[var(--line)] bg-white p-4 text-sm">
          <div className="flex flex-wrap justify-between gap-2">
            <div>
              <span className="font-semibold text-[var(--navy)]">{snap.reference}</span>
              {snap.carrier && <span className="text-[var(--stone)]"> · {snap.carrier}</span>}
            </div>
            <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800">Live</span>
          </div>
          <dl className="mt-3 grid gap-2 sm:grid-cols-2">
            <div>
              <dt className="text-[var(--stone)]">Route</dt>
              <dd>{[snap.originPort, snap.destinationPort].filter(Boolean).join(" → ") || "—"}</dd>
            </div>
            <div>
              <dt className="text-[var(--stone)]">Status</dt>
              <dd className="capitalize">{snap.status.replace(/_/g, " ")}</dd>
            </div>
            <div>
              <dt className="text-[var(--stone)]">ETD</dt>
              <dd>{snap.etd ? new Date(snap.etd).toLocaleString() : "—"}</dd>
            </div>
            <div>
              <dt className="text-[var(--stone)]">ETA</dt>
              <dd>{snap.eta ? new Date(snap.eta).toLocaleString() : "—"}</dd>
            </div>
          </dl>
          {snap.milestones.length > 0 && (
            <ul className="mt-3 space-y-1 border-t border-[var(--line)] pt-3">
              {snap.milestones.map((m) => (
                <li key={m.key} className="flex justify-between gap-2">
                  <span>{m.label}</span>
                  <span className="text-[var(--stone)]">
                    {m.occurredAt ? new Date(m.occurredAt).toLocaleString() : "—"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {data.references.length > 0 && (
        <div className="text-sm">
          <h4 className="font-medium text-[var(--navy)] mb-1">Tracking references</h4>
          <ul className="rounded border border-[var(--line)] bg-white divide-y">
            {data.references.map((r) => (
              <li key={r.id} className="px-3 py-2 flex flex-wrap justify-between gap-2">
                <span>
                  {r.trackingNumber}{" "}
                  <span className="text-[var(--stone)]">({r.referenceType.replace(/_/g, " ")})</span>
                </span>
                <span className="text-xs text-[var(--stone)]">
                  {r.provider}
                  {r.lastSynchronizedAt
                    ? ` · synced ${new Date(r.lastSynchronizedAt).toLocaleString()}`
                    : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium text-[var(--navy)] mb-2">Event timeline</h4>
        {data.events.length === 0 ? (
          <p className="text-sm text-[var(--stone)]">No tracking events yet. Events appear when the carrier reports milestones or webhooks are received.</p>
        ) : (
          <ul className="space-y-2">
            {data.events.map((e) => (
              <li key={e.id} className="rounded border border-[var(--line)] bg-white p-3 text-sm">
                <div className="font-medium">{e.eventLabel}</div>
                <div className="text-[var(--stone)]">
                  {new Date(e.eventTimestamp).toLocaleString()} · {e.confidence}
                  {e.source === "terminal49"
                    ? " · Terminal49"
                    : e.source === "easypost"
                      ? " · EasyPost"
                      : ""}
                </div>
                <div>{e.description}</div>
                {e.location && <div className="text-[var(--stone)]">{e.location}</div>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-xs text-[var(--stone)]">{data.disclaimer}</p>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
