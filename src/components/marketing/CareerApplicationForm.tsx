"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { CareerFormPrefill } from "@/lib/auth/career-prefill";

const OPEN_ROLES = [
  "Trade operations",
  "Procurement & sourcing",
  "Logistics coordination",
  "Compliance & documentation",
  "Business development",
  "General application",
] as const;

type FieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

function Field({ label, error, children }: FieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[#001a3d]">{label}</label>
      {children}
      {error ? <p className="mt-1 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}

export function CareerApplicationForm({
  className,
  prefill,
}: {
  className?: string;
  prefill?: CareerFormPrefill;
}) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("idle");
    setErrorMessage("");
    setSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/leads/career", {
        method: "POST",
        body: formData,
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setStatus("error");
        setErrorMessage(json.error ?? "Unable to submit application.");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Unable to submit application.");
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "success") {
    return (
      <div className={cn("marketing-box rounded-xl p-8", className)}>
        <h2 className="text-2xl font-semibold text-[#001a3d]">Application received</h2>
        <p className="mt-3 text-sm leading-relaxed text-[#555555]">
          Thank you for your interest in Finekarts Incorporated. Our team will review your
          application and contact you if there is a suitable opportunity.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn("marketing-box space-y-5 rounded-xl p-6 sm:p-8", className)}
      noValidate
      encType="multipart/form-data"
    >
      <div className="hidden" aria-hidden>
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name *">
          <input
            className="field"
            name="fullName"
            required
            autoComplete="name"
            defaultValue={prefill?.fullName ?? ""}
          />
        </Field>
        <Field label="Email *">
          <input
            className="field"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={prefill?.email ?? ""}
          />
        </Field>
        <Field label="Phone *">
          <input
            className="field"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            defaultValue={prefill?.phone ?? ""}
          />
        </Field>
        <Field label="Position *">
          <select className="field" name="position" required defaultValue="">
            <option value="" disabled>Select a role</option>
            {OPEN_ROLES.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </Field>
        <Field label="City / country">
          <input className="field" name="location" autoComplete="address-level2" />
        </Field>
        <Field label="LinkedIn profile">
          <input className="field" name="linkedIn" type="url" placeholder="https://linkedin.com/in/..." />
        </Field>
      </div>

      <Field label="Cover letter">
        <textarea
          className="field min-h-[140px]"
          name="coverLetter"
          placeholder="Brief summary of your experience and interest in commodity trade."
        />
      </Field>

      <Field label="Resume (PDF, DOC, or DOCX) *">
        <input
          className="block w-full text-sm text-[#555555] file:mr-4 file:rounded-md file:border-0 file:bg-[#001a3d] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#0a2847]"
          name="resume"
          type="file"
          required
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        />
        <p className="mt-1 text-xs text-[#888888]">Maximum file size: 5MB.</p>
      </Field>

      <label className="flex items-start gap-3 text-sm text-[#555555]">
        <input
          className="mt-1"
          name="consent"
          type="checkbox"
          value="true"
          required
        />
        <span>
          I consent to Finekarts processing my application details and resume for recruitment
          purposes.
        </span>
      </label>

      {status === "error" ? (
        <p className="text-sm text-red-700">{errorMessage}</p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="focus-ring marketing-btn-primary inline-flex items-center justify-center px-6 py-3.5 text-sm disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Submit application"}
      </button>
    </form>
  );
}
