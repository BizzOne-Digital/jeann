"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BuyerLcDetailsForm } from "@/components/portal/BuyerLcDetailsForm";
import { RWA_DESCRIPTION } from "@/lib/banking/rwa";

export type ProcessStep = "psa" | "invoice" | "banking";

type TransactionRow = { id: string; transactionNumber: string };
type Doc = {
  id: string;
  title: string;
  documentType?: string;
  workflowStatus: string;
  currentVersionId?: string | null;
};
type StepView = { key: string; title: string; status: string };

const NON_QUALIFYING = ["changes_requested", "superseded", "archived"];

export const LC_DEADLINE_WARNING =
  "Important: once the PSA is signed and the Commercial Invoice has been issued to you, you have 72 hours to submit your LC (Banking tab).";

function Notice({ tone, children }: { tone: "info" | "warn"; children: React.ReactNode }) {
  return (
    <div
      className={`rounded-md border px-4 py-3 text-sm ${
        tone === "warn"
          ? "border-amber-300 bg-amber-50 text-amber-900"
          : "border-[var(--line)] bg-[var(--cream)] text-[var(--stone)]"
      }`}
    >
      {children}
    </div>
  );
}

function NextStep({ text, label, onNext }: { text: string; label: string; onNext?: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-4 text-sm">
      <p className="text-[var(--stone)]">
        <strong className="text-[var(--navy)]">Next step:</strong> {text}
      </p>
      {onNext ? (
        <button type="button" className="btn text-sm" onClick={onNext}>
          {label}
        </button>
      ) : null}
    </div>
  );
}

