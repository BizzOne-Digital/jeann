"use client";

import { useState } from "react";

type CisFormProps = {
  initial: {
    legalName: string;
    registrationNumber: string;
    taxId: string;
    previousHsCode: string;
    registeredAddress: string;
    authorizedRepresentative: string;
    managerPhone: string;
    status: string;
  };
};

export function CisDraftForm({ initial }: CisFormProps) {
  const [legalName, setLegalName] = useState(initial.legalName);
  const [registrationNumber, setRegistrationNumber] = useState(initial.registrationNumber);
  const [taxId, setTaxId] = useState(initial.taxId);
  const [previousHsCode, setPreviousHsCode] = useState(initial.previousHsCode);
  const [registeredAddress, setRegisteredAddress] = useState(initial.registeredAddress);
  const [authorizedRepresentative, setAuthorizedRepresentative] = useState(
    initial.authorizedRepresentative,
  );
  const [managerPhone, setManagerPhone] = useState(initial.managerPhone);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState(initial.status);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/portal/buyer/cis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          legalName,
          registrationNumber,
          taxId,
          previousHsCode,
          registeredAddress,
          authorizedRepresentative,
          managerPhone,
        }),
      });
      const body = (await res.json()) as { error?: string; ok?: boolean };
      if (!res.ok) {
        setError(body.error || "Unable to save the company profile draft.");
        return;
      }
      setStatus("draft");
      setMessage("Draft saved. When the details are correct, press \"Submit for approval\".");
    } catch {
      setError("Unable to save the company profile draft.");
    } finally {
      setPending(false);
    }
  }

  async function submitForApproval() {
    setPending(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/portal/buyer/cis/submit", { method: "POST" });
      const body = (await res.json()) as { error?: string; emailSent?: boolean };
      if (!res.ok) {
        setError(body.error || "Unable to submit the company profile.");
        return;
      }
      setStatus("submitted");
      setMessage(
        body.emailSent === false
          ? "Submitted, but the notification email could not be sent. Finekarts can still see your submission in the admin."
          : "Submitted. Finekarts will review your company profile and approve your buyer account.",
      );
    } catch {
      setError("Unable to submit the company profile.");
    } finally {
      setPending(false);
    }
  }

  const locked = !["draft", "changes_requested"].includes(status);
  const statusText: Record<string, string> = {
    draft: "Draft (not yet submitted)",
    submitted: "Submitted, waiting for Finekarts review",
    resubmitted: "Resubmitted, waiting for Finekarts review",
    under_review: "Under review by Finekarts",
    changes_requested: "Changes requested, please update and submit again",
    approved: "Approved",
    rejected: "Rejected",
  };

  return (
    <form className="grid gap-4 rounded-lg border border-[var(--line)] bg-white p-5 md:grid-cols-2" onSubmit={onSubmit}>
      <p className="md:col-span-2 text-sm text-[var(--stone)]">
        Status: <span className="font-medium text-[var(--navy)]">{statusText[status] ?? status}</span>
      </p>
      <label className="label">
        Legal entity
        <input
          className="field mt-1"
          value={legalName}
          onChange={(e) => setLegalName(e.target.value)}
          required
        />
      </label>
      <label className="label">
        Registration number
        <input
          className="field mt-1"
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
          required
        />
      </label>
      <label className="label">
        Tax number
        <input className="field mt-1" value={taxId} onChange={(e) => setTaxId(e.target.value)} required />
      </label>
      <label className="label">
        Previous HS code(s)
        <input
          className="field mt-1"
          value={previousHsCode}
          onChange={(e) => setPreviousHsCode(e.target.value)}
          required
        />
      </label>
      <label className="label md:col-span-2">
        Registered address
        <input
          className="field mt-1"
          value={registeredAddress}
          onChange={(e) => setRegisteredAddress(e.target.value)}
          required
        />
      </label>
      <label className="label md:col-span-2">
        Manager / authorized representative
        <input
          className="field mt-1"
          value={authorizedRepresentative}
          onChange={(e) => setAuthorizedRepresentative(e.target.value)}
          required
        />
      </label>
      <label className="label md:col-span-2">
        Manager contact (WhatsApp preferred)
        <input
          className="field mt-1"
          value={managerPhone}
          onChange={(e) => setManagerPhone(e.target.value)}
          required
        />
      </label>
      {error ? <p className="md:col-span-2 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="md:col-span-2 text-sm text-emerald-800">{message}</p> : null}
      {!locked ? (
        <div className="flex flex-wrap gap-3 md:col-span-2">
          <button className="btn w-fit border border-[var(--line)]" type="submit" disabled={pending}>
            {pending ? "Please wait…" : "Save draft"}
          </button>
          <button className="btn btn-primary w-fit" type="button" disabled={pending} onClick={submitForApproval}>
            Submit for approval
          </button>
        </div>
      ) : null}
    </form>
  );
}
