"use client";

import { FormEvent, useState } from "react";

type Doc = {
  id: string;
  title: string;
  documentType?: string;
  workflowStatus: string;
  currentVersionId?: string | null;
};

export type Variant = "buyer" | "supplier";

type StepDef = {
  n: number;
  title: string;
  admin: string;
  buyer: string;
  /** Document types that belong to this step. */
  types: { value: string; label: string }[];
};

const BUYER_STEPS: StepDef[] = [
  {
    n: 1,
    title: "SCO or FCO",
    admin: "Generate a pre-loaded SCO or FCO with the product name and price (FOB and CIF) and send it to the buyer. This step can be bypassed in some cases.",
    buyer: "Buyer receives and reviews the SCO or FCO.",
    types: [
      { value: "sco", label: "SCO" },
      { value: "fco", label: "FCO" },
    ],
  },
  {
    n: 2,
    title: "ICPO or LOI",
    admin: "Receive and review the ICPO or LOI. The ICPO cannot be bypassed. Request CIS and RWA.",
    buyer: "Buyer submits a generated or pre-loaded ICPO or LOI, or uploads their own.",
    types: [
      { value: "icpo", label: "ICPO" },
      { value: "loi", label: "LOI" },
    ],
  },
  {
    n: 3,
    title: "CIS, RWA, FIS and PSA with LC wording",
    admin: "Receive and review CIS, RWA and FIS. Generate the PSA from the ICPO or LOI and send it with the LC wording to the buyer to sign.",
    buyer: "Buyer sends CIS, RWA and FIS, then receives, signs and stamps the PSA with the passport of the person in charge.",
    types: [
      { value: "cis", label: "CIS" },
      { value: "rwa", label: "RWA" },
      { value: "fis", label: "FIS" },
      { value: "spa", label: "PSA / SPA" },
      { value: "proposed_lc_wording", label: "LC wording" },
    ],
  },
  {
    n: 4,
    title: "Signed PSA and passports",
    admin: "Receive the signed and stamped PSA with the buyer's passport. Finekarts signs and stamps the PSA and attaches the passport of the person in charge.",
    buyer: "Buyer receives a copy of the fully signed PSA.",
    types: [{ value: "passport_copy", label: "Passport copy" }],
  },
  {
    n: 5,
    title: "Proforma Invoice",
    admin: "Generate the banking-regulated Proforma Invoice. Request the LC type and exact amount agreed on the PSA. Everything must match.",
    buyer: "Buyer receives the Proforma Invoice and must submit the LC from the issuing bank within 24 hours.",
    types: [{ value: "proforma_invoice", label: "Proforma Invoice" }],
  },
  {
    n: 6,
    title: "LC received and bank review",
    admin: "Receive the LC. Send all contract paperwork to the banking advisor for review and approval. The bank opens an LC account.",
    buyer: "If the LC does not match the PSA, the buyer pays the amendment. If it is good, no amendment is due.",
    types: [
      { value: "letter_of_credit", label: "Letter of Credit (real LC, not the LC wording)" },
      { value: "other", label: "Other bank document" },
    ],
  },
  {
    n: 7,
    title: "Shipping documents and payment",
    admin: "After collecting all LC documents and certificates agreed on the PSA, the advisor reviews them and sends them to the buyer's bank for payment.",
    buyer: "The seller and bank submit all documents. The buyer's bank pays by SWIFT MT103.",
    types: [{ value: "other", label: "Shipping or payment document" }],
  },
];

const SUPPLIER_STEPS: StepDef[] = [
  {
    n: 1,
    title: "Submit SCO or FCO",
    admin: "Receive and review the SCO or FCO. If the buyer agrees, Finekarts issues the ICPO to the supplier.",
    buyer: "Supplier submits the SCO or FCO. Both documents are accepted by the buyer.",
    types: [
      { value: "sco", label: "SCO" },
      { value: "fco", label: "FCO" },
      { value: "icpo", label: "ICPO" },
    ],
  },
  {
    n: 2,
    title: "Request RWA and CIS (FIS optional)",
    admin: "Finekarts sends the CIS, RWA and FIS to the supplier if requested. The RWA is used only in LC transactions.",
    buyer: "Supplier requests the RWA and CIS. The FIS is optional.",
    types: [
      { value: "cis", label: "CIS" },
      { value: "rwa", label: "RWA" },
      { value: "fis", label: "FIS" },
    ],
  },
  {
    n: 3,
    title: "Prepare the PSA",
    admin: "Review the PSA, sign and stamp it with the passport copy, and send it to the supplier for final signature. The supplier returns a copy.",
    buyer: "Supplier prepares the PSA and sends it to Finekarts to sign and stamp, with a copy of the passport.",
    types: [
      { value: "spa", label: "PSA / SPA" },
      { value: "proposed_lc_wording", label: "LC wording" },
      { value: "passport_copy", label: "Passport copy" },
    ],
  },
  {
    n: 4,
    title: "Signed PSA and Proforma Invoice",
    admin: "Receive the signed contract with the invoice. Open the LC account, send the LC to the supplier and request inspection of quality and quantity at the supplier site.",
    buyer: "Supplier receives the signed PSA, signs and stamps it, attaches the passport, and sends the final contract with the invoice, requesting the LC.",
    types: [{ value: "proforma_invoice", label: "Proforma Invoice" }],
  },
  {
    n: 5,
    title: "LC received and shipment",
    admin: "The bank advisor verifies all shipping documents (BL, certificates of insurance) against the PSA, then payment is sent via MT103.",
    buyer: "Supplier receives the LC and sends the contract to their bank. After bank approval the supplier loads the goods and, if there is no amendment, the advisor sends all documents and certificates to the buyer bank.",
    types: [{ value: "other", label: "LC, shipping or certificate document" }],
  },
  {
    n: 6,
    title: "Payment confirmed",
    admin: "The bank submits the final payment. After approval of all documents the payment is sent to the supplier and the trans-shipment is monitored until the port of delivery.",
    buyer: "Supplier receives and confirms the payment and produces the final delivery report.",
    types: [{ value: "other", label: "Payment confirmation or delivery report" }],
  },
  {
    n: 7,
    title: "Final documents and delivery",
    admin: "Confirmation of delivery: the ship has docked and the shipments are ready for clearance.",
    buyer: "Supplier sends all final documents to the buyer.",
    types: [{ value: "other", label: "Final document" }],
  },
];

