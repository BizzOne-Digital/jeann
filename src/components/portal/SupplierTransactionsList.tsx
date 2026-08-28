"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type TxItem = {
  id: string;
  transactionNumber: string;
  workflowLabel: string;
  status: string;
  createdAt: string;
};

export function SupplierTransactionsList() {
  const [items, setItems] = useState<TxItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/portal/supplier/transactions")
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Unable to load");
        setItems(json.items ?? []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <ul className="divide-y divide-[var(--line)] rounded-lg border border-[var(--line)] bg-white">
      {items.length === 0 ? (
        <li className="px-4 py-6 text-sm text-[var(--stone)]">No procurement transactions yet.</li>
      ) : (
        items.map((t) => (
          <li key={t.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <div>
              <Link
                href={`/portal/supplier/transactions/${t.id}`}
                className="font-medium text-[var(--navy)]"
              >
                {t.transactionNumber}
              </Link>
              <p className="text-[var(--stone)]">{t.workflowLabel}</p>
            </div>
            <span className="capitalize text-[var(--stone)]">{t.status}</span>
          </li>
        ))
      )}
    </ul>
  );
}
