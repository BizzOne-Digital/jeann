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
  /** The key of this step in the transaction's own workflow (the engine). */
  key: string;
  title: string;
  admin: string;
  buyer: string;
  /** Document types that can be uploaded at this step. */
  types: { value: string; label: string }[];
  /** Finekarts staff decide when this step is done (nothing blocks them). */
  manual?: boolean;
};

/** STAGE 1, buyer portal: Finekarts is the supplier. The client's own steps (2026-11-28). */
const BUYER_STEPS: StepDef[] = [
  {
    n: 1, key: "sco_fco", title: "SCO or FCO, the offer",
    admin: "Finekarts issues the SCO or FCO: the offer. It carries the trade procedure, the same steps as this workflow, so the buyer knows every step.",
    buyer: "The buyer reviews the terms of the offer.",
    types: [{ value: "sco", label: "SCO" }, { value: "fco", label: "FCO" }],
  },
  {
    n: 2, key: "icpo", title: "The buyer submits the ICPO",
    admin: "Receive and review the ICPO. It is the buyer's irrevocable purchase order.",
    buyer: "The buyer reviews and accepts the offer and submits the ICPO, an irrevocable purchase order (PO).",
    types: [{ value: "icpo", label: "ICPO" }, { value: "loi", label: "LOI" }],
  },
  {
    n: 3, key: "verification", title: "Verification documents: CIS, RWA and FIS", manual: true,
    admin: "Finekarts formally requests the verification documents. Review the CIS, RWA and FIS, then mark this step done. A missing document is your call and never blocks the transaction.",
    buyer: "The buyer already knows from the offer and complies by uploading the CIS, RWA and FIS.",
    types: [{ value: "cis", label: "CIS" }, { value: "rwa", label: "RWA" }, { value: "fis", label: "FIS" }],
  },
  {
    n: 4, key: "psa_prepare", title: "Finekarts prepares the PSA",
    admin: "If you are satisfied with the verification, use the buyer's ICPO to prepare the PSA (Documents tab).",
    buyer: "Finekarts reviews the verification documents and prepares the purchase and sales agreement (PSA) from the buyer's ICPO.",
    types: [{ value: "spa", label: "PSA / SPA" }, { value: "proposed_lc_wording", label: "LC wording" }],
  },
  {
    n: 5, key: "psa_lc", title: "PSA and LC wording sent; the buyer signs and returns the PSA",
    admin: "Send the PSA together with the LC wording to the buyer for review and approval.",
    buyer: "The buyer reviews. If it matches the purchase order, the buyer signs the PSA, stamps it, attaches a copy of the passport and sends it back. If there are discrepancies, the buyer requests changes or an amendment.",
    types: [{ value: "passport_copy", label: "Passport copy" }],
  },
  {
    n: 6, key: "finekarts_sign", title: "Finekarts signs the PSA: it becomes a full contract",
    admin: "You receive the signed PSA. Sign it, stamp it and attach a copy of the director's passport. Both parties have now signed: it is a full contract.",
    buyer: "The buyer waits for the fully signed contract.",
    types: [{ value: "passport_copy", label: "Passport copy" }],
  },
  {
    n: 7, key: "contract_copy", title: "Final copy of the contract with the Proforma Invoice",
    admin: "Send a final copy of the contract (the PSA) to the buyer together with the Proforma Invoice. It goes out automatically when you counter-sign if the Proforma is approved.",
    buyer: "The buyer receives the contract and the Proforma Invoice and opens the LC account within 48 business hours (the deadline can be negotiated).",
    types: [{ value: "proforma_invoice", label: "Proforma Invoice" }],
  },
  {
    n: 8, key: "amendments", title: "Amendments, as many as needed",
    admin: "Amendments can be requested at any time and there can be several. The buyer's inspection request is granted at the loading port and the report is provided in stage 2.",
    buyer: "The buyer can request an amendment at any time. The bank sets the amendment fee.",
    types: [
      { value: "contract_amendment", label: "Amendment" },
      { value: "letter_of_credit", label: "Letter of Credit (the real LC)" },
      { value: "commercial_invoice", label: "Commercial Invoice" },
      { value: "other", label: "Other document" },
    ],
  },
];

