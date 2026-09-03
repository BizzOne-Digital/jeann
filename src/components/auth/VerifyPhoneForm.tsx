"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export function VerifyPhoneForm() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function sendCode(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/verify-phone", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ phone }),
      });
      const data = (await res.json()) as { ok?: boolean; devCode?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Unable to send code.");
      setStep("code");
      setMessage(
        data.devCode
          ? `Development mode: your code is ${data.devCode}`
          : "Verification code sent to your phone.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/verify-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ code }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Invalid code.");
      setMessage("Phone verified successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-md">
      {step === "phone" ? (
        <form onSubmit={sendCode} className="space-y-4">
          <label className="label block">
            <span>Mobile number</span>
            <input
              className="field mt-1"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555 000 0000"
              required
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "Sending…" : "Send verification code"}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyCode} className="space-y-4">
          <label className="label block">
            <span>Verification code</span>
            <input
              className="field mt-1"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="6-digit code"
              required
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "Verifying…" : "Verify code"}
          </button>
        </form>
      )}
      {message ? <p className="mt-4 text-sm text-[var(--forest)]">{message}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      <p className="mt-6 text-sm text-[var(--stone)]">
        Return to{" "}
        <Link href="/portal/buyer/onboarding" className="font-semibold text-[var(--navy)] underline">
          onboarding
        </Link>
        .
      </p>
    </div>
  );
}
