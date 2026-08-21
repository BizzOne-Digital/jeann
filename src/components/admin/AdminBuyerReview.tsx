"use client";

import Link from "next/link";
import { useState } from "react";
import type { AdminBuyerDetail } from "@/lib/admin/buyer-approval";

export function AdminBuyerReview({
  initialBuyer,
  initialApprovals,
}: {
  initialBuyer: AdminBuyerDetail;
  initialApprovals: Array<{
    _id: string;
    decision: string;
    reason: string;
    createdAt: string | null;
  }>;
}) {
  const [buyer, setBuyer] = useState(initialBuyer);
  const [approvals, setApprovals] = useState(initialApprovals);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function decide(decision: "approved" | "rejected") {
    setSaving(true);
    setMessage(null);
    setError(null);
    const res = await fetch(`/api/admin/buyers/${encodeURIComponent(buyer._id)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, reason: reason.trim() || undefined }),
    });
    const data = (await res.json()) as { buyer?: AdminBuyerDetail; error?: string };
    setSaving(false);
    if (!res.ok || !data.buyer) {
      setError(data.error || "Unable to save decision.");
      return;
    }
    setBuyer(data.buyer);
    setMessage(decision === "approved" ? "Buyer approved. Email sent to contact." : "Buyer rejected.");
    const refresh = await fetch(`/api/admin/buyers/${encodeURIComponent(buyer._id)}`);
    if (refresh.ok) {
      const full = (await refresh.json()) as {
        approvals: typeof initialApprovals;
      };
      setApprovals(full.approvals);
    }
  }

  const isPending = buyer.status === "pending";

  return (
    <div className="space-y-6">
      <Link href="/admin/buyers" className="text-sm font-semibold text-[var(--ocean)] underline">
        ← All buyer organizations
      </Link>

      <div className="grid gap-4 rounded-lg border border-[var(--line)] bg-white p-5 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold text-[var(--navy)]">{buyer.legalName}</h2>
          <p className="mt-1 text-sm capitalize text-[var(--stone)]">Status: {buyer.status}</p>
          <p className="mt-1 text-sm text-[var(--stone)]">Country: {buyer.country}</p>
          {buyer.registrationNumber ? (
            <p className="mt-1 text-sm text-[var(--stone)]">
              Registration #: {buyer.registrationNumber}
            </p>
          ) : null}
          {buyer.domain ? (
            <p className="mt-1 text-sm text-[var(--stone)]">Domain: {buyer.domain}</p>
          ) : null}
          <p className="mt-1 text-sm text-[var(--stone)]">Registered: {buyer.createdAt ?? "—"}</p>
        </div>

        <div>
          <h3 className="font-semibold text-[var(--navy)]">Primary contact</h3>
          {buyer.primaryContact ? (
            <div className="mt-2 space-y-1 text-sm text-[var(--stone)]">
              <p>{buyer.primaryContact.name}</p>
              <p>{buyer.primaryContact.email}</p>
              {buyer.primaryContact.phone ? <p>{buyer.primaryContact.phone}</p> : null}
            </div>
          ) : (
            <p className="mt-2 text-sm text-[var(--stone)]">No contact linked.</p>
          )}
        </div>

        {isPending ? (
          <div className="lg:col-span-2 space-y-3 border-t border-[var(--line)] pt-4">
            <label className="label">
              Notes (optional — included in rejection email)
              <textarea
                className="field mt-1 min-h-20"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="btn btn-primary"
                disabled={saving}
                onClick={() => decide("approved")}
              >
                Approve buyer
              </button>
              <button
                type="button"
                className="btn border border-red-300 text-red-700"
                disabled={saving}
                onClick={() => decide("rejected")}
              >
                Reject
              </button>
            </div>
          </div>
        ) : null}

        {message ? <p className="lg:col-span-2 text-sm text-[var(--forest)]">{message}</p> : null}
        {error ? <p className="lg:col-span-2 text-sm text-red-700">{error}</p> : null}
      </div>

      <div className="rounded-lg border border-[var(--line)] bg-white p-5">
        <h3 className="font-semibold text-[var(--navy)]">Approval history</h3>
        {approvals.length > 0 ? (
          <ul className="mt-3 space-y-2 text-sm">
            {approvals.map((item) => (
              <li key={item._id} className="border-b border-[var(--line)] pb-2 last:border-0">
                <span className="capitalize font-medium">{item.decision}</span>
                {item.reason ? ` — ${item.reason}` : ""}
                <span className="block text-xs text-[var(--stone)]">{item.createdAt ?? ""}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-[var(--stone)]">No approval records yet.</p>
        )}
      </div>
    </div>
  );
}
