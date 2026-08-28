"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ShipmentRow = {
  id: string;
  shipmentLotNumber: string;
  transactionId: string;
  plannedQuantity?: string;
  quantityUnit: string;
  loadingPort?: string;
  destinationPort?: string;
  currentStatus: string;
  statusLabel: string;
  plannedLoadingDate?: string;
  estimatedArrival?: string;
};

export function ShipmentLotsList({
  detailBasePath,
}: {
  detailBasePath: string;
}) {
  const [items, setItems] = useState<ShipmentRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/shipments/lots")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Unable to load shipments");
        setItems(data.items ?? []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-[var(--stone)]">Loading shipments…</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  if (!items.length) {
    return (
      <p className="text-sm text-[var(--stone)]">
        No shipment lots assigned yet. Lots appear after delivery schedules are approved.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--line)] bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-[var(--surface)] text-left text-[var(--stone)]">
          <tr>
            <th className="px-4 py-3">Shipment</th>
            <th className="px-4 py-3">Quantity</th>
            <th className="px-4 py-3">Route</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">ETA</th>
          </tr>
        </thead>
        <tbody>
          {items.map((lot) => (
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
                {lot.estimatedArrival
                  ? new Date(lot.estimatedArrival).toLocaleDateString()
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
