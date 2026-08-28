"use client";

import { useEffect, useState } from "react";

type PackageRow = {
  id: string;
  packageReference: string;
  status: string;
  checksum?: string;
  documentCount: number;
  instrumentId: string;
  createdAt: string;
};

type CourierRow = {
  id: string;
  courierCompany: string;
  trackingNumber?: string;
  sender: string;
  recipient: string;
  status: string;
  dispatchDate?: string;
  expectedDeliveryDate?: string;
  packageDescription?: string;
  instrumentId: string;
  createdAt: string;
};

export function BankingDocumentsPanel() {
  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [couriers, setCouriers] = useState<CourierRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/banking/documents", { credentials: "same-origin" })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Unable to load");
        setPackages(json.packages ?? []);
        setCouriers(json.couriers ?? []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div className="space-y-8">
      <p className="text-sm text-[var(--stone)]">
        Document presentation packages and physical courier records for instruments assigned to you.
        Download individual transaction documents from the instrument detail page.
      </p>

      <section>
        <h2 className="font-semibold text-[var(--navy)]">Presentation packages</h2>
        {packages.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--stone)]">No presentation packages yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-[var(--line)] rounded-lg border border-[var(--line)] bg-white">
            {packages.map((p) => (
              <li key={p.id} className="px-4 py-3 text-sm">
                <p className="font-medium text-[var(--navy)]">{p.packageReference}</p>
                <p className="text-[var(--stone)]">
                  {p.instrumentId} · {p.documentCount} docs · {p.status.replaceAll("_", " ")}
                </p>
                {p.checksum ? (
                  <p className="mt-1 font-mono text-xs text-[var(--stone)]">SHA: {p.checksum.slice(0, 16)}…</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-semibold text-[var(--navy)]">Courier shipments</h2>
        {couriers.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--stone)]">No courier records yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-[var(--line)] rounded-lg border border-[var(--line)] bg-white">
            {couriers.map((c) => (
              <li key={c.id} className="px-4 py-3 text-sm">
                <p className="font-medium text-[var(--navy)]">
                  {c.courierCompany}
                  {c.trackingNumber ? ` · ${c.trackingNumber}` : ""}
                </p>
                <p className="text-[var(--stone)]">
                  {c.instrumentId} · {c.sender} → {c.recipient}
                </p>
                <p className="text-xs text-[var(--stone)]">
                  {c.status.replaceAll("_", " ")}
                  {c.packageDescription ? ` · ${c.packageDescription}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