export function BuyerProcessPanel({
  step,
  onNext,
}: {
  step: ProcessStep;
  onNext?: () => void;
}) {
  const [transactions, setTransactions] = useState<TransactionRow[] | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [steps, setSteps] = useState<StepView[]>([]);
  const [reloadKey, setReloadKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [signDocId, setSignDocId] = useState<string | null>(null);
  const [signerName, setSignerName] = useState("");
  const passportInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetch("/api/portal/buyer/transactions", { credentials: "same-origin" })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Unable to load transactions.");
        const items: TransactionRow[] = json.items ?? [];
        setTransactions(items);
        if (items[0]?.id) setTransactionId(items[0].id);
      })
      .catch((e) => {
        setTransactions([]);
        setError(e instanceof Error ? e.message : "Unable to load transactions.");
      });
  }, []);

  useEffect(() => {
    if (!transactionId) return;
    let cancelled = false;
    fetch(`/api/portal/buyer/transactions/${transactionId}`, { credentials: "same-origin" })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Unable to load documents.");
        if (cancelled) return;
        setDocuments(json.documents ?? []);
        setSteps(json.workflowSteps ?? []);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Unable to load documents.");
      });
    return () => {
      cancelled = true;
    };
  }, [transactionId, reloadKey]);

  const reload = () => setReloadKey((k) => k + 1);

  async function download(docId: string) {
    setError(null);
    const res = await fetch(`/api/transactions/${transactionId}/documents/${docId}/download`, {
      credentials: "same-origin",
    });
    const json = await res.json();
    if (!res.ok || !json.url) {
      setError(json.error ?? "Download failed.");
      return;
    }
    window.open(json.url, "_blank", "noopener,noreferrer");
  }

  async function uploadPassport(file: File) {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("documentType", "passport_copy");
      body.append("title", "Passport copy (signer)");
      body.append("submitForReview", "true");
      const res = await fetch(`/api/transactions/${transactionId}/documents/upload`, {
        method: "POST",
        credentials: "same-origin",
        body,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed.");
      setMessage("Passport copy uploaded.");
      reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (passportInput.current) passportInput.current.value = "";
    }
  }

  async function signAndReturn(e: FormEvent<HTMLFormElement>, d: Doc) {
    e.preventDefault();
    const file = (e.currentTarget.elements.namedItem("signedFile") as HTMLInputElement).files?.[0];
    if (!file || !d.currentVersionId || !signerName.trim()) return;
    setBusy(true);
    setError(null);
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
      if (!res.ok) throw new Error(json.error ?? "Signing failed.");
      setMessage("Signed and stamped PSA returned to Finekarts.");
      setSignDocId(null);
      reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signing failed.");
    } finally {
      setBusy(false);
    }
  }

  if (transactions === null) {
    return <p className="text-sm text-[var(--stone)]">Loading…</p>;
  }

  const shell = "space-y-5 rounded-lg border border-[var(--line)] bg-white p-5 sm:p-8";

  const intro = {
    psa: {
      title: "PSA - Purchase and Sale Agreement",
      lines: [
        "Finekarts sends you the PSA here after your CIS, RWA and FIS have been reviewed.",
        "Download the PSA, then sign and stamp it.",
        "Upload the signed and stamped PSA together with a passport copy of the signer.",
        "Finekarts receives it, then signs and stamps it and returns the fully executed PSA.",
      ],
      next: "Commercial invoice, issued by Finekarts once the PSA is signed by both parties.",
      nextLabel: "Go to Commercial invoice",
    },
    invoice: {
      title: "Commercial invoice",
      lines: [
        "After the PSA is signed by both parties, Finekarts issues the Commercial Invoice here.",
        "Download it and give it to your bank when you arrange your LC.",
      ],
      next: "Banking. Submit your LC details within 72 hours of the invoice being issued.",
      nextLabel: "Go to Banking",
    },
    banking: {
      title: "Banking - submit your LC",
      lines: [
        "Arrange your Letter of Credit with your bank, based on the signed PSA and the Commercial Invoice.",
        "Enter the LC details below once your bank has issued or confirmed it.",
      ],
      next: "Finekarts reviews your LC and confirms the next steps for shipment.",
      nextLabel: "",
    },
  }[step];

  if (transactions.length === 0) {
    return (
      <div className={shell}>
        <h2 className="font-semibold text-[var(--navy)]">{intro.title}</h2>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-[var(--stone)]">
          {intro.lines.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ol>
        {step !== "psa" ? <Notice tone="warn">{LC_DEADLINE_WARNING}</Notice> : null}
        <Notice tone="info">
          This step opens once your ICPO or LOI has been reviewed and Finekarts has opened your
          transaction.{" "}
          <Link href="/portal/buyer/requests" className="font-semibold text-[var(--navy)] underline">
            View my requests
          </Link>
        </Notice>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
      </div>
    );
  }

  const live = documents.filter((d) => !NON_QUALIFYING.includes(d.workflowStatus));
  const hasPassport = live.some((d) => d.documentType === "passport_copy");
  const psaDocs = documents.filter((d) => d.documentType === "spa");
  const invoiceDocs = documents.filter((d) => d.documentType === "commercial_invoice");
  const stepStatus = (key: string) => steps.find((s) => s.key === key)?.status;

  return (
    <div className={shell}>
      <h2 className="font-semibold text-[var(--navy)]">{intro.title}</h2>
      <ol className="list-decimal space-y-1 pl-5 text-sm text-[var(--stone)]">
        {intro.lines.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ol>

      {step !== "psa" ? <Notice tone="warn">{LC_DEADLINE_WARNING}</Notice> : null}

      {transactions.length > 1 ? (
        <label className="label block">
          Transaction
          <select
            className="field mt-1 w-full"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
          >
            {transactions.map((t) => (
              <option key={t.id} value={t.id}>
                {t.transactionNumber}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <p className="text-sm text-[var(--stone)]">
          Transaction: <strong>{transactions[0].transactionNumber}</strong>
        </p>
      )}

      {step === "psa" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[var(--line)] p-4">
            <div className="flex gap-3">
              <span
                aria-label={hasPassport ? "Received" : "Not received"}
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                  hasPassport
                    ? "border-green-600 bg-green-600 text-white"
                    : "border-[var(--line)] bg-white text-transparent"
                }`}
              >
                ✓
              </span>
              <div>
                <p className="font-semibold text-[var(--navy)]">Passport copy of the signer</p>
                <p className="text-xs text-[var(--stone)]">
                  Upload this before you return the signed PSA.
                </p>
              </div>
            </div>
            <div>
              <input
                ref={passportInput}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void uploadPassport(f);
                }}
              />
              <button
                type="button"
                className="btn btn-primary text-sm"
                disabled={busy}
                onClick={() => passportInput.current?.click()}
              >
                {hasPassport ? "Replace passport" : "Upload passport"}
              </button>
            </div>
          </div>

          <div className="rounded-md border border-[var(--line)] p-4">
            <p className="font-semibold text-[var(--navy)]">PSA</p>
            {psaDocs.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--stone)]">
                The PSA has not been sent yet. Finekarts will send it here after your CIS, RWA and
                FIS are reviewed.
              </p>
            ) : (
              <ul className="mt-2 divide-y divide-[var(--line)] text-sm">
                {psaDocs.map((d) => (
                  <li key={d.id} className="py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-medium text-[var(--navy)]">{d.title}</p>
                        <p className="text-xs text-[var(--stone)]">
                          {d.workflowStatus.replaceAll("_", " ")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {["sent", "approved"].includes(d.workflowStatus) ? (
                          <button
                            type="button"
                            className="btn text-xs"
                            onClick={() => setSignDocId(d.id)}
                          >
                            Sign and return
                          </button>
                        ) : null}
                        <button type="button" className="btn text-xs" onClick={() => download(d.id)}>
                          Download
                        </button>
                      </div>
                    </div>
                    {signDocId === d.id ? (
                      <form onSubmit={(e) => signAndReturn(e, d)} className="mt-3 space-y-2">
                        <p className="text-xs text-[var(--stone)]">
                          Upload the signed and stamped PSA. A passport copy of the signer must
                          already be uploaded.
                        </p>
                        <input
                          className="field"
                          placeholder="Signatory full name"
                          value={signerName}
                          onChange={(e) => setSignerName(e.target.value)}
                          required
                        />
                        <input
                          className="field text-sm"
                          name="signedFile"
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          required
                        />
                        <button className="btn btn-primary" type="submit" disabled={busy}>
                          Submit signed PSA
                        </button>
                      </form>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
            {stepStatus("buyer_sign") || stepStatus("finekarts_sign") ? (
              <p className="mt-3 text-xs text-[var(--stone)]">
                Your signature: {String(stepStatus("buyer_sign") ?? "pending").replaceAll("_", " ")}.
                Finekarts counter-signature:{" "}
                {String(stepStatus("finekarts_sign") ?? "pending").replaceAll("_", " ")}.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {step === "invoice" ? (
        <div className="rounded-md border border-[var(--line)] p-4">
          <p className="font-semibold text-[var(--navy)]">Commercial invoice</p>
          {invoiceDocs.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--stone)]">
              The Commercial Invoice has not been issued yet. It appears here once the PSA is signed
              by both parties.
            </p>
          ) : (
            <ul className="mt-2 divide-y divide-[var(--line)] text-sm">
              {invoiceDocs.map((d) => (
                <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div>
                    <p className="font-medium text-[var(--navy)]">{d.title}</p>
                    <p className="text-xs text-[var(--stone)]">
                      {d.workflowStatus.replaceAll("_", " ")}
                    </p>
                  </div>
                  <button type="button" className="btn text-xs" onClick={() => download(d.id)}>
                    Download
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {step === "banking" ? (
        <div className="space-y-4">
          <Notice tone="info">{RWA_DESCRIPTION} The RWA is required on every LC transaction.</Notice>
          <BuyerLcDetailsForm transactionId={transactionId} onSaved={reload} />
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {message ? <p className="text-sm text-[var(--forest)]">{message}</p> : null}

      <NextStep text={intro.next} label={intro.nextLabel} onNext={intro.nextLabel ? onNext : undefined} />
    </div>
  );
}
