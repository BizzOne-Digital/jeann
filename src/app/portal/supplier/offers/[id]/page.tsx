"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function SupplierOfferDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const [offer, setOffer] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/portal/supplier/offers/${id}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Unable to load");
        setOffer(json);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, [id]);

  async function submitOffer() {
    const res = await fetch(`/api/portal/supplier/offers/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "submit" }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? "Submit failed");
      return;
    }
    setOffer((o) => (o ? { ...o, status: json.status } : o));
  }

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!offer) return <p className="text-sm text-[var(--stone)]">Loading…</p>;

  const canSubmit = offer.status === "draft" || offer.status === "more_information_required";

  return (
    <div className="space-y-4">
      <Link href="/portal/supplier/offers" className="text-sm text-[var(--stone)]">← Offers</Link>
      <h1 className="text-xl font-semibold text-[var(--navy)]">{String(offer.offerId)}</h1>
      <p className="text-sm text-[var(--stone)]">Status: {String(offer.status)}</p>
      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div><dt className="text-[var(--stone)]">Product</dt><dd>{String(offer.productName)}</dd></div>
        <div><dt className="text-[var(--stone)]">Origin</dt><dd>{String(offer.origin ?? "—")}</dd></div>
        <div><dt className="text-[var(--stone)]">Quantity</dt><dd>{String(offer.availableQuantity ?? "—")} {String(offer.unit ?? "")}</dd></div>
        <div><dt className="text-[var(--stone)]">Price</dt><dd>{String(offer.price ?? "—")} {String(offer.currency ?? "")}</dd></div>
      </dl>
      {offer.reviewNotes ? (
        <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-900">
          {String(offer.reviewNotes)}
        </p>
      ) : null}
      {canSubmit && (
        <button type="button" onClick={submitOffer} className="btn btn-primary">
          Submit offer
        </button>
      )}
    </div>
  );
}
