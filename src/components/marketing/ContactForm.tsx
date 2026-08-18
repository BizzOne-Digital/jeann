"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils/cn";
import type { BuyerFormDefaults } from "@/lib/auth/buyer-profile";
import { contactSchema, type ContactInput } from "@/lib/validation/forms";

export function ContactForm({
  className,
  prefill,
}: {
  className?: string;
  prefill?: Pick<BuyerFormDefaults, "contactName" | "email" | "phone">;
}) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: prefill?.contactName ?? "",
      email: prefill?.email ?? "",
      phone: prefill?.phone ?? "",
      consent: undefined,
      website: "",
    },
  });

  async function onSubmit(data: ContactInput) {
    setStatus("idle");
    try {
      const res = await fetch("/api/leads/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok?: boolean };
      if (!res.ok || !json.ok) {
        setStatus("error");
        return;
      }
      setStatus("success");
      reset({ website: "", consent: undefined });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={cn("border border-[#c88e4a]/35 bg-[#f3f1ec] p-6", className)}>
        <p className="text-2xl font-semibold text-[#001a3d]">Message sent</p>
        <p className="mt-3 text-sm leading-relaxed text-[#555555]">
          We will route your message to the appropriate team. Response times vary by department and
          enquiry complexity.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-5", className)} noValidate>
      <div className="hidden" aria-hidden>
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" error={errors.name?.message}>
          <input className="field" {...register("name")} autoComplete="name" />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input className="field" type="email" {...register("email")} autoComplete="email" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone (optional)" error={errors.phone?.message}>
          <input className="field" type="tel" {...register("phone")} autoComplete="tel" />
        </Field>
        <Field label="Department" error={errors.department?.message}>
          <select className="field" {...register("department")}>
            <option value="Trade desk">Trade desk</option>
            <option value="General">General</option>
            <option value="Careers">Careers</option>
            <option value="Compliance">Compliance</option>
          </select>
        </Field>
      </div>

      <Field label="Message" error={errors.message?.message}>
        <textarea className="field min-h-32" {...register("message")} />
      </Field>

      <label className="flex items-start gap-3 text-sm text-[#555555]">
        <input type="checkbox" className="mt-1" {...register("consent")} />
        <span>
          I consent to Finekarts processing this enquiry per the{" "}
          <Link
            href="/privacy"
            className="font-semibold text-[#001a3d] underline decoration-[#c88e4a]/40 underline-offset-2"
          >
            privacy policy
          </Link>
          . Submitting a message does not create a binding trade commitment.
        </span>
      </label>
      {errors.consent ? <p className="text-sm text-red-700">{errors.consent.message}</p> : null}

      {status === "error" ? (
        <p className="text-sm text-red-700">
          Something went wrong. Please email Info@finekarts.com directly.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-[#d4a84b] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#c4983f] disabled:opacity-60"
      >
        {isSubmitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error ? <p className="mt-1 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
