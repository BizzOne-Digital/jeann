"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { purchaseRequestSchema, type PurchaseRequestInput } from "@/lib/validation/forms";

type Props = {
  defaultProduct?: { slug?: string; name?: string };
  className?: string;
};

export function PurchaseRequestForm({ defaultProduct, className }: Props) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [reference, setReference] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PurchaseRequestInput>({
    resolver: zodResolver(purchaseRequestSchema),
    defaultValues: {
      productSlug: defaultProduct?.slug,
      productName: defaultProduct?.name ?? "",
      incoterm: "FOB",
      acceptTerms: undefined,
    },
  });

  async function onSubmit(data: PurchaseRequestInput) {
    setStatus("idle");
    try {
      const res = await fetch("/api/leads/purchase-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok?: boolean; id?: string; error?: string };
      if (!res.ok || !json.ok) {
        setStatus("error");
        return;
      }
      setReference(json.id);
      setStatus("success");
      reset({ incoterm: "FOB", productName: defaultProduct?.name ?? "", productSlug: defaultProduct?.slug });
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
          The trade desk will review your enquiry. Submission does not guarantee acceptance, pricing,
          supply, or shipment.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-5", className)} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Company name" error={errors.companyName?.message}>
          <input className="field" {...register("companyName")} autoComplete="organization" />
        </Field>
        <Field label="Contact name" error={errors.contactName?.message}>
          <input className="field" {...register("contactName")} autoComplete="name" />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input className="field" type="email" {...register("email")} autoComplete="email" />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <input className="field" type="tel" {...register("phone")} autoComplete="tel" />
        </Field>
      </div>

      <input type="hidden" {...register("productSlug")} />
      <Field label="Product" error={errors.productName?.message}>
        <input className="field" {...register("productName")} />
      </Field>

      <Field label="Specification notes" error={errors.specification?.message}>
        <textarea className="field min-h-24" {...register("specification")} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Quantity" error={errors.quantity?.message}>
          <input className="field" {...register("quantity")} />
        </Field>
        <Field label="Unit" error={errors.unit?.message}>
          <input className="field" placeholder="MT, containers…" {...register("unit")} />
        </Field>
        <Field label="Frequency" error={errors.frequency?.message}>
          <input className="field" placeholder="One-off, monthly…" {...register("frequency")} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Destination country" error={errors.destinationCountry?.message}>
          <input className="field" {...register("destinationCountry")} />
        </Field>
        <Field label="Destination port" error={errors.destinationPort?.message}>
          <input className="field" {...register("destinationPort")} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Incoterm" error={errors.incoterm?.message}>
          <select className="field" {...register("incoterm")}>
            <option value="FOB">FOB</option>
            <option value="CIF">CIF</option>
            <option value="Other / to discuss">Other / to discuss</option>
          </select>
        </Field>
        <Field label="Packaging preference" error={errors.packaging?.message}>
          <input className="field" {...register("packaging")} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Inspection preference" error={errors.inspection?.message}>
          <input className="field" {...register("inspection")} />
        </Field>
        <Field label="Timeline" error={errors.timeline?.message}>
          <input className="field" {...register("timeline")} />
        </Field>
      </div>

      <Field label="Payment preference" error={errors.paymentPreference?.message}>
        <input className="field" placeholder="e.g. Irrevocable LC at sight" {...register("paymentPreference")} />
      </Field>

      <Field label="Additional notes" error={errors.notes?.message}>
        <textarea className="field min-h-24" {...register("notes")} />
      </Field>

      <label className="flex items-start gap-3 text-sm text-stone">
        <input type="checkbox" className="mt-1" {...register("acceptTerms")} />
        <span>
          I understand this submission is an enquiry only and does not guarantee acceptance, pricing,
          supply, financing, or shipment. I agree to the{" "}
          <Link href="/buyer-terms" className="text-navy underline">
            buyer terms
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
        {isSubmitting ? "Submitting…" : "Submit purchase request"}
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
