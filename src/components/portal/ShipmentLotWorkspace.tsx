"use client";

import { useEffect, useState } from "react";

type WorkspaceData = {
  lot: {
    id: string;
    shipmentLotNumber: string;
    statusLabel: string;
    currentStatus: string;
    plannedQuantity?: string;
    quantityUnit: string;
    productName?: string;
    loadingPort?: string;
    destinationPort?: string;
    packaging?: string;
    plannedLoadingDate?: string;
    estimatedArrival?: string;
  };
  freight: Array<{ id: string; carrier?: string; bookingNumber?: string; vesselName?: string; status: string }>;
  inspections: Array<{ id: string; provider: string; status: string; verificationStatus: string }>;
  requirements: Array<{ id: string; documentType: string; responsibleParty: string; uploadStatus: string; approvalStatus: string }>;
  documents: Array<{ id: string; title: string; workflowStatus: string }>;
  trackingEvents: Array<{ id: string; eventType: string; eventTimestamp: string; location?: string; description: string; confidence: string }>;
  customs: Array<{ id: string; country: string; currentStatus: string; dataSource: string }>;
  deliveries: Array<{ id: string; status: string; deliveryDate?: string; deliveredQuantity?: string; unit?: string }>;
  claims: Array<{ id: string; claimNumber: string; status: string }>;
  allocations: Array<{ id: string; allocationStatus: string; compatibilityResult?: string }>;
  presentationPackages: Array<{ id: string; packageReference: string; status: string }>;
  viewerSide: string;
};

const TABS = [
  "Overview",
  "Freight",
  "Inspection",
  "Documents",
  "Tracking",
  "Customs",
  "Delivery",
  "Claims",
  "Allocation",
  "Presentation",
] as const;

export function ShipmentLotWorkspace({ lotId }: { lotId: string }) {
  const [data, setData] = useState<WorkspaceData | null>(null);
  const [tab, setTab] = useState<string>("Overview");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/shipments/lots/${lotId}/workspace`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Unable to load workspace");
        setData(json);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"))
      .finally(() => setLoading(false));
  }, [lotId]);

  if (loading) return <p className="text-sm text-[var(--stone)]">Loading shipment workspace…</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!data) return null;

  const lot = data.lot;
  const isInternal = data.viewerSide === "internal";

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[var(--line)] bg-white p-6">
        <h2 className="text-lg font-semibold text-[var(--navy)]">{lot.shipmentLotNumber}</h2>
        <p className="mt-1 text-sm text-[var(--stone)]">{lot.statusLabel}</p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-[var(--line)] pb-2">
        {TABS.filter((t) => {
          if (t === "Allocation" || t === "Presentation") return isInternal;
          return true;
        }).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded px-3 py-1.5 text-sm ${tab === t ? "bg-[var(--navy)] text-white" : "bg-[var(--surface)] text-[var(--stone)]"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <dl className="grid gap-3 text-sm sm:grid-cols-2 rounded-lg border border-[var(--line)] bg-white p-6">
          <div><dt className="text-[var(--stone)]">Quantity</dt><dd>{[lot.plannedQuantity, lot.quantityUnit].filter(Boolean).join(" ")}</dd></div>
          <div><dt className="text-[var(--stone)]">Product</dt><dd>{lot.productName ?? "—"}</dd></div>
          <div><dt className="text-[var(--stone)]">Route</dt><dd>{[lot.loadingPort, lot.destinationPort].filter(Boolean).join(" → ") || "—"}</dd></div>
          <div><dt className="text-[var(--stone)]">Packaging</dt><dd>{lot.packaging ?? "—"}</dd></div>
        </dl>
      )}

      {tab === "Freight" && (
        <SectionList
          empty="No freight bookings."
          items={data.freight.map((f) => `${f.carrier ?? "Carrier"} — ${f.bookingNumber ?? "—"} (${f.status})`)}
        />
      )}

      {tab === "Inspection" && (
        <SectionList
          empty="No inspections."
          items={data.inspections.map((i) => `${i.provider}: ${i.status} (${i.verificationStatus})`)}
        />
      )}

      {tab === "Documents" && (
        <div className="space-y-4">
          <SectionList
            empty="No checklist requirements."
            items={data.requirements.map((r) => `${r.documentType} — ${r.responsibleParty} — ${r.uploadStatus}`)}
          />
          <SectionList
            empty="No uploaded documents."
            items={data.documents.map((d) => `${d.title}: ${d.workflowStatus}`)}
          />
          {data.viewerSide === "buyer" && (
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded p-3">
              The buyer should confirm current import, customs, port and competent-authority requirements before submitting destination-document requests. Finekarts will review the request, but the platform does not guarantee customs clearance.
            </p>
          )}
        </div>
      )}

      {tab === "Tracking" && (
        <div className="space-y-2">
          {data.trackingEvents.length === 0 ? (
            <p className="text-sm text-[var(--stone)]">No tracking events.</p>
          ) : (
            data.trackingEvents.map((e) => (
              <div key={e.id} className="rounded border border-[var(--line)] bg-white p-3 text-sm">
                <div className="font-medium">{e.eventType}</div>
                <div className="text-[var(--stone)]">{new Date(e.eventTimestamp).toLocaleString()} · {e.confidence}</div>
                <div>{e.description}</div>
                {e.location && <div className="text-[var(--stone)]">{e.location}</div>}
              </div>
            ))
          )}
        </div>
      )}

      {tab === "Customs" && (
        <SectionList
          empty="No customs records."
          items={data.customs.map((c) => `${c.country}: ${c.currentStatus} (source: ${c.dataSource})`)}
        />
      )}

      {tab === "Delivery" && (
        <SectionList
          empty="No delivery records."
          items={data.deliveries.map((d) => `${d.status} — ${d.deliveredQuantity ?? "—"} ${d.unit ?? ""} on ${d.deliveryDate ? new Date(d.deliveryDate).toLocaleDateString() : "—"}`)}
        />
      )}

      {tab === "Claims" && (
        <SectionList empty="No claims." items={data.claims.map((c) => `${c.claimNumber}: ${c.status}`)} />
      )}

      {tab === "Allocation" && isInternal && (
        <SectionList
          empty="No internal allocations."
          items={data.allocations.map((a) => `Status: ${a.allocationStatus} — compatibility: ${a.compatibilityResult ?? "—"}`)}
        />
      )}

      {tab === "Presentation" && isInternal && (
        <SectionList
          empty="No presentation packages."
          items={data.presentationPackages.map((p) => `${p.packageReference}: ${p.status}`)}
        />
      )}
    </div>
  );
}

function SectionList({ items, empty }: { items: string[]; empty: string }) {
  if (!items.length) return <p className="text-sm text-[var(--stone)]">{empty}</p>;
  return (
    <ul className="rounded-lg border border-[var(--line)] bg-white divide-y divide-[var(--line)]">
      {items.map((item, i) => (
        <li key={i} className="px-4 py-3 text-sm">{item}</li>
      ))}
    </ul>
  );
}
