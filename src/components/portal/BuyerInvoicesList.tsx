"use client";

import { useEffect, useState } from "react";

type InvoiceRow = {
  id: string;
  invoiceNumber: string;
  currency: string;
  total: string;
  amountPaid: string;
  balance: string;
  status: string;
  invoiceDate: string;
  dueDate: string;
};

export function BuyerInvoicesList() {
  const [items, setItems] = useState<InvoiceRow[]>([]);
  const [disclaimer, setDisclaimer] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/portal/buyer/invoices")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Unable to load invoices");
        setItems(data.items ?? []);
        setDisclaimer(data.disclaimer ?? "");
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!items.length) return <p className="text-sm text-[var(--stone)]">No invoices issued yet.</p>;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-[var(--line)] bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-[var(--surface)] text-left text-[var(--stone)]">
            <tr>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Paid</th>
              <th className="px-4 py-3">Balance</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Due</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-t border-[var(--line)]">
                <td className="px-4 py-3 font-medium">{i.invoiceNumber}</td>
                <td className="px-4 py-3">{i.currency} {i.total}</td>
                <td className="px-4 py-3">{i.currency} {i.amountPaid}</td>
                <td className="px-4 py-3">{i.currency} {i.balance}</td>
                <td className="px-4 py-3">{i.status}</td>
                <td className="px-4 py-3">{new Date(i.dueDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {disclaimer && <p className="text-xs text-[var(--stone)]">{disclaimer}</p>}
    </div>
  );
}
