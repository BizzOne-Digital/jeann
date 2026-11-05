"use client";

import { FormEvent, useState } from "react";

/** The buyer uploads their completed Corporate Information Sheet for Finekarts to review. */
export function CisUploadForm({ organizationId, status }: { organizationId: string; status: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const locked = ["submitted", "under_review", "approved", "resubmitted"].includes(status);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const file = new FormData(form).get("file");
    if (!(file instanceof File) || file.size === 0) {
      setError("Choose your completed CIS file first.");
      return;
    }
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const upload = new FormData();
      upload.set("file", file);
      upload.set("organizationId", organizationId);
      upload.set("documentType", "cis_form");
      const up = await fetch("/api/onboarding/documents", { method: "POST", body: upload, credentials: "same-origin" });
      const upBody = (await up.json().catch(() => ({}))) as { error?: string };
      if (!up.ok) throw new Error(upBody.error ?? "Upload failed. Please try again.");

      const submit = await fetch("/api/onboarding/cis/submit", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId }),
      });
      const subBody = (await submit.json().catch(() => ({}))) as { error?: string };
      if (!submit.ok) throw new Error(subBody.error ?? "Uploaded, but it could not be sent for review.");

      setMessage("Your Corporate Information Sheet was uploaded and sent to Finekarts for review.");
      form.reset();
      window.setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mb-6 space-y-3 rounded-lg border border-[var(--line)] bg-white p-5">
      <h2 className="text-base font-semibold text-[var(--navy)]">Upload your completed CIS</h2>
      <p className="text-sm text-[var(--stone)]">
        Download the blank form above, complete it, and upload it here (PDF or image). Finekarts reviews it; you do not
        complete anything online.
      </p>
      {locked ? (
        <p className="text-sm text-[var(--stone)]">Your CIS is with Finekarts ({status.replace(/_/g, " ")}).</p>
      ) : (
        <>
          <input className="field text-sm" name="file" type="file" accept=".pdf,.png,.jpg,.jpeg" required />
          <button type="submit" className="btn btn-primary text-sm" disabled={busy}>
            {busy ? "Uploading…" : "Upload for review"}
          </button>
        </>
      )}
      {message ? <p className="text-sm text-green-700">{message}</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </form>
  );
}
