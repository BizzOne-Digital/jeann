"use client";

import { FormEvent, useState } from "react";

type Doc = {
  id: string;
  title: string;
  documentType?: string;
  workflowStatus: string;
  currentVersionId?: string | null;
};

const UPLOAD_TYPES = [
  { value: "loi", label: "Letter of Intent (LOI)" },
  { value: "icpo", label: "ICPO" },
  { value: "spa", label: "SPA / PSA" },
  { value: "proposed_lc_wording", label: "LC wording" },
  { value: "proforma_invoice", label: "Proforma invoice" },
  { value: "passport_copy", label: "Passport copy (signer)" },
  { value: "rwa", label: "RWA - Ready, Willing and Able letter (from your bank)" },
  { value: "other", label: "Passport / other signer document" },
];

export function TransactionDocumentsPanel({
  transactionId,
  documents,
  canUpload = true,
  onUploaded,
  mode = "buyer",
  isStaff = false,
}: {
  transactionId: string;
  documents: Doc[];
  canUpload?: boolean;
  onUploaded?: () => void;
  mode?: "buyer" | "supplier";
  isStaff?: boolean;
}) {
  const uploadTypes = UPLOAD_TYPES.filter((t) =>
    isStaff
      ? true
      : mode === "buyer"
        ? ["icpo", "loi", "passport_copy", "rwa", "other"].includes(t.value)
        : t.value !== "icpo",
  );
  const [signDocId, setSignDocId] = useState<string | null>(null);
  const [signerName, setSignerName] = useState("");

  async function signAndReturn(e: FormEvent<HTMLFormElement>, d: Doc) {
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
      setMessage("Signed copy returned. Remember a passport copy of the signer must be uploaded first.");
      setSignDocId(null);
      onUploaded?.();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Signing failed.");
    } finally {
      setBusy(false);
    }
  }
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [docType, setDocType] = useState("icpo");
  const [title, setTitle] = useState("");

  async function download(docId: string) {
    const res = await fetch(
      `/api/transactions/${transactionId}/documents/${docId}/download`,
      { credentials: "same-origin" },
    );
    const json = await res.json();
    if (!res.ok || !json.url) {
      setMessage(json.error ?? "Download failed.");
      return;
    }
    window.open(json.url, "_blank", "noopener,noreferrer");
  }

  async function onUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canUpload) return;
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) return;

    setBusy(true);
    setMessage(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("documentType", docType);
      body.append("title", title || UPLOAD_TYPES.find((t) => t.value === docType)?.label || "Document");
      body.append("submitForReview", "true");

      const res = await fetch(`/api/transactions/${transactionId}/documents/upload`, {
        method: "POST",
        credentials: "same-origin",
        body,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      setMessage("Document uploaded and submitted for review.");
      form.reset();
      onUploaded?.();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-lg border border-[var(--line)] bg-white p-5">
      <h2 className="font-semibold text-[var(--navy)]">Documents</h2>
      <p className="mt-1 text-xs text-[var(--stone)]">
        Upload PDF or accepted formats. Each document is stored separately and audited.
      </p>

      {documents.length === 0 ? (
        <p className="mt-3 text-sm text-[var(--stone)]">No documents yet.</p>
      ) : (
        <ul className="mt-3 divide-y divide-[var(--line)] text-sm">
          {documents.map((d) => (
            <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
              <div>
                <p className="font-medium text-[var(--navy)]">{d.title}</p>
                <p className="text-xs text-[var(--stone)]">
                  {d.documentType ?? "document"} · {d.workflowStatus.replaceAll("_", " ")}
                </p>
              </div>
              <div className="flex gap-2">
                {!isStaff && d.documentType === "spa" && ["sent", "approved"].includes(d.workflowStatus) ? (
                  <button type="button" className="btn text-xs" onClick={() => setSignDocId(d.id)}>
                    Sign and return
                  </button>
                ) : null}
                <button type="button" className="btn text-xs" onClick={() => download(d.id)}>
                  Download
                </button>
              </div>
              {signDocId === d.id ? (
                <form onSubmit={(e) => signAndReturn(e, d)} className="w-full space-y-2 pt-2">
                  <p className="text-xs text-[var(--stone)]">
                    Upload the signed and stamped PDF. A passport copy of the signer must already be
                    uploaded (type: Passport copy).
                  </p>
                  <input
                    className="field"
                    placeholder="Signatory full name"
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    required
                  />
                  <input className="field text-sm" name="signedFile" type="file" accept=".pdf,.png,.jpg,.jpeg" required />
                  <button className="btn btn-primary" type="submit" disabled={busy}>
                    Submit signed copy
                  </button>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      {canUpload ? (
        <form onSubmit={onUpload} className="mt-5 space-y-3 border-t border-[var(--line)] pt-4">
          <p className="text-sm font-medium text-[var(--navy)]">Upload document</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="label text-xs">
              Type
              <select
                className="field mt-1"
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
              >
                {uploadTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="label text-xs">
              Title (optional)
              <input
                className="field mt-1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. ICPO — Sunflower oil"
              />
            </label>
          </div>
          <input className="field text-sm" name="file" type="file" accept=".pdf,.png,.jpg,.jpeg" required />
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? "Uploading…" : "Upload & submit"}
          </button>
        </form>
      ) : null}

      {message ? <p className="mt-3 text-sm text-[var(--stone)]">{message}</p> : null}
    </section>
  );
}