/** STAGE 2, supplier portal: Finekarts is the buyer and completes the purchase order of stage 1. */
const SUPPLIER_STEPS: StepDef[] = [
  {
    n: 1, key: "supplier_sco_fco", title: "The supplier's SCO or FCO",
    admin: "Finekarts receives the SCO or FCO from the supplier, or the opportunity is discussed by chat, message, email or WhatsApp. Review it and decide whether to proceed.",
    buyer: "The supplier sends the offer.",
    types: [{ value: "sco", label: "SCO" }, { value: "fco", label: "FCO" }],
  },
  {
    n: 2, key: "finekarts_icpo", title: "Finekarts submits its ICPO",
    admin: "Submit the ICPO to the supplier. It is the purchase order that completes the purchase order of stage 1: the buyer's ICPO, with only the company name different.",
    buyer: "The supplier receives Finekarts' ICPO.",
    types: [{ value: "icpo", label: "ICPO" }, { value: "loi", label: "LOI" }],
  },
  {
    n: 3, key: "supplier_verification", title: "Verification documents: CIS, RWA and FIS", manual: true,
    admin: "Upload the CIS, RWA and FIS the supplier asked for, and any other document the supplier requests. Then mark this step done.",
    buyer: "The supplier asks Finekarts for the verification documents.",
    types: [{ value: "cis", label: "CIS" }, { value: "rwa", label: "RWA" }, { value: "fis", label: "FIS" }, { value: "other", label: "Other document the supplier asks for" }],
  },
  {
    n: 4, key: "supplier_psa_lc", title: "The supplier prepares the PSA",
    admin: "Receive the PSA and the LC wording. The PSA must use the terms, conditions and product specification of the purchase order.",
    buyer: "The supplier prepares the PSA from the purchase order, with the LC wording, and sends it to Finekarts.",
    types: [{ value: "spa", label: "PSA / SPA" }, { value: "proposed_lc_wording", label: "LC wording" }],
  },
  {
    n: 5, key: "finekarts_sign", title: "Finekarts reviews, signs and returns the PSA",
    admin: "Review the PSA, sign it, stamp it, attach a copy of the director's passport and return it to the supplier.",
    buyer: "The supplier receives the PSA signed by Finekarts.",
    types: [{ value: "passport_copy", label: "Passport copy" }],
  },
  {
    n: 6, key: "supplier_sign", title: "The supplier signs: the contract is complete, with the Proforma Invoice",
    admin: "The supplier signs, stamps and attaches a copy of the director's passport. The contract is complete on the supplier's side. Receive the contract with the Proforma Invoice.",
    buyer: "The supplier sends the contract to Finekarts together with a Proforma Invoice.",
    types: [{ value: "spa", label: "PSA / SPA" }, { value: "proforma_invoice", label: "Proforma Invoice" }],
  },
  {
    n: 7, key: "contract_check", title: "Finekarts checks the contract and opens the LC account", manual: true,
    admin: "Check that the full contract matches the purchase order, with no amendment needed. Take all the paperwork and the Proforma Invoice to your bank to create the LC account, then mark this step done.",
    buyer: "The supplier waits for the LC.",
    types: [{ value: "other", label: "Bank document" }],
  },
  {
    n: 8, key: "lc_to_supplier", title: "Finekarts sends the LC to the supplier", manual: true,
    admin: "Send the LC to the supplier as agreed in the PSA. The supplier then provides all the trade documents requested by the buyer's ICPO in stage 1. Mark this step done when the LC has been sent.",
    buyer: "The supplier receives the LC and provides the trade documents.",
    types: [{ value: "letter_of_credit", label: "Letter of Credit (the real LC)" }, { value: "other", label: "Other document" }],
  },
  {
    n: 9, key: "trade_documents", title: "Documents, banking advisor review and final payment", manual: true,
    admin: "Collect all documents from the supplier with your due diligence, the inspection report, the verification report, the certificates, the Bill of Lading and the commercial invoice, for the banking advisor. After the review, your bank sends the contract and all documents requested by the buyer to the buyer's bank, which checks them against the pre-order inspection and pays the full contract amount by MT103. Mark this step done at that point.",
    buyer: "The supplier provides the documents. The documents process repeats monthly for the duration of the contract.",
    types: [{ value: "commercial_invoice", label: "Commercial Invoice" }, { value: "other", label: "Shipping, certificate or inspection document" }],
  },
];

