"use client";

import { FormEvent, useState } from "react";

async function submit(path: string, values: Record<string, unknown>) {
  const response = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(values) });
  return { ok: response.ok, body: await response.json() as { error?: string; message?: string; redirectTo?: string } };
}

export function LoginForm() {
  const [message, setMessage] = useState("");
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await submit("/api/auth/login", { email: form.get("email"), password: form.get("password") });
    if (result.ok && result.body.redirectTo) window.location.assign(result.body.redirectTo);
    else setMessage(result.body.error || "Unable to sign in.");
  }
  return <form onSubmit={onSubmit} className="space-y-4"><label className="label">Email<input className="field mt-1" name="email" type="email" required /></label><label className="label">Password<input className="field mt-1" name="password" type="password" required /></label>{message && <p className="text-sm text-red-700">{message}</p>}<button className="btn btn-primary w-full" type="submit">Sign in</button></form>;
}

export function BuyerRegistrationForm() {
  const [message, setMessage] = useState("");
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form.entries());
    const result = await submit("/api/auth/register/buyer", { ...values, acceptBuyerTerms: form.get("terms") === "on", acceptPrivacy: form.get("privacy") === "on" });
    setMessage(result.body.message || (result.ok ? "Registration received. Check your email to continue." : result.body.error || "Unable to register."));
  }
  return <form onSubmit={onSubmit} className="space-y-3"><label className="label">Legal company name<input className="field mt-1" name="legalName" required /></label><div className="grid grid-cols-2 gap-3"><label className="label">Contact name<input className="field mt-1" name="contactName" required /></label><label className="label">Country<input className="field mt-1" name="country" required /></label></div><label className="label">Work email<input className="field mt-1" name="email" type="email" required /></label><label className="label">Phone<input className="field mt-1" name="phone" required /></label><label className="label">Password<input className="field mt-1" name="password" type="password" minLength={12} required /></label><label className="flex gap-2 text-sm"><input name="terms" type="checkbox" required />I accept the buyer terms.</label><label className="flex gap-2 text-sm"><input name="privacy" type="checkbox" required />I accept the privacy notice.</label>{message && <p className="text-sm text-[var(--forest)]">{message}</p>}<button className="btn btn-primary w-full" type="submit">Create buyer account</button></form>;
}
