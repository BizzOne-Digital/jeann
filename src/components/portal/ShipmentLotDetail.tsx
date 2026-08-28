"use client";

import { useEffect, useState } from "react";

type WorkspaceSlice = {
  lot: {
    shipmentLotNumber: string;
    statusLabel: string;
    plannedQuantity?: string;
    quantityUnit: string;
    productName?: string;
    loadingPort?: string;
    destinationPort?: string;
    packaging?: string;
  };
  trackingEvents: Array<{
    id: string;
    eventType: string;
    eventTimestamp: string;
    description: string;
    confidence: string;
  }>;
  requirements: Array<{
    documentType: string;
    responsibleParty: string;
    uploadStatus: string;
  }>;
  customs: Array<{ country: string; currentStatus: string }>;
  deliveries: Array<{ status: string; deliveryDate?: string }>;
  claims: Array<{ claimNumber: string; status: string }>;
};

export function ShipmentLotDetail({ lotId }: { lotId: string }) {
  const [data, setData] = useState<WorkspaceSlice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/shipments/lots/${lotId}/workspace`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Unable to load shipment");
        setData(json);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"))
      .finally(() => setLoading(false));
  }, [lotId]);

  if (loading) return <p className="text-sm text-[var(--stone)]">Loading shipment…</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!data) return null;

  const lot = data.lot;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[var(--line)] bg-white p-6">
        <h2 className="text-lg font-semibold text-[var(--navy)]">{lot.shipmentLotNumber}</h2>
        <p className="mt-1 text-sm text-[var(--stone)]">{lot.statusLabel}</p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-[var(--stone)]">Quantity</dt><dd>{[lot.plannedQuantity, lot.quantityUnit].filter(Boolean).join(" ")}</dd></div>
          <div><dt className="text-[var(--stone)]">Product</dt><dd>{lot.productName ?? "—"}</dd></div>
          <div><dt className="text-[var(--stone)]">Route</dt><dd>{[lot.loadingPort, lot.destinationPort].filter(Boolean).join(" → ") || "—"}</dd></div>
          <div><dt className="text-[var(--stone)]">Packaging</dt><dd>{lot.packaging ?? "—"}</dd></div>
        </dl>
      </div>

      <section>
        <h3 className="text-sm font-semibold text-[var(--navy)] mb-2">Tracking timeline</h3>
        {data.trackingEvents.length === 0 ? (
          <p className="text-sm text-[var(--stone)]">No approved tracking events yet.</p>
        ) : (
          <ul className="space-y-2">
            {data.trackingEvents.map((e) => (
              <li key={e.id} className="rounded border border-[var(--line)] bg-white p-3 text-sm">
                <span className="font-medium">{e.eventType}</span>
                <span className="text-[var(--stone)]"> · {new Date(e.eventTimestamp).toLocaleString()} · {e.confidence}</span>
                <div>{e.description}</div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="text-sm font-semibold text-[var(--navy)] mb-2">Required documents</h3>
        {data.requirements.length === 0 ? (
          <p className="text-sm text-[var(--stone)]">No document requirements listed.</p>
        ) : (
          <ul className="rounded border border-[var(--line)] bg-white divide-y text-sm">
            {data.requirements.map((r, i) => (
              <li key={i} className="px-4 py-2">{r.documentType} ({r.responsibleParty}) — {r.uploadStatus}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="text-sm font-semibold text-[var(--navy)] mb-2">Customs / delivery</h3>
        <p className="text-sm text-[var(--stone)]">
          Customs: {data.customs.map((c) => `${c.country} ${c.currentStatus}`).join(", ") || "—"}
        </p>
        <p className="text-sm text-[var(--stone)] mt-1">
          Delivery: {data.deliveries.map((d) => d.status).join(", ") || "—"}
        </p>
      </section>

      {data.claims.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-[var(--navy)] mb-2">Claims</h3>
          <ul className="text-sm space-y-1">
            {data.claims.map((c) => (
              <li key={c.claimNumber}>{c.claimNumber}: {c.status}</li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-xs text-[var(--stone)]">
        Supplier identity, procurement details, and internal allocations are not shown in this portal view.
      </p>
    </div>
  );
}
