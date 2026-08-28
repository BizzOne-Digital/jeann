"use client";

import { useEffect, useState } from "react";

type BillRow = {
  id: string;
  billNumber: string;
  currency: string;
  total: string;
  amountPaid: string;
  balance: string;
  status: string;
  dueDate: string;
};

export function SupplierBillsList() {
  const [items, setItems] = useState<BillRow[]>([]);
  const [disclaimer, setDisclaimer] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/portal/supplier/bills")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Unable to load bills");
        setItems(data.items ?? []);
        setDisclaimer(data.disclaimer ?? "");
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!items.length) return <p className="text-sm text-[var(--stone)]">No supplier bills posted yet.</p>;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-[var(--line)] bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-[var(--surface)] text-left text-[var(--stone)]">
            <tr>
              <th className="px-4 py-3">Bill</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Paid</th>
              <th className="px-4 py-3">Balance</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Due</th>
            </tr>
          </thead>
          <tbody>
            {items.map((b) => (
              <tr key={b.id} className="border-t border-[var(--line)]">
                <td className="px-4 py-3 font-medium">{b.billNumber}</td>
                <td className="px-4 py-3">{b.currency} {b.total}</td>
                <td className="px-4 py-3">{b.currency} {b.amountPaid}</td>
                <td className="px-4 py-3">{b.currency} {b.balance}</td>
                <td className="px-4 py-3">{b.status}</td>
                <td className="px-4 py-3">{new Date(b.dueDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {disclaimer && <p className="text-xs text-[var(--stone)]">{disclaimer}</p>}
    </div>
  );
}
