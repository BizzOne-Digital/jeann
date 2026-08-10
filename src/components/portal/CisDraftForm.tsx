"use client";

import { useState } from "react";

type CisFormProps = {
  initial: {
    legalName: string;
    registrationNumber: string;
    registeredAddress: string;
    authorizedRepresentative: string;
    status: string;
  };
};

export function CisDraftForm({ initial }: CisFormProps) {
  const [legalName, setLegalName] = useState(initial.legalName);
  const [registrationNumber, setRegistrationNumber] = useState(initial.registrationNumber);
  const [registeredAddress, setRegisteredAddress] = useState(initial.registeredAddress);
  const [authorizedRepresentative, setAuthorizedRepresentative] = useState(
    initial.authorizedRepresentative,
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

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
          registeredAddress,
          authorizedRepresentative,
        }),
      });
      const body = (await res.json()) as { error?: string; ok?: boolean };
      if (!res.ok) {
        setError(body.error || "Unable to save CIS draft.");
        return;
      }
      setMessage("CIS draft saved. Finekarts will review after you submit a purchase request.");
    } catch {
      setError("Unable to save CIS draft.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="grid gap-4 rounded-lg border border-[var(--line)] bg-white p-5 md:grid-cols-2" onSubmit={onSubmit}>
      <p className="md:col-span-2 text-sm text-[var(--stone)]">
        Status: <span className="font-medium text-[var(--navy)]">{initial.status}</span>
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
        Authorized representative
        <input
          className="field mt-1"
          value={authorizedRepresentative}
          onChange={(e) => setAuthorizedRepresentative(e.target.value)}
          required
        />
      </label>
      {error ? <p className="md:col-span-2 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="md:col-span-2 text-sm text-emerald-800">{message}</p> : null}
      <button className="btn btn-primary w-fit md:col-span-2" type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save draft"}
      </button>
    </form>
  );
}
