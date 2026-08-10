"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { tradeOfferSchema, type TradeOfferInput } from "@/lib/validation/forms";

export function TradeOfferForm({ className }: { className?: string }) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [reference, setReference] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TradeOfferInput>({
    resolver: zodResolver(tradeOfferSchema),
    defaultValues: { incoterm: "FOB", acceptTerms: undefined },
  });

  async function onSubmit(data: TradeOfferInput) {
    setStatus("idle");
    try {
      const res = await fetch("/api/leads/trade-offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok?: boolean; id?: string };
      if (!res.ok || !json.ok) {
        setStatus("error");
        return;
      }
      setReference(json.id);
      setStatus("success");
      reset({ incoterm: "FOB" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={cn("rounded-md border border-forest/30 bg-forest/5 p-6", className)}>
        <p className="display text-2xl text-ink">Offer received</p>
        {reference ? (
          <p className="mt-2 text-sm text-stone">
            Reference: <span className="font-mono text-navy">{reference}</span>
          </p>
        ) : null}
        <p className="mt-3 text-sm leading-relaxed text-stone">
          Supplier portal access remains invitation-only. This submission does not guarantee listing,
          acceptance, or a transaction.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-5", className)} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Company name" error={errors.companyName?.message}>
          <input className="field" {...register("companyName")} />
        </Field>
        <Field label="Contact name" error={errors.contactName?.message}>
          <input className="field" {...register("contactName")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input className="field" type="email" {...register("email")} />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <input className="field" type="tel" {...register("phone")} />
        </Field>
      </div>

      <Field label="Product offered" error={errors.productName?.message}>
        <input className="field" {...register("productName")} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Origin country" error={errors.originCountry?.message}>
          <input className="field" {...register("originCountry")} />
        </Field>
        <Field label="Quantity" error={errors.quantity?.message}>
          <input className="field" {...register("quantity")} />
        </Field>
        <Field label="Unit" error={errors.unit?.message}>
          <input className="field" {...register("unit")} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Packaging" error={errors.packaging?.message}>
          <input className="field" {...register("packaging")} />
        </Field>
        <Field label="Incoterm" error={errors.incoterm?.message}>
          <select className="field" {...register("incoterm")}>
            <option value="FOB">FOB</option>
            <option value="CIF">CIF</option>
            <option value="Other / to discuss">Other / to discuss</option>
          </select>
        </Field>
      </div>

      <Field label="Notes" error={errors.notes?.message}>
        <textarea className="field min-h-24" {...register("notes")} />
      </Field>

      <label className="flex items-start gap-3 text-sm text-stone">
        <input type="checkbox" className="mt-1" {...register("acceptTerms")} />
        <span>
          I understand submission does not guarantee portal access, publication, or a closed deal. I
          agree to applicable{" "}
          <Link href="/terms" className="text-navy underline">
            terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-navy underline">
            privacy policy
          </Link>
          .
        </span>
      </label>
      {errors.acceptTerms ? <p className="text-sm text-red-700">{errors.acceptTerms.message}</p> : null}

      {status === "error" ? (
        <p className="text-sm text-red-700">Something went wrong. Please try again or email Info@finekarts.com.</p>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Submit trade offer"}
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
