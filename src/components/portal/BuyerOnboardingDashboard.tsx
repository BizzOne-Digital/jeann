"use client";

import { useState } from "react";

type Step = {
  key: string;
  label: string;
  complete: boolean;
  required: boolean;
};

type Props = {
  organizationId: string;
  organizationName: string;
  orgStatus: string;
  onboardingStatus: string;
  verificationNotes?: string;
  steps: Step[];
  canTrade: boolean;
  cisStatus?: string;
  reviewComments?: string;
};

export function BuyerOnboardingDashboard({
  organizationId,
  organizationName,
  orgStatus,
  onboardingStatus,
  verificationNotes,
  steps,
  canTrade,
  cisStatus,
  reviewComments,
}: Props) {
  const [emailCode, setEmailCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function resendEmail() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/verify-email", { method: "PUT" });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Could not send code.");
      return;
    }
    setMessage(data.devCode ? `Dev code: ${data.devCode}` : "Verification email sent.");
  }

  async function verifyEmail() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: emailCode }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Invalid code.");
      return;
    }
    setMessage("Email verified. Refresh to update your progress.");
  }

  async function verifyPhone() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/verify-phone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: phoneCode }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Invalid code.");
      return;
    }
    setMessage("Phone verified.");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--navy)]">Buyer onboarding</h1>
        <p className="mt-2 text-sm text-[var(--stone)]">
          Complete verification and CIS/KYB for {organizationName}. Trading functions unlock after
          admin approval.
        </p>
        <p className="mt-1 text-xs capitalize text-[var(--stone)]">
          Status: {orgStatus} / {onboardingStatus.replace(/_/g, " ")}
        </p>
      </div>

      {canTrade && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900">
          Your organization is approved. Full portal features are available.
        </div>
      )}

      {(reviewComments || verificationNotes) && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Admin feedback:</strong> {reviewComments || verificationNotes}
        </div>
      )}

      <ul className="space-y-3">
        {steps.map((step) => (
          <li
            key={step.key}
            className="flex items-center justify-between rounded-lg border border-[var(--line)] bg-white px-4 py-3"
          >
            <span className="text-sm text-[var(--navy)]">{step.label}</span>
            <span
              className={`text-xs font-medium ${step.complete ? "text-green-700" : "text-[var(--stone)]"}`}
            >
              {step.complete ? "Complete" : step.required ? "Required" : "Optional"}
            </span>
          </li>
        ))}
      </ul>

      {!steps.find((s) => s.key === "email_verification")?.complete && (
        <div className="rounded-lg border border-[var(--line)] bg-white p-4 space-y-3">
          <h2 className="font-medium text-[var(--navy)]">Verify email</h2>
          <button type="button" className="btn btn-secondary text-sm" disabled={loading} onClick={resendEmail}>
            Send code
          </button>
          <input
            className="input w-full max-w-xs"
            placeholder="6-digit code"
            value={emailCode}
            onChange={(e) => setEmailCode(e.target.value)}
          />
          <button type="button" className="btn btn-primary text-sm" disabled={loading} onClick={verifyEmail}>
            Confirm email
          </button>
        </div>
      )}

      {steps.find((s) => s.key === "phone_verification")?.required &&
        !steps.find((s) => s.key === "phone_verification")?.complete && (
          <div className="rounded-lg border border-[var(--line)] bg-white p-4 space-y-3">
            <h2 className="font-medium text-[var(--navy)]">Verify phone</h2>
            <input
              className="input w-full max-w-xs"
              placeholder="6-digit code"
              value={phoneCode}
              onChange={(e) => setPhoneCode(e.target.value)}
            />
            <button type="button" className="btn btn-primary text-sm" disabled={loading} onClick={verifyPhone}>
              Confirm phone
            </button>
          </div>
        )}

      <div className="rounded-lg border border-[var(--line)] bg-white p-4">
        <h2 className="font-medium text-[var(--navy)]">CIS/KYB</h2>
        <p className="mt-1 text-sm text-[var(--stone)]">
          Current submission: {cisStatus ?? "not started"}
        </p>
        <a href="/portal/buyer/cis" className="btn btn-primary mt-4 inline-flex text-sm">
          {cisStatus === "changes_requested" ? "Revise CIS/KYB" : "Complete CIS/KYB"}
        </a>
      </div>

      {message && <p className="text-sm text-green-700">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <input type="hidden" value={organizationId} readOnly />
    </div>
  );
}
