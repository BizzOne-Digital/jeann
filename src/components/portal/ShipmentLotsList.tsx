"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ShipmentRow = {
  id: string;
  shipmentLotNumber: string;
  transactionId: string;
  transactionNumber?: string;
  transactionStatus?: string;
  companyName?: string;
  plannedQuantity?: string;
  quantityUnit: string;
  loadingPort?: string;
  destinationPort?: string;
  currentStatus: string;
  statusLabel: string;
  plannedLoadingDate?: string;
  estimatedArrival?: string;
  trackingNumbers?: string[];
  latestTracking?: { eventType: string; eventTimestamp: string; location?: string; confidence: string };
};

export function ShipmentLotsList({
  detailBasePath,
  activeOnlyDefault = false,
  transactionId,
}: {
  detailBasePath: string;
  /** Start with only the shipments of active transactions (staff view). */
  activeOnlyDefault?: boolean;
  /** Show only the shipments of this one transaction (used inside the transaction's own tab). */
  transactionId?: string;
}) {
  const [items, setItems] = useState<ShipmentRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeOnly, setActiveOnly] = useState(activeOnlyDefault && !transactionId);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeOnly) params.set("active", "1");
    if (transactionId) params.set("transactionId", transactionId);
    const query = params.toString();
    fetch("/api/shipments/lots" + (query ? "?" + query : ""))
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Unable to load shipments");
        setItems(data.items ?? []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"))
      .finally(() => setLoading(false));
  }, [activeOnly, transactionId]);

  if (loading) return <p className="text-sm text-[var(--stone)]">Loading shipments…</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  const filterBox = transactionId ? null : (
    <label className="mb-3 flex items-center gap-2 text-sm text-[var(--stone)]">
      <input type="checkbox" checked={activeOnly} onChange={(e) => setActiveOnly(e.target.checked)} />
      Active transactions only
    </label>
  );

  if (!items.length) {
    return (
      <div>
        {filterBox}
        <p className="text-sm text-[var(--stone)]">
          {activeOnly
            ? "No shipment lots on active transactions."
            : "No shipment lots assigned yet. Lots appear after delivery schedules are approved."}
        </p>
      </div>
    );
  }

  // One group per transaction, so the shipments of different trades are never mixed.
  const groups = new Map<string, ShipmentRow[]>();
  for (const lot of items) groups.set(lot.transactionId, [...(groups.get(lot.transactionId) ?? []), lot]);
  const showTracking = items.some((l) => l.trackingNumbers || l.latestTracking);

  return (
    <div>
      {filterBox}
      <div className="space-y-6">
        {[...groups.entries()].map(([transactionId, lots]) => (
          <section key={transactionId}>
            <h3 className="mb-2 text-sm font-semibold text-[var(--navy)]">
              {lots[0].transactionNumber ?? "Transaction"}
              {lots[0].companyName ? ` · ${lots[0].companyName}` : ""}
              {lots[0].transactionStatus ? (
                <span className="ml-2 text-xs font-normal capitalize text-[var(--stone)]">
                  {lots[0].transactionStatus.replace(/_/g, " ")}
                </span>
              ) : null}
            </h3>
            <div className="overflow-x-auto rounded-lg border border-[var(--line)] bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-[var(--surface)] text-left text-[var(--stone)]">
                  <tr>
                    <th className="px-4 py-3">Shipment</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">Route</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">ETA</th>
                    {showTracking && <th className="px-4 py-3">Tracking</th>}
                  </tr>
                </thead>
                <tbody>
                  {lots.map((lot) => (
                    <tr key={lot.id} className="border-t border-[var(--line)]">
                      <td className="px-4 py-3">
                        <Link
                          href={`${detailBasePath}/${lot.id}`}
                          className="font-medium text-[var(--navy)] hover:underline"
                        >
                          {lot.shipmentLotNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        {[lot.plannedQuantity, lot.quantityUnit].filter(Boolean).join(" ")}
                      </td>
                      <td className="px-4 py-3">
                        {[lot.loadingPort, lot.destinationPort].filter(Boolean).join(" → ") || "—"}
                      </td>
                      <td className="px-4 py-3">{lot.statusLabel}</td>
                      <td className="px-4 py-3">
                        {lot.estimatedArrival ? new Date(lot.estimatedArrival).toLocaleDateString() : "—"}
                      </td>
                      {showTracking && (
                        <td className="px-4 py-3">
                          {lot.trackingNumbers?.join(", ") ?? "No tracking no."}
                          {lot.latestTracking ? (
                            <span className="block text-xs text-[var(--stone)]">
                              {lot.latestTracking.eventType.replace(/_/g, " ")}
                              {lot.latestTracking.location ? ` @ ${lot.latestTracking.location}` : ""} ·{" "}
                              {lot.latestTracking.confidence === "confirmed" ? "Confirmed" : "Estimated"} ·{" "}
                              {new Date(lot.latestTracking.eventTimestamp).toLocaleDateString()}
                            </span>
                          ) : null}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
