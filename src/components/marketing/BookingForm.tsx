"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import type { BuyerFormDefaults } from "@/lib/auth/buyer-profile";
import { bookingSchema, type BookingInput } from "@/lib/validation/forms";

const TIMEZONES = [
  "UTC",
  "America/Toronto",
  "America/New_York",
  "America/Chicago",
  "Europe/London",
  "Europe/Paris",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Kolkata",
];

export function BookingForm({
  className,
  prefill,
}: {
  className?: string;
  prefill?: BuyerFormDefaults;
}) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [reference, setReference] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: prefill?.contactName ?? "",
      organization: prefill?.companyName ?? "",
      email: prefill?.email ?? "",
      phone: prefill?.phone ?? "",
      timezone: "America/Toronto",
      consent: undefined,
    },
  });

  async function onSubmit(data: BookingInput) {
    setStatus("idle");
    try {
      const res = await fetch("/api/leads/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok?: boolean; id?: string };
      if (!res.ok || !json.ok) {
        setStatus("error");
        return;
      }
      setReference(json.id);
      setStatus("success");
      reset({ timezone: "America/Toronto", consent: undefined });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={cn("rounded-md border border-forest/30 bg-forest/5 p-6", className)}>
        <p className="display text-2xl text-ink">Request received</p>
        {reference ? (
          <p className="mt-2 text-sm text-stone">
            Reference: <span className="font-mono text-navy">{reference}</span>
          </p>
        ) : null}
        <p className="mt-3 text-sm leading-relaxed text-stone">
          Your preferred time is not confirmed until Finekarts staff replies with a scheduled slot.
          We may propose alternative times based on availability.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-5", className)} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" error={errors.name?.message}>
          <input className="field" {...register("name")} />
        </Field>
        <Field label="Organization" error={errors.organization?.message}>
          <input className="field" {...register("organization")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input className="field" type="email" {...register("email")} />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <input className="field" type="tel" {...register("phone")} />
        </Field>
      </div>

      <Field label="Discussion topic" error={errors.topic?.message}>
        <input className="field" placeholder="RFQ review, supplier onboarding…" {...register("topic")} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Commodity interest" error={errors.commodityInterest?.message}>
          <input className="field" {...register("commodityInterest")} />
        </Field>
        <Field label="Estimated volume" error={errors.estimatedVolume?.message}>
          <input className="field" {...register("estimatedVolume")} />
        </Field>
        <Field label="Destination" error={errors.destination?.message}>
          <input className="field" {...register("destination")} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Timezone" error={errors.timezone?.message}>
          <select className="field" {...register("timezone")}>
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Preferred date / time window" error={errors.preferredSlot?.message}>
          <input
            className="field"
            placeholder="e.g. Tue 14:00–16:00 EST, week of 12 Aug"
            {...register("preferredSlot")}
          />
        </Field>
      </div>

      <Field label="Notes" error={errors.notes?.message}>
        <textarea className="field min-h-24" {...register("notes")} />
      </Field>

      <label className="flex items-start gap-3 text-sm text-stone">
        <input type="checkbox" className="mt-1" {...register("consent")} />
        <span>
          I understand this form requests a consultation only — not a confirmed appointment — and I
          agree to the{" "}
          <Link href="/privacy" className="text-navy underline">
            privacy policy
          </Link>
          .
        </span>
      </label>
      {errors.consent ? <p className="text-sm text-red-700">{errors.consent.message}</p> : null}

      {status === "error" ? (
        <p className="text-sm text-red-700">Something went wrong. Please email Info@finekarts.com.</p>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Request consultation"}
      </Button>
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
