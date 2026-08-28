"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SupplierOfferForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const res = await fetch("/api/portal/supplier/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to create offer");
      router.push(`/portal/supplier/offers/${json.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4 rounded-lg border border-[var(--line)] bg-white p-6">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <label className="block text-sm">
        Product name
        <input name="productName" required className="mt-1 w-full rounded border px-3 py-2" />
      </label>
      <label className="block text-sm">
        Origin
        <input name="origin" className="mt-1 w-full rounded border px-3 py-2" />
      </label>
      <label className="block text-sm">
        Available quantity
        <input name="availableQuantity" className="mt-1 w-full rounded border px-3 py-2" />
      </label>
      <label className="block text-sm">
        Unit
        <input name="unit" placeholder="MT" className="mt-1 w-full rounded border px-3 py-2" />
      </label>
      <label className="block text-sm">
        Price indication
        <input name="price" className="mt-1 w-full rounded border px-3 py-2" />
      </label>
      <label className="block text-sm">
        Currency
        <input name="currency" placeholder="USD" className="mt-1 w-full rounded border px-3 py-2" />
      </label>
      <label className="block text-sm">
        Loading port
        <input name="loadingPort" className="mt-1 w-full rounded border px-3 py-2" />
      </label>
      <label className="block text-sm">
        Incoterm
        <input name="incoterm" placeholder="FOB" className="mt-1 w-full rounded border px-3 py-2" />
      </label>
      <label className="block text-sm">
        Packaging
        <input name="packaging" className="mt-1 w-full rounded border px-3 py-2" />
      </label>
      <button type="submit" disabled={loading} className="btn btn-primary">
        {loading ? "Saving…" : "Save draft"}
      </button>
    </form>
  );
}
