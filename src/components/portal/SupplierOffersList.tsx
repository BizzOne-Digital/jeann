"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type OfferItem = {
  id: string;
  offerId: string;
  productName: string;
  status: string;
  createdAt: string;
};

export function SupplierOffersList() {
  const [items, setItems] = useState<OfferItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/portal/supplier/offers")
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Unable to load offers");
        setItems(json.items ?? []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href="/portal/supplier/offers/new" className="btn btn-primary">
          New trade offer
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-[var(--stone)]">No trade offers yet.</p>
      ) : (
        <ul className="divide-y divide-[var(--line)] rounded-lg border border-[var(--line)] bg-white">
          {items.map((o) => (
            <li key={o.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <div>
                <Link href={`/portal/supplier/offers/${o.id}`} className="font-medium text-[var(--navy)]">
                  {o.offerId}
                </Link>
                <p className="text-[var(--stone)]">{o.productName}</p>
              </div>
              <span className="capitalize text-[var(--stone)]">{o.status.replace(/_/g, " ")}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
