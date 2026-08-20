"use client";

import { FormEvent, useState } from "react";

type ApiBody = {
  error?: string;
  message?: string;
  redirectTo?: string;
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

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="label">
        Email
        <input className="field mt-1" name="email" type="email" autoComplete="email" required />
      </label>
      <label className="label">
        Password
        <input
          className="field mt-1"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      {message ? <p className="text-sm text-red-700">{message}</p> : null}
      <button className="btn btn-primary w-full" type="submit" disabled={loading}>
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

      if (result.body.redirectTo) {
        window.location.assign(result.body.redirectTo);
        return;
      }

      if (result.ok || result.status === 202) {
        setIsError(false);
        setMessage(result.body.message || "Registration received.");
        return;
      }

      setIsError(true);
      setMessage(
        firstFieldError(result.body) ||
          result.body.error ||
          "Unable to register. Please check your details and try again.",
      );
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
        <p className={`text-sm ${isError ? "text-red-700" : "text-[var(--forest)]"}`}>{message}</p>
      ) : null}
      <button className="btn btn-primary w-full" type="submit" disabled={loading}>
        {loading ? "Creating account…" : "Create buyer account"}
      </button>
    </form>
  );
}
