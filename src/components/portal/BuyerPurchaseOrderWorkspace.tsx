"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BUYER_ICPO_REVIEW_NOTICE,
  BUYER_LOI_REVIEW_NOTICE,
} from "@/lib/content/buyer-portal-guidance";
import { BuyerIcpoGuidancePanel } from "@/components/portal/BuyerIcpoGuidancePanel";
import { ICPO_SPECIFICATION_NOTE } from "@/lib/content/buyer-portal-guidance";
import { BuyerPortalAssistant } from "@/components/portal/BuyerPortalAssistant";

type PaymentTerm = { id: string; structure: string; iccCode: string; preferred?: boolean };

type Mode = "icpo_form" | "icpo_upload" | "loi_upload";

export function BuyerPurchaseOrderWorkspace() {
  const [mode, setMode] = useState<Mode>("icpo_form");
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [destinationPort, setDestinationPort] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("");
  const [incoterm, setIncoterm] = useState<"FOB" | "CIF">("CIF");
  const [pricePerMt, setPricePerMt] = useState("");
  const [requestedSpecification, setRequestedSpecification] = useState("");
  const [packaging, setPackaging] = useState("");
  const [paymentTermId, setPaymentTermId] = useState("");
  const [notes, setNotes] = useState("");
  const [icpoLegalAck, setIcpoLegalAck] = useState(false);
  const [discussFirst, setDiscussFirst] = useState(true);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  useEffect(() => {
    fetch("/api/payment-terms")
      .then((r) => r.json())
      .then((data: { items?: PaymentTerm[] }) => {
        const items = data.items ?? [];
        setPaymentTerms(items);
        const preferred = items.find((t) => t.preferred);
        if (preferred) setPaymentTermId(preferred.id);
      })
      .catch(() => setPaymentTerms([]));
  }, []);

  async function createDraft(payload: Record<string, unknown>) {
    const res = await fetch("/api/portal/buyer/requests", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { id?: string; error?: string };
    if (!res.ok || !data.id) throw new Error(data.error || "Unable to create request.");
    return data.id;
  }

  async function submitRequest(id: string) {
    const res = await fetch(`/api/portal/buyer/requests/${id}/submit`, {
      method: "POST",
      credentials: "same-origin",
    });
    const data = (await res.json()) as {
      ok?: boolean;
      reference?: string;
      reviewNotice?: string;
      error?: string;
    };
    if (!res.ok) throw new Error(data.error || "Unable to submit.");
    return data;
  }

  async function uploadAttachment(id: string, file: File) {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch(`/api/portal/buyer/requests/${id}/attachment`, {
      method: "POST",
      credentials: "same-origin",
      body,
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) throw new Error(data.error || "Upload failed.");
  }

  async function onSubmitForm(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!icpoLegalAck) {
      setError("Please acknowledge the ICPO legal notice.");
      return;
    }
    setBusy(true);
    try {
      const id = await createDraft({
        submissionKind: "icpo_form",
        productName,
        quantity,
        unit: "MT",
        destinationPort,
        destinationCountry,
        incoterm,
        pricePerMt: Number(pricePerMt),
        requestedSpecification,
        packaging,
        paymentTermId,
        notes,
        message: discussFirst
          ? "Buyer asked to discuss order with trade desk before final ICPO."
          : undefined,
      });
      const result = await submitRequest(id);
      setMessage(
        `${BUYER_ICPO_REVIEW_NOTICE} Reference: ${result.reference ?? "—"}.`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setBusy(false);
    }
  }

  async function onSubmitUpload(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!uploadFile) {
      setError("Attach your PO, ICPO, or LOI PDF.");
      return;
    }
    if (mode === "icpo_upload" && !icpoLegalAck) {
      setError("Please acknowledge the ICPO legal notice.");
      return;
    }
    setBusy(true);
    try {
      const id = await createDraft({
        submissionKind: mode,
        productName: productName || (mode === "loi_upload" ? "LOI — product TBD" : "ICPO upload"),
        notes,
      });
      await uploadAttachment(id, uploadFile);
      const result = await submitRequest(id);
      const notice = mode === "loi_upload" ? BUYER_LOI_REVIEW_NOTICE : BUYER_ICPO_REVIEW_NOTICE;
      setMessage(`${notice} Reference: ${result.reference ?? "—"}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_minmax(280px,340px)]">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["icpo_form", "Fill ICPO form"],
              ["icpo_upload", "Upload ICPO / PO"],
              ["loi_upload", "Upload LOI"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                mode === key
                  ? "bg-[var(--navy)] text-white"
                  : "border border-[var(--line)] bg-white text-[var(--stone)]"
              }`}
              onClick={() => setMode(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {mode === "icpo_form" ? (
          <form
            onSubmit={onSubmitForm}
            className="space-y-4 rounded-lg border border-[var(--line)] bg-white p-5 sm:p-8"
          >
            <p className="text-sm text-[var(--stone)]">
              Complete all fields below. Quantities are in <strong>metric tons (MT)</strong>.
              Incoterms: <strong>FOB</strong> or <strong>CIF</strong> only.
            </p>
            <label className="label block">
              Product name
              <input
                className="field mt-1 w-full"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="label">
                Quantity (MT)
                <input
                  className="field mt-1 w-full"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </label>
              <label className="label">
                Price per MT
                <input
                  className="field mt-1 w-full"
                  type="number"
                  min="0"
                  step="0.01"
                  value={pricePerMt}
                  onChange={(e) => setPricePerMt(e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="label">
                Destination port
                <input
                  className="field mt-1 w-full"
                  value={destinationPort}
                  onChange={(e) => setDestinationPort(e.target.value)}
                  required
                />
              </label>
              <label className="label">
                Destination country
                <input
                  className="field mt-1 w-full"
                  value={destinationCountry}
                  onChange={(e) => setDestinationCountry(e.target.value)}
                />
              </label>
            </div>
            <label className="label block">
              Incoterms
              <select
                className="field mt-1 w-full"
                value={incoterm}
                onChange={(e) => setIncoterm(e.target.value as "FOB" | "CIF")}
              >
                <option value="FOB">FOB</option>
                <option value="CIF">CIF</option>
              </select>
            </label>
            <label className="label block">
              Product specification
              <textarea
                className="field mt-1 min-h-24 w-full"
                value={requestedSpecification}
                onChange={(e) => setRequestedSpecification(e.target.value)}
                required
              />
              <span className="mt-1 block text-xs font-normal normal-case tracking-normal text-amber-800">
                {ICPO_SPECIFICATION_NOTE}
              </span>
            </label>
            <label className="label block">
              Packaging type
              <input
                className="field mt-1 w-full"
                value={packaging}
                onChange={(e) => setPackaging(e.target.value)}
                placeholder="e.g. Flexitank, FIBC, bulk vessel"
                required
              />
            </label>
            {paymentTerms.length > 0 ? (
              <label className="label block">
                Payment term (must match enabled contract payment option)
                <select
                  className="field mt-1 w-full"
                  value={paymentTermId}
                  onChange={(e) => setPaymentTermId(e.target.value)}
                >
                  {paymentTerms.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.structure} ({t.iccCode})
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            <label className="label block">
              Notes for trade desk
              <textarea
                className="field mt-1 min-h-20 w-full"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
            <label className="flex gap-2 text-sm">
              <input
                type="checkbox"
                checked={discussFirst}
                onChange={(e) => setDiscussFirst(e.target.checked)}
              />
              I prefer to discuss this order with the trade desk before treating my ICPO as final.
            </label>
            <label className="flex gap-2 text-sm">
              <input
                type="checkbox"
                checked={icpoLegalAck}
                onChange={(e) => setIcpoLegalAck(e.target.checked)}
                required
              />
              I understand the ICPO legal notice (see guidance panel).
            </label>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? "Submitting…" : "Submit ICPO for review"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={onSubmitUpload}
            className="space-y-4 rounded-lg border border-[var(--line)] bg-white p-5 sm:p-8"
          >
            {mode === "loi_upload" ? (
              <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                {BUYER_LOI_REVIEW_NOTICE}
              </p>
            ) : (
              <p className="text-sm text-[var(--stone)]">
                Upload a signed PO or ICPO (PDF). Ensure it includes product, MT quantity, port,
                FOB/CIF, price per MT, specification, and packaging.
              </p>
            )}
            <label className="label block">
              Product name (if known)
              <input
                className="field mt-1 w-full"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </label>
            <label className="label block">
              PDF document
              <input
                className="mt-1 block w-full text-sm"
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                required
              />
            </label>
            {mode === "icpo_upload" ? (
              <label className="flex gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={icpoLegalAck}
                  onChange={(e) => setIcpoLegalAck(e.target.checked)}
                />
                I understand the ICPO legal notice.
              </label>
            ) : null}
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? "Uploading…" : mode === "loi_upload" ? "Submit LOI" : "Submit ICPO upload"}
            </button>
          </form>
        )}

        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        {message ? (
          <p className="text-sm text-[var(--forest)]">
            {message}{" "}
            <Link href="/portal/buyer/requests" className="font-semibold underline">
              View requests
            </Link>
          </p>
        ) : null}
      </div>

      <div className="space-y-4">
        <BuyerIcpoGuidancePanel />
        <BuyerPortalAssistant />
      </div>
    </div>
  );
}
