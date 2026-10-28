"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type Channel = "phone" | "email";

type VerifyResponse = {
  ok?: boolean;
  error?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  primaryVerified?: boolean;
  message?: string;
  devCode?: string;
};

export function VerifyAccountForm({
  initialEmail = "",
  smsEnabled,
}: {
  initialEmail?: string;
  smsEnabled: boolean;
}) {
  const [email, setEmail] = useState(initialEmail);
  const [codes, setCodes] = useState<Record<Channel, string>>({ phone: "", email: "" });
  const [done, setDone] = useState<Record<Channel, boolean>>({ phone: false, email: false });
  const [busy, setBusy] = useState<Channel | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function post(url: string, payload: Record<string, string>): Promise<VerifyResponse> {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(payload),
    });
    let data: VerifyResponse = {};
    try {
      data = (await res.json()) as VerifyResponse;
    } catch {
      // empty body
    }
    if (!res.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
    return data;
  }

  async function verify(channel: Channel, e: FormEvent) {
    e.preventDefault();
    setBusy(channel);
    setError(null);
    setMessage(null);
    try {
      const data = await post("/api/auth/verify-code", {
        email: email.trim(),
        channel,
        code: codes[channel].trim(),
      });
      setDone((current) => ({
        phone: current.phone || Boolean(data.phoneVerified),
        email: current.email || Boolean(data.emailVerified),
      }));
      setMessage(
        channel === "phone"
          ? "Phone verified. Now confirm your company email below."
          : "Company email verified.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to verify the code.");
    } finally {
      setBusy(null);
    }
  }

  async function resend(channel: Channel) {
    setBusy(channel);
    setError(null);
    setMessage(null);
    try {
      const data = await post("/api/auth/resend-code", { email: email.trim(), channel });
      setMessage(
        data.devCode
          ? `${data.message} Development code: ${data.devCode}`
          : (data.message ?? "A new code was sent."),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send a new code.");
    } finally {
      setBusy(null);
    }
  }

  const allDone = smsEnabled ? done.phone : done.email;

  function codeBlock(channel: Channel, title: string, hint: string) {
    const complete = done[channel];
    return (
      <form onSubmit={(e) => verify(channel, e)} className="space-y-3 rounded-lg border border-[var(--line)] p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-[var(--navy)]">{title}</h2>
          {complete ? <span className="text-sm font-semibold text-[var(--forest)]">Verified</span> : null}
        </div>
        <p className="text-sm text-[var(--stone)]">{hint}</p>
        {complete ? null : (
          <>
            <input
              className="field"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="6-digit code"
              value={codes[channel]}
              onChange={(e) => setCodes({ ...codes, [channel]: e.target.value })}
              required
            />
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" className="btn btn-primary" disabled={busy !== null || !email.trim()}>
                {busy === channel ? "Please wait…" : "Verify code"}
              </button>
              <button
                type="button"
                className="text-sm font-semibold text-[var(--navy)] underline"
                disabled={busy !== null || !email.trim()}
                onClick={() => resend(channel)}
              >
                Send a new code
              </button>
            </div>
          </>
        )}
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <label className="label block">
        <span>Company email used at registration</span>
        <input
          className="field mt-1"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      {smsEnabled
        ? codeBlock(
            "phone",
            "Step 1 – Phone code (primary)",
            "Enter the code we sent by SMS to the mobile number you registered.",
          )
        : null}
      {codeBlock(
        "email",
        smsEnabled ? "Step 2 – Company email code (secondary)" : "Company email code",
        "Enter the code we sent to your company email. Check your spam folder if you do not see it.",
      )}

      {message ? <p className="text-sm text-[var(--forest)]">{message}</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      {allDone ? (
        <p className="rounded-md border border-[var(--line)] bg-[var(--cream)] px-4 py-3 text-sm text-[var(--ink)]">
          Verification complete.{" "}
          <Link href="/login" className="font-semibold text-[var(--navy)] underline">
            Sign in to continue
          </Link>{" "}
          to your buyer onboarding.
        </p>
      ) : null}
    </div>
  );
}
