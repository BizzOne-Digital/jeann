"use client";

import { FormEvent, useState } from "react";

/** The agent submits the end buyer's LOI or ICPO. The agent does not sign; the buyer signs. */
export function AgentDealForm() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/portal/agent/deals", {
        method: "POST",
        body: new FormData(form),
        credentials: "same-origin",
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; reference?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not submit. Please try again.");
      setMessage(`Submitted. Your reference is ${data.reference}. Finekarts will review it.`);
      form.reset();
      window.setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-lg border border-[var(--line)] bg-white p-5 md:grid-cols-2">
      <p className="text-sm text-[var(--stone)] md:col-span-2">
        Submit the end buyer&apos;s LOI or ICPO. You pass documents between Finekarts and the buyer. The buyer signs, not
        the agent.
      </p>
      <label className="label">
        <span>Buyer company</span>
        <input className="field mt-1" name="buyerCompanyName" required minLength={2} maxLength={200} />
      </label>
      <label className="label">
        <span>Buyer contact name</span>
        <input className="field mt-1" name="buyerContactName" maxLength={120} />
      </label>
      <label className="label">
        <span>Buyer email</span>
        <input className="field mt-1" name="buyerEmail" type="email" maxLength={254} />
      </label>
      <label className="label">
        <span>Buyer phone</span>
        <input className="field mt-1" name="buyerPhone" maxLength={40} />
      </label>
      <label className="label">
        <span>Buyer country</span>
        <input className="field mt-1" name="buyerCountry" maxLength={120} />
      </label>
      <label className="label">
        <span>Product</span>
        <input className="field mt-1" name="productName" required minLength={2} maxLength={200} />
      </label>
      <label className="label">
        <span>Quantity</span>
        <input className="field mt-1" name="quantity" maxLength={80} />
      </label>
      <label className="label">
        <span>Document type</span>
        <select className="field mt-1" name="documentType" defaultValue="loi">
          <option value="loi">LOI (Letter of Intent)</option>
          <option value="icpo">ICPO</option>
        </select>
      </label>
      <label className="label md:col-span-2">
        <span>Notes for Finekarts</span>
        <textarea className="field mt-1 min-h-20" name="notes" maxLength={4000} />
      </label>
      <label className="label md:col-span-2">
        <span>LOI or ICPO file (PDF, Word or image, 10 MB maximum)</span>
        <input className="field mt-1 text-sm" name="file" type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" required />
      </label>
      <div className="md:col-span-2">
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Submitting…" : "Submit to Finekarts"}
        </button>
        {message ? <p className="mt-3 text-sm text-green-700">{message}</p> : null}
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      </div>
    </form>
  );
}
