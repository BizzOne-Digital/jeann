"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { PasswordField } from "@/components/ui/PasswordField";
import { CAREERS_PORTAL_ACCOUNT } from "@/lib/content/careers-page-content";
import { cn } from "@/lib/utils/cn";

type Tab = "register" | "signin";

async function postJson(path: string, values: Record<string, unknown>) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(values),
  });
  const body = (await response.json()) as { error?: string; redirectTo?: string; ok?: boolean };
  return { ok: response.ok, body };
}

export function CareerApplicantAuth({ className }: { className?: string }) {
  const [tab, setTab] = useState<Tab>("register");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const result = await postJson("/api/auth/register/career", {
      fullName: form.get("fullName"),
      email: form.get("email"),
      phone: form.get("phone"),
      password: form.get("password"),
      confirmPassword: form.get("confirmPassword"),
      acceptPrivacy: form.get("acceptPrivacy") === "on",
    });
    setLoading(false);
    if (result.ok && result.body.redirectTo) {
      window.location.assign(result.body.redirectTo);
      return;
    }
    setMessage(result.body.error ?? "Unable to create account.");
  }

  async function onSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const result = await postJson("/api/auth/login", {
      email: form.get("email"),
      password: form.get("password"),
    });
    setLoading(false);
    if (result.ok && result.body.redirectTo) {
      window.location.assign(result.body.redirectTo);
      return;
    }
    setMessage(result.body.error ?? "Unable to sign in.");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={cn(
        "overflow-hidden rounded-2xl border border-[#d5d0c8] bg-white shadow-lg",
        className,
      )}
    >
      <div className="border-b border-[#e8e4dc] bg-gradient-to-r from-[#001a3d] to-[#0c2544] px-6 py-5 text-white sm:px-8">
        <p className="text-xs font-semibold tracking-[0.22em] text-[#d4a84b] uppercase">Step 1</p>
        <h3 className="mt-2 text-xl font-semibold sm:text-2xl">{CAREERS_PORTAL_ACCOUNT.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/75">{CAREERS_PORTAL_ACCOUNT.lead}</p>
      </div>

      <div className="flex border-b border-[#e8e4dc]">
        {(
          [
            { id: "register" as const, label: "Create account" },
            { id: "signin" as const, label: "Sign in" },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setTab(item.id);
              setMessage("");
            }}
            className={cn(
              "flex-1 px-4 py-3 text-sm font-semibold transition",
              tab === item.id
                ? "border-b-2 border-[#c88e4a] text-[#001a3d] bg-[#faf9f6]"
                : "text-[#666666] hover:bg-[#faf9f6]/80",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="p-6 sm:p-8">
        {tab === "register" ? (
          <form onSubmit={onRegister} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label">Full name *</label>
                <input className="field" name="fullName" required autoComplete="name" />
              </div>
              <div>
                <label className="label">Email (username) *</label>
                <input className="field" name="email" type="email" required autoComplete="email" />
              </div>
              <div>
                <label className="label">Phone *</label>
                <input className="field" name="phone" type="tel" required autoComplete="tel" />
              </div>
              <div>
                <label className="label">Password *</label>
                <PasswordField className="field w-full" name="password" required autoComplete="new-password" />
              </div>
              <div>
                <label className="label">Confirm password *</label>
                <PasswordField
                  className="field w-full"
                  name="confirmPassword"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>
            <label className="flex items-start gap-3 text-sm text-[#555555]">
              <input className="mt-1" name="acceptPrivacy" type="checkbox" required />
              <span>
                I accept the{" "}
                <Link href="/privacy-policy" className="font-semibold text-[#1b3a5c] underline">
                  privacy policy
                </Link>
                .
              </span>
            </label>
            {message ? <p className="text-sm text-red-700">{message}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="marketing-btn-primary w-full px-6 py-3 text-sm font-semibold disabled:opacity-60 sm:w-auto"
            >
              {loading ? "Creating account…" : "Create career portal account"}
            </button>
          </form>
        ) : (
          <form onSubmit={onSignIn} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input className="field" name="email" type="email" required autoComplete="email" />
            </div>
            <div>
              <label className="label">Password</label>
              <PasswordField className="field w-full" name="password" required autoComplete="current-password" />
            </div>
            {message ? <p className="text-sm text-red-700">{message}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="marketing-btn-primary w-full px-6 py-3 text-sm font-semibold disabled:opacity-60 sm:w-auto"
            >
              {loading ? "Signing in…" : "Sign in to continue"}
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
}