/** Document types an external supplier may upload (mirrors the server rule). */
const SUPPLIER_EXTERNAL_UPLOAD = ["sco", "fco", "spa", "proposed_lc_wording", "proforma_invoice", "passport_copy", "loi", "other"];

/** The step a document is shown under. */
function stepOfDocument(d: Doc, variant: Variant): number {
  const type = d.documentType ?? "";
  const sent = ["sent", "viewed"].includes(d.workflowStatus);
  const signed = d.workflowStatus === "signed";
  if (variant === "supplier") {
    if (type === "sco" || type === "fco") return 1;
    if (type === "icpo" || type === "loi") return 2;
    if (["cis", "rwa", "fis"].includes(type)) return 3;
    if (type === "spa") return signed ? 6 : 4;
    if (type === "proposed_lc_wording") return 4;
    if (type === "passport_copy") return 5;
    if (type === "proforma_invoice") return 6;
    if (type === "letter_of_credit") return 8;
    return 9;
  }
  if (type === "sco" || type === "fco") return 1;
  if (type === "icpo" || type === "loi") return 2;
  if (["cis", "rwa", "fis"].includes(type)) return 3;
  if (type === "spa") return signed ? 6 : sent ? 5 : 4;
  if (type === "proposed_lc_wording") return sent ? 5 : 4;
  if (type === "passport_copy") return 5;
  if (type === "proforma_invoice") return 7;
  return 8;
}

function docsForStep(step: StepDef, documents: Doc[], variant: Variant): Doc[] {
  return documents.filter((d) => stepOfDocument(d, variant) === step.n);
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
  workflowSteps,
}: {
  transactionId: string;
  documents: Doc[];
  isLocked: boolean;
  onChanged: () => void;
  onOpenDocuments: () => void;
  variant?: Variant;
  /** External users (a supplier) see only the types they may upload and no staff shortcuts. */
  isStaff?: boolean;
  /** The transaction's own workflow steps, so each step shows its real status. */
  workflowSteps?: { key: string; status: string }[];
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

  /** Staff decide that a review step is done, or skip it with a written reason. */
  async function finishStep(key: string, action: "complete" | "skip") {
    let reason: string | undefined;
    if (action === "skip") {
      reason = window.prompt("Why is this step skipped? (a short written reason, at least 8 characters)") ?? "";
      if (reason.trim().length < 8) return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/transactions/${transactionId}/steps/${key}`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to update the step.");
      setMessage(action === "skip" ? "Step skipped." : "Step marked as done.");
      onChanged();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Unable to update the step.");
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
        {variant === "supplier" ? "Stage 2, the supplier portal: Finekarts is the buyer. The nine steps that complete the purchase order of stage 1." : "Stage 1, the buyer portal: Finekarts is the supplier. The eight steps of the workflow, the same ones the buyer reads as the trade procedure in the SCO or FCO."} At each step you can upload and download documents.
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
          const engine = workflowSteps?.find((w) => w.key === step.key)?.status;
          const done = engine ? ["completed", "skipped"].includes(engine) : stepDone(docs);
          const badge = engine
            ? done ? (engine === "skipped" ? "Skipped" : "Done") : ["in_progress", "submitted", "approved", "ready"].includes(engine) ? "In progress" : "Waiting"
            : done ? "Done" : docs.length ? "In progress" : "Waiting";
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
                  {badge}
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
                  {isStaff && step.manual && engine && !done && !isLocked ? (
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className="btn btn-primary text-xs" disabled={busy} onClick={() => finishStep(step.key, "complete")}>
                        Mark this step done
                      </button>
                      <button type="button" className="btn text-xs" disabled={busy} onClick={() => finishStep(step.key, "skip")}>
                        Skip with a reason
                      </button>
                    </div>
                  ) : null}
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
