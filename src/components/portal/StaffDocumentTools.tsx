"use client";

import { FormEvent, useEffect, useState } from "react";

type Doc = {
  id: string;
  title: string;
  documentType?: string;
  workflowStatus: string;
  currentVersionId?: string | null;
  bankingVisible?: boolean;
};

const STEP3_TYPES = [
  { value: "spa", label: "PSA / SPA" },
  { value: "proposed_lc_wording", label: "LC wording" },
  { value: "proforma_invoice", label: "Proforma invoice" },
];

async function post(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error ?? "Request failed.");
  return json;
}

/** Staff-only: new SCO/FCO with adjustable price, step 3 document generation, send and banking share. */
export function StaffDocumentTools({
  transactionId,
  documents,
  onChanged,
}: {
  transactionId: string;
  documents: Doc[];
  onChanged?: () => void;
}) {
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [offer, setOffer] = useState({
    documentType: "sco",
    documentId: "",
    productName: "",
    unitPrice: "",
    currency: "USD",
    quantity: "",
    quantityUnit: "MT",
    incoterm: "FOB",
    loadingPort: "",
    destinationPort: "",
    paymentTerms: "",
    validity: "",
    notes: "",
  });
  const [internalPrice, setInternalPrice] = useState("");
  const [s3Type, setS3Type] = useState("spa");
  const [s3Text, setS3Text] = useState("");
  const [signName, setSignName] = useState("");

  function counterSign(e: FormEvent<HTMLFormElement>, d: Doc) {
    e.preventDefault();
    const file = (e.currentTarget.elements.namedItem("signedFile") as HTMLInputElement).files?.[0];
    if (!file || !d.currentVersionId || !signName.trim()) return;
    void run(async () => {
      const body = new FormData();
      body.append("file", file);
      body.append("versionId", d.currentVersionId as string);
      body.append("signatoryName", signName.trim());
      const res = await fetch(`/api/transactions/${transactionId}/documents/${d.id}/sign`, {
        method: "POST",
        credentials: "same-origin",
        body,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Counter-signing failed.");
      return "Counter-signed copy recorded.";
    });
  }

  useEffect(() => {
    fetch(`/api/transactions/${transactionId}/offers`, { credentials: "same-origin" })
      .then((r) => r.json())
      .then((j) => {
        if (!j.prefill) return;
        const p = j.prefill;
        setInternalPrice(p.internalPrice ?? "");
        setOffer((o) => ({
          ...o,
          productName: p.productName || o.productName,
          unitPrice: p.unitPrice && p.unitPrice !== "0" ? p.unitPrice : o.unitPrice,
          currency: p.currency || o.currency,
          quantity: p.quantity && p.quantity !== "0" ? p.quantity : o.quantity,
          quantityUnit: p.quantityUnit || o.quantityUnit,
          incoterm: p.incoterm || o.incoterm,
          loadingPort: p.loadingPort || "",
          destinationPort: p.destinationPort || "",
          paymentTerms: p.paymentTerms || "",
        }));
      })
      .catch(() => undefined);
  }, [transactionId]);

  async function run(fn: () => Promise<string>) {
    setBusy(true);
    setMsg(null);
    try {
      setMsg(await fn());
      onChanged?.();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  function submitOffer(e: FormEvent) {
    e.preventDefault();
    void run(async () => {
      const body = { ...offer, documentId: offer.documentId || undefined };
      const j = await post(`/api/transactions/${transactionId}/offers`, body);
      return `Offer revision v${j.version} created (draft). Submit, approve and send it below.`;
    });
  }

  function generateStep3(e: FormEvent) {
    e.preventDefault();
    void run(async () => {
      const label = STEP3_TYPES.find((t) => t.value === s3Type)?.label ?? s3Type;
      const existing = documents.find((d) => d.documentType === s3Type);
      let documentId = existing?.id;
      if (!documentId) {
        const c = await post(`/api/transactions/${transactionId}/documents`, {
          documentType: s3Type,
          title: label,
          buyerVisible: false,
        });
        documentId = c.documentId as string;
      }
      const j = await post(`/api/transactions/${transactionId}/documents/${documentId}/generate`, {
        structuredData: { documentType: s3Type },
        clauseTexts: s3Text.split(/\n{2,}/).filter((t) => t.trim()),
        isDraft: true,
      });
      return `${label} v${j.version} generated as PDF (draft).`;
    });
  }

  function docAction(d: Doc, action: string, extra: Record<string, unknown> = {}) {
    void run(async () => {
      if (!d.currentVersionId && action !== "share_banking") {
        throw new Error("No version yet.");
      }
      await post(`/api/transactions/${transactionId}/documents/${d.id}/actions`, {
        action,
        versionId: d.currentVersionId ?? undefined,
        ...extra,
      });
      return `${d.title}: ${action.replace("_", " ")} done.`;
    });
  }

  const offerDocs = documents.filter((d) => d.documentType === "sco" || d.documentType === "fco");

  return (
    <section className="space-y-6 rounded-lg border border-[var(--line)] bg-white p-5">
      <h2 className="font-semibold text-[var(--navy)]">Staff document tools</h2>

      <form onSubmit={submitOffer} className="space-y-3">
        <h3 className="text-sm font-semibold">Step 1 - new SCO / FCO (adjustable price)</h3>
        {internalPrice ? (
          <p className="text-xs text-amber-900">
            Internal product price (staff only, never shown to buyer): {internalPrice}
          </p>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-4">
          <select
            className="field"
            value={offer.documentType}
            onChange={(e) => setOffer({ ...offer, documentType: e.target.value })}
          >
            <option value="sco">SCO</option>
            <option value="fco">FCO</option>
          </select>
          <select
            className="field"
            value={offer.documentId}
            onChange={(e) => setOffer({ ...offer, documentId: e.target.value })}
          >
            <option value="">New offer</option>
            {offerDocs.map((d) => (
              <option key={d.id} value={d.id}>
                Revise: {d.title}
              </option>
            ))}
          </select>
          <input className="field" placeholder="Product" required value={offer.productName}
            onChange={(e) => setOffer({ ...offer, productName: e.target.value })} />
          <input className="field" placeholder="Unit price" required inputMode="decimal" value={offer.unitPrice}
            onChange={(e) => setOffer({ ...offer, unitPrice: e.target.value })} />
          <input className="field" placeholder="Currency" required maxLength={3} value={offer.currency}
            onChange={(e) => setOffer({ ...offer, currency: e.target.value })} />
          <input className="field" placeholder="Quantity" required value={offer.quantity}
            onChange={(e) => setOffer({ ...offer, quantity: e.target.value })} />
          <input className="field" placeholder="Unit" required value={offer.quantityUnit}
            onChange={(e) => setOffer({ ...offer, quantityUnit: e.target.value })} />
          <input className="field" placeholder="Incoterm" required value={offer.incoterm}
            onChange={(e) => setOffer({ ...offer, incoterm: e.target.value })} />
          <input className="field" placeholder="Loading port" value={offer.loadingPort}
            onChange={(e) => setOffer({ ...offer, loadingPort: e.target.value })} />
          <input className="field" placeholder="Destination" value={offer.destinationPort}
            onChange={(e) => setOffer({ ...offer, destinationPort: e.target.value })} />
          <input className="field" placeholder="Payment terms" value={offer.paymentTerms}
            onChange={(e) => setOffer({ ...offer, paymentTerms: e.target.value })} />
          <input className="field" placeholder="Offer validity" value={offer.validity}
            onChange={(e) => setOffer({ ...offer, validity: e.target.value })} />
        </div>
        <button className="btn btn-primary" type="submit" disabled={busy}>
          Create offer revision
        </button>
      </form>

      <form onSubmit={generateStep3} className="space-y-3 border-t border-[var(--line)] pt-4">
        <h3 className="text-sm font-semibold">Step 3 - generate PSA/SPA, LC wording or proforma invoice</h3>
        <select className="field" value={s3Type} onChange={(e) => setS3Type(e.target.value)}>
          {STEP3_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <textarea
          className="field min-h-28"
          placeholder="Document wording. Separate clauses with a blank line."
          value={s3Text}
          onChange={(e) => setS3Text(e.target.value)}
        />
        <button className="btn btn-primary" type="submit" disabled={busy}>
          Generate PDF version
        </button>
      </form>

      <div className="border-t border-[var(--line)] pt-4">
        <h3 className="text-sm font-semibold">Review, send and share</h3>
        <ul className="mt-2 divide-y divide-[var(--line)] text-sm">
          {documents.map((d) => (
            <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
              <span>
                {d.title} · {d.workflowStatus}
                {d.bankingVisible ? " · shared with banking" : ""}
              </span>
              <span className="flex flex-wrap gap-2">
                <button type="button" className="btn" disabled={busy} onClick={() => docAction(d, "submit")}>Submit</button>
                <button type="button" className="btn" disabled={busy} onClick={() => docAction(d, "review", { decision: "approved" })}>Approve</button>
                <button type="button" className="btn" disabled={busy} onClick={() => docAction(d, "send")}>Send to counterparty</button>
                <button type="button" className="btn" disabled={busy} onClick={() => docAction(d, "share_banking", { shared: !d.bankingVisible })}>
                  {d.bankingVisible ? "Unshare banking" : "Share with banking"}
                </button>
              </span>
              {d.documentType === "spa" && ["sent", "approved", "signed"].includes(d.workflowStatus) ? (
                <form onSubmit={(e) => counterSign(e, d)} className="flex w-full flex-wrap items-center gap-2 pt-1">
                  <input className="field w-48" placeholder="Finekarts signatory" value={signName}
                    onChange={(e) => setSignName(e.target.value)} required />
                  <input className="field text-sm" name="signedFile" type="file" accept=".pdf" required />
                  <button className="btn" type="submit" disabled={busy}>Record counter-signed copy</button>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
      {msg ? <p className="text-sm text-[var(--stone)]">{msg}</p> : null}
    </section>
  );
}
