"use client";

import { FormEvent, useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("idle");
    try {
      const res = await fetch("/api/leads/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("ok");
      setMessage("Thanks — subscription recorded with your consent.");
      setEmail("");
      setConsent(false);
    } catch {
      setStatus("err");
      setMessage("Unable to subscribe right now. Please try again or email Info@finekarts.com.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3">
      <label className="sr-only" htmlFor="footer-newsletter-email">
        Email address
      </label>
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
        <input
          id="footer-newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="w-full min-w-0 rounded-md border border-white/20 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#e89a2d] focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 rounded-md bg-[#e89a2d] px-4 py-2.5 text-sm font-semibold text-[#071525] transition hover:bg-[#f0a93c]"
        >
          Subscribe
        </button>
      </div>
      <label className="flex items-start gap-2 text-xs text-white/55">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5"
        />
        I consent to receive Finekarts updates and understand I can unsubscribe anytime.
      </label>
      {status !== "idle" ? (
        <p className={`text-xs ${status === "ok" ? "text-[#e89a2d]" : "text-red-300"}`}>{message}</p>
      ) : null}
    </form>
  );
}