/** Document types an external supplier may upload (mirrors the server rule). */
const SUPPLIER_EXTERNAL_UPLOAD = ["sco", "fco", "spa", "proposed_lc_wording", "proforma_invoice", "passport_copy", "loi", "other"];

function docsForStep(step: StepDef, documents: Doc[], variant: Variant): Doc[] {
  const values = step.types.map((t) => t.value);
  return documents.filter((d) => {
    const type = d.documentType ?? "";
    // A PSA moves from step 3 to step 4 once it is signed.
    if (type === "spa") {
      const signed = d.workflowStatus === "signed";
      return step.n === (signed ? 4 : 3);
    }
    // Steps 6 and 7 both use "other"; show other documents under step 6 and 7 only by tab choice (step 6 here).
    if (type === "other") return step.n === (variant === "supplier" ? 5 : 6);
    return values.includes(type);
  });
}

function stepDone(docs: Doc[]): boolean {
  return docs.some((d) => ["approved", "sent", "viewed", "signed"].includes(d.workflowStatus));
}

export function AdminSevenSteps({
  transactionId,
  documents,
  isLocked,
  onChanged,
  onOpenDocuments,
  variant = "buyer",
  isStaff = true,
}: {
  transactionId: string;
  documents: Doc[];
  isLocked: boolean;
  onChanged: () => void;
  onOpenDocuments: () => void;
  variant?: Variant;
  /** External users (a supplier) see only the types they may upload and no staff shortcuts. */
  isStaff?: boolean;
}) {
  const STEPS = variant === "supplier" ? SUPPLIER_STEPS : BUYER_STEPS;
  const [open, setOpen] = useState<number>(1);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [signDocId, setSignDocId] = useState<string | null>(null);
  const [signerName, setSignerName] = useState("");

  /** Finekarts signs and stamps the PSA: upload the signed copy and record who signed. */
  async function signDoc(e: FormEvent<HTMLFormElement>, d: Doc) {
    e.preventDefault();
    const file = (e.currentTarget.elements.namedItem("signedFile") as HTMLInputElement).files?.[0];
    if (!file || !d.currentVersionId || !signerName.trim()) return;
    setBusy(true);
    setMessage(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("versionId", d.currentVersionId);
      body.append("signatoryName", signerName.trim());
      const res = await fetch(`/api/transactions/${transactionId}/documents/${d.id}/sign`, {
        method: "POST",
        credentials: "same-origin",
        body,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Signing failed");
      setMessage("Signed copy recorded.");
      setSignDocId(null);
      setSignerName("");
      onChanged();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Signing failed.");
    } finally {
      setBusy(false);
    }
  }

  async function closeTransaction() {
    if (!window.confirm("Close this transaction? Its record will be locked and can no longer be changed. This cannot be undone.")) return;
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/workspace/transactions/" + transactionId + "/close", {
        method: "POST",
        credentials: "same-origin",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to close the transaction.");
      setMessage("Transaction closed and locked.");
      onChanged();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Unable to close the transaction.");
    } finally {
      setBusy(false);
    }
  }

  async function download(docId: string) {
    const res = await fetch(`/api/transactions/${transactionId}/documents/${docId}/download`, {
      credentials: "same-origin",
    });
    const json = await res.json();
    if (!res.ok || !json.url) {
      setMessage(json.error ?? "Download failed.");
      return;
    }
    window.open(json.url, "_blank", "noopener,noreferrer");
  }

  async function upload(e: FormEvent<HTMLFormElement>, step: StepDef) {
    e.preventDefault();
    const form = e.currentTarget;
    const file = (form.elements.namedItem("file") as HTMLInputElement).files?.[0];
    const type = (form.elements.namedItem("type") as HTMLSelectElement).value;
    if (!file) return;
    setBusy(true);
    setMessage(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("documentType", type);
      body.append("title", step.types.find((t) => t.value === type)?.label ?? "Document");
      body.append("submitForReview", "true");
      const res = await fetch(`/api/transactions/${transactionId}/documents/upload`, {
        method: "POST",
        credentials: "same-origin",
        body,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      setMessage("Uploaded and submitted for review.");
      form.reset();
      onChanged();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-[var(--stone)]">
        The seven steps of the {variant === "supplier" ? "supplier" : "buyer"} process. At each step you can upload and download documents.
        The PSA can be signed here. Generating and sending documents are done from the Documents tab.
      </p>
      {isLocked ? (
        <p className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          This transaction is closed. Its record is locked: you can view and download documents but not change them.
        </p>
      ) : null}
      {message ? <p className="text-sm text-[var(--navy)]">{message}</p> : null}
      <ol className="space-y-2">
        {STEPS.map((step) => {
          const docs = docsForStep(step, documents, variant);
          const uploadTypes = isStaff ? step.types : step.types.filter((t) => SUPPLIER_EXTERNAL_UPLOAD.includes(t.value));
          const done = stepDone(docs);
          const isOpen = open === step.n;
          return (
            <li key={step.n} className="rounded-lg border border-[var(--line)] bg-white">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                onClick={() => setOpen(isOpen ? 0 : step.n)}
              >
                <span className="font-semibold text-[var(--navy)]">
                  Step {step.n}. {step.title}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    done ? "bg-[var(--forest)] text-white" : "bg-[var(--mist)] text-[var(--stone)]"
                  }`}
                >
                  {done ? "Done" : docs.length ? "In progress" : "Waiting"}
                </span>
              </button>
              {isOpen ? (
                <div className="space-y-3 border-t border-[var(--line)] px-4 py-3 text-sm">
                  <p>
                    <span className="font-medium text-[var(--navy)]">Finekarts: </span>
                    {step.admin}
                  </p>
                  <p>
                    <span className="font-medium text-[var(--navy)]">{variant === "supplier" ? "Supplier: " : "Buyer: "}</span>
                    {step.buyer}
                  </p>
                  {docs.length === 0 ? (
                    <p className="text-[var(--stone)]">No documents at this step yet.</p>
                  ) : (
                    <ul className="divide-y divide-[var(--line)] rounded border border-[var(--line)]">
                      {docs.map((d) => (
                        <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
                          <span>
                            {d.title}
                            <span className="ml-2 text-xs text-[var(--stone)]">
                              {d.workflowStatus.replaceAll("_", " ")}
                            </span>
                          </span>
                          <span className="flex gap-2">
                            {!isLocked && d.documentType === "spa" && d.currentVersionId ? (
                              <button
                                type="button"
                                className="btn btn-secondary text-xs"
                                onClick={() => setSignDocId(signDocId === d.id ? null : d.id)}
                              >
                                Sign
                              </button>
                            ) : null}
                            <button type="button" className="btn text-xs" onClick={() => download(d.id)}>
                              Download
                            </button>
                          </span>
                          {signDocId === d.id ? (
                            <form onSubmit={(e) => signDoc(e, d)} className="flex w-full flex-wrap items-center gap-2 pt-2">
                              <input
                                className="field"
                                placeholder="Name of signer"
                                value={signerName}
                                onChange={(e) => setSignerName(e.target.value)}
                                required
                              />
                              <input name="signedFile" type="file" required className="text-xs" />
                              <button type="submit" className="btn btn-primary text-xs" disabled={busy}>
                                {busy ? "Saving…" : "Upload signed copy"}
                              </button>
                            </form>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  )}
                  {!isLocked && uploadTypes.length > 0 ? (
                    <form onSubmit={(e) => upload(e, step)} className="flex flex-wrap items-center gap-2">
                      <select name="type" className="field">
                        {uploadTypes.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                      <input name="file" type="file" required className="text-xs" />
                      <button type="submit" className="btn btn-primary text-xs" disabled={busy}>
                        {busy ? "Uploading…" : "Upload"}
                      </button>
                      {isStaff ? (
                        <button type="button" className="btn btn-secondary text-xs" onClick={onOpenDocuments}>
                          Sign, generate or send
                        </button>
                      ) : null}
                    </form>
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
      {isStaff && !isLocked ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--line)] bg-white p-4 text-sm">
          <p className="text-[var(--stone)]">
            After the final delivery is confirmed, close the transaction. A closed transaction is a locked record
            that nobody can change.
          </p>
          <button type="button" className="btn btn-secondary text-xs" onClick={closeTransaction} disabled={busy}>
            Close transaction
          </button>
        </div>
      ) : null}
    </div>
  );
}
