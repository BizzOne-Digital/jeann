"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type ApiBody = {
  error?: string;
  message?: string;
  redirectTo?: string;
  status?: string;
  requiresMfa?: boolean;
  mfaToken?: string;
  devCode?: string;
  issues?: {
    fieldErrors?: Record<string, string[] | undefined>;
  };
};

async function submit(path: string, values: Record<string, unknown>) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(values),
  });

  let body: ApiBody = {};
  try {
    body = (await response.json()) as ApiBody;
  } catch {
    body = { error: "Unexpected server response. Please try again." };
  }

  return { ok: response.ok, status: response.status, body };
}

function firstFieldError(body: ApiBody): string | undefined {
  const errors = body.issues?.fieldErrors;
  if (!errors) return undefined;
  for (const messages of Object.values(errors)) {
    if (messages?.[0]) return messages[0];
  }
  return undefined;
}

export function LoginForm() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [mfaStep, setMfaStep] = useState<{ mfaToken: string; devCode?: string } | null>(null);
  const [mfaCode, setMfaCode] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const form = new FormData(event.currentTarget);
      const result = await submit("/api/auth/login", {
        email: form.get("email"),
        password: form.get("password"),
      });

      if (result.ok && result.body.requiresMfa && result.body.mfaToken) {
        setMfaStep({ mfaToken: result.body.mfaToken, devCode: result.body.devCode });
        setMessage(
          result.body.devCode
            ? `Enter the verification code sent to your email. Dev code: ${result.body.devCode}`
            : "Enter the verification code sent to your email.",
        );
        return;
      }

      if (result.ok && result.body.redirectTo) {
        window.location.assign(result.body.redirectTo);
        return;
      }
      setMessage(
        result.body.error || "Unable to sign in. Check email and password, or contact support.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function onMfaSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!mfaStep) return;
    setLoading(true);
    setMessage("");
    try {
      const result = await submit("/api/auth/mfa/verify", {
        mfaToken: mfaStep.mfaToken,
        code: mfaCode.trim(),
      });
      if (result.ok && result.body.redirectTo) {
        window.location.assign(result.body.redirectTo);
        return;
      }
      setMessage(result.body.error || "Invalid or expired code. Sign in again to retry.");
      if (result.status === 401) {
        setMfaStep(null);
        setMfaCode("");
      }
    } finally {
      setLoading(false);
    }
  }

  if (mfaStep) {
    return (
      <form onSubmit={onMfaSubmit} className="space-y-4">
        <p className="text-sm text-[var(--stone)]">
          Two-step verification is required for this account. Check your email for a one-time code.
        </p>
        {mfaStep.devCode ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            Development: your code is <strong>{mfaStep.devCode}</strong> (also logged in the server
            terminal when <code className="text-[10px]">EMAIL_PROVIDER=console</code>).
          </p>
        ) : null}
        <label className="label">
          Verification code
          <input
            className="field mt-1"
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value)}
            required
            suppressHydrationWarning
          />
        </label>
        {message ? <p className="text-sm text-[var(--stone)]">{message}</p> : null}
        <button className="btn btn-primary w-full" type="submit" disabled={loading || !mfaCode.trim()}>
          {loading ? "Verifying…" : "Verify and sign in"}
        </button>
        <button
          type="button"
          className="btn w-full text-sm text-[var(--stone)]"
          onClick={() => {
            setMfaStep(null);
            setMfaCode("");
            setMessage("");
          }}
        >
          Back to sign in
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="label">
        Email
        <input
          className="field mt-1"
          name="email"
          type="email"
          autoComplete="email"
          required
          suppressHydrationWarning
        />
      </label>
      <label className="label">
        Password
        <input
          className="field mt-1"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          suppressHydrationWarning
        />
      </label>
      {message ? <p className="text-sm text-red-700">{message}</p> : null}
      <button className="btn btn-primary w-full" type="submit" disabled={loading} suppressHydrationWarning>
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export function BuyerRegistrationForm() {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const form = new FormData(event.currentTarget);
      const password = String(form.get("password") ?? "");
      const confirmPassword = String(form.get("confirmPassword") ?? "");

      if (password !== confirmPassword) {
        setIsError(true);
        setMessage("Passwords do not match.");
        return;
      }
      if (password.length < 12) {
        setIsError(true);
        setMessage("Password must be at least 12 characters.");
        return;
      }
      if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
        setIsError(true);
        setMessage("Password must include uppercase, lowercase, and a number.");
        return;
      }
      if (form.get("terms") !== "on" || form.get("privacy") !== "on") {
        setIsError(true);
        setMessage("Please accept the buyer terms and privacy notice.");
        return;
      }

      const result = await submit("/api/auth/register/buyer", {
        legalName: String(form.get("legalName") ?? "").trim(),
        contactName: String(form.get("contactName") ?? "").trim(),
        country: String(form.get("country") ?? "").trim(),
        email: String(form.get("email") ?? "").trim(),
        phone: String(form.get("phone") ?? "").trim(),
        password,
        confirmPassword,
        acceptBuyerTerms: true,
        acceptPrivacy: true,
      });

      if (
        result.ok &&
        (result.body.status === "pending" ||
          result.body.status === "pending_verification" ||
          result.body.status === "review")
      ) {
        setIsError(false);
        setMessage(
          result.body.message ||
            "Registration received. We will email you when your account is approved.",
        );
        if (result.body.redirectTo) {
          setTimeout(() => window.location.assign(result.body.redirectTo!), 2500);
        }
        return;
      }

      if (result.body.redirectTo && result.ok) {
        window.location.assign(result.body.redirectTo);
        return;
      }

      if (result.ok || result.status === 202) {
        setIsError(false);
        setMessage(result.body.message || "Registration received.");
        return;
      }

      setIsError(true);
      const errText =
        firstFieldError(result.body) ||
        result.body.error ||
        "Unable to register. Please check your details and try again.";
      setMessage(errText);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label className="label">
        Legal company name
        <input className="field mt-1" name="legalName" required />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="label">
          Contact name
          <input className="field mt-1" name="contactName" required />
        </label>
        <label className="label">
          Country
          <input className="field mt-1" name="country" required />
        </label>
      </div>
      <label className="label">
        Work email
        <input className="field mt-1" name="email" type="email" autoComplete="email" required />
      </label>
      <label className="label">
        Phone
        <input className="field mt-1" name="phone" required />
      </label>
      <label className="label">
        Password (min. 12 characters, upper, lower, number)
        <input className="field mt-1" name="password" type="password" minLength={12} required />
      </label>
      <label className="label">
        Confirm password
        <input
          className="field mt-1"
          name="confirmPassword"
          type="password"
          minLength={12}
          required
        />
      </label>
      <label className="flex gap-2 text-sm">
        <input name="terms" type="checkbox" required />I accept the buyer terms.
      </label>
      <label className="flex gap-2 text-sm">
        <input name="privacy" type="checkbox" required />I accept the privacy notice.
      </label>
      {message ? (
        <p className={`text-sm ${isError ? "text-red-700" : "text-[var(--forest)]"}`}>
          {message}
          {isError && message.includes("already exists") ? (
            <>
              {" "}
              <Link href="/login" className="font-semibold underline">
                Sign in
              </Link>
            </>
          ) : null}
        </p>
      ) : null}
      <button className="btn btn-primary w-full" type="submit" disabled={loading}>
        {loading ? "Creating account…" : "Create buyer account"}
      </button>
    </form>
  );
}
