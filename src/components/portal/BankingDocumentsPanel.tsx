"use client";

import { useCallback, useEffect, useState } from "react";

type DocRow = {
  id: string;
  transactionNumber?: string;
  side: "buyer_sale" | "supplier_purchase";
  stepNumber?: number;
  documentType: string;
  title: string;
  status: string;
  signed: boolean;
  filename?: string;
  isPdf: boolean;
};

type PackageRow = {
  id: string;
  packageReference: string;
  status: string;
  checksum?: string;
  documentCount: number;
  instrumentId: string;
  instrumentDbId?: string;
  createdAt: string;
};

type CourierRow = {
  id: string;
  courierCompany: string;
  trackingNumber?: string;
  sender: string;
  recipient: string;
  recipientBankName?: string;
  status: string;
  dispatchDate?: string;
  expectedDeliveryDate?: string;
  receivedDate?: string;
  packageDescription?: string;
  verificationStatus?: string;
  paymentStatus?: string;
  instrumentId: string;
  instrumentDbId?: string;
  presentationPackageId?: string;
  createdAt: string;
};

export function BankingDocumentsPanel() {
  const [documents, setDocuments] = useState<DocRow[]>([]);
  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [couriers, setCouriers] = useState<CourierRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    packageId: "",
    courierCompany: "",
    trackingNumber: "",
    sender: "",
    recipient: "",
    recipientBankName: "",
    dispatchDate: "",
  });

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/banking/documents", { credentials: "same-origin" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to load");
      setDocuments(json.documents ?? []);
      setPackages(json.packages ?? []);
      setCouriers(json.couriers ?? []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => void load(), 0);
    return () => clearTimeout(t);
  }, [load]);

  async function download(id: string) {
    const res = await fetch(`/api/banking/documents/${id}/download`, { credentials: "same-origin" });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? "Download failed");
      return;
    }
    window.open(json.url, "_blank", "noopener");
  }

  async function createCourier(e: React.FormEvent) {
    e.preventDefault();
    const pkg = packages.find((p) => p.id === form.packageId);
    if (!pkg?.instrumentDbId) {
      setError("Select a presentation package.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/banking/courier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bankingInstrumentId: pkg.instrumentDbId,
          presentationPackageId: pkg.id,
          courierCompany: form.courierCompany,
          trackingNumber: form.trackingNumber || undefined,
          sender: form.sender,
          recipient: form.recipient,
          recipientBankName: form.recipientBankName || undefined,
          dispatchDate: form.dispatchDate || undefined,
          packageDescription: `Package ${pkg.packageReference}`,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not create courier record");
      setForm({ packageId: "", courierCompany: "", trackingNumber: "", sender: "", recipient: "", recipientBankName: "", dispatchDate: "" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  async function patchCourier(courierId: string, body: Record<string, unknown>) {
    setBusy(true);
    try {
      const res = await fetch("/api/banking/courier", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courierId, ...body }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Update failed");
      setError(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  const btn = "rounded border border-[var(--line)] px-2 py-1 text-xs text-[var(--navy)] disabled:opacity-50";

  return (
    <div className="space-y-8">
      <p className="text-sm text-[var(--stone)]">
        Documents (steps 1-6), presentation packages and courier records for deals assigned to you. Each
        document is identified by transaction number, step and type.
      </p>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <section>
        <h2 className="font-semibold text-[var(--navy)]">Transaction documents (steps 1-6)</h2>
        {documents.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--stone)]">No released documents for your assigned deals yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-[var(--line)] rounded-lg border border-[var(--line)] bg-white">
            {documents.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-[var(--navy)]">
                    {d.transactionNumber ?? "Transaction"} · {d.stepNumber ? `Step ${d.stepNumber}` : "Step n/a"} ·{" "}
                    {d.documentType.replaceAll("_", " ").toUpperCase()}
                  </p>
                  <p className="text-xs text-[var(--stone)]">
                    {d.title} · {d.side === "buyer_sale" ? "Buyer side" : "Supplier side"} ·{" "}
                    {d.signed ? "Signed" : d.status.replaceAll("_", " ")}
                    {d.filename ? ` · ${d.filename}` : ""}
                    {d.filename && !d.isPdf ? " · non-PDF format" : ""}
                  </p>
                </div>
                <button type="button" className={btn} onClick={() => void download(d.id)}>
                  Download
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

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
        <h2 className="font-semibold text-[var(--navy)]">Courier to buyer bank, verification and payment</h2>
        {packages.length > 0 ? (
          <form onSubmit={createCourier} className="mt-3 grid gap-2 rounded border border-[var(--line)] p-3 text-sm sm:grid-cols-2">
            <select required className="rounded border border-[var(--line)] px-2 py-1.5 sm:col-span-2" value={form.packageId} onChange={(e) => setForm((f) => ({ ...f, packageId: e.target.value }))}>
              <option value="">Select presentation package</option>
              {packages.map((p) => (
                <option key={p.id} value={p.id}>{p.packageReference} ({p.instrumentId})</option>
              ))}
            </select>
            <input required placeholder="Courier company" className="rounded border border-[var(--line)] px-2 py-1.5" value={form.courierCompany} onChange={(e) => setForm((f) => ({ ...f, courierCompany: e.target.value }))} />
            <input placeholder="Courier tracking number" className="rounded border border-[var(--line)] px-2 py-1.5" value={form.trackingNumber} onChange={(e) => setForm((f) => ({ ...f, trackingNumber: e.target.value }))} />
            <input required placeholder="Sender (your bank / adviser)" className="rounded border border-[var(--line)] px-2 py-1.5" value={form.sender} onChange={(e) => setForm((f) => ({ ...f, sender: e.target.value }))} />
            <input required placeholder="Recipient (buyer bank adviser)" className="rounded border border-[var(--line)] px-2 py-1.5" value={form.recipient} onChange={(e) => setForm((f) => ({ ...f, recipient: e.target.value }))} />
            <input placeholder="Buyer bank name" className="rounded border border-[var(--line)] px-2 py-1.5" value={form.recipientBankName} onChange={(e) => setForm((f) => ({ ...f, recipientBankName: e.target.value }))} />
            <input type="date" title="Dispatch date" className="rounded border border-[var(--line)] px-2 py-1.5" value={form.dispatchDate} onChange={(e) => setForm((f) => ({ ...f, dispatchDate: e.target.value }))} />
            <button type="submit" disabled={busy} className="w-fit rounded bg-[var(--navy)] px-3 py-1.5 text-white disabled:opacity-60">
              Record courier dispatch
            </button>
          </form>
        ) : null}

        {couriers.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--stone)]">No courier records yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-[var(--line)] rounded-lg border border-[var(--line)] bg-white">
            {couriers.map((c) => {
              const received = c.status === "delivered";
              const verified = c.verificationStatus === "verified_authentic";
              return (
                <li key={c.id} className="space-y-1 px-4 py-3 text-sm">
                  <p className="font-medium text-[var(--navy)]">
                    {c.courierCompany}
                    {c.trackingNumber ? ` · ${c.trackingNumber}` : ""}
                  </p>
                  <p className="text-[var(--stone)]">
                    {c.instrumentId} · {c.sender} → {c.recipient}
                    {c.recipientBankName ? ` (${c.recipientBankName})` : ""}
                  </p>
                  <p className="text-xs text-[var(--stone)]">
                    Courier: {c.status.replaceAll("_", " ")} · Verification:{" "}
                    {(c.verificationStatus ?? "pending").replaceAll("_", " ")} · Payment:{" "}
                    {(c.paymentStatus ?? "pending").replaceAll("_", " ")}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {!received ? (
                      <>
                        <button type="button" disabled={busy} className={btn} onClick={() => void patchCourier(c.id, { status: "in_transit" })}>
                          Mark in transit
                        </button>
                        <button type="button" disabled={busy} className={btn} onClick={() => void patchCourier(c.id, { receivedDate: new Date().toISOString() })}>
                          Mark received by buyer bank
                        </button>
                      </>
                    ) : null}
                    {received && !verified ? (
                      <>
                        <button type="button" disabled={busy} className={btn} onClick={() => void patchCourier(c.id, { verificationStatus: "verified_authentic" })}>
                          Buyer bank verified authentic
                        </button>
                        <button type="button" disabled={busy} className={btn} onClick={() => void patchCourier(c.id, { verificationStatus: "discrepancies_found" })}>
                          Discrepancies found
                        </button>
                      </>
                    ) : null}
                    {verified && c.paymentStatus !== "payment_confirmed" ? (
                      <button type="button" disabled={busy} className={btn} onClick={() => void patchCourier(c.id, { paymentStatus: "payment_confirmed" })}>
                        Confirm full payment received
                      </button>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
