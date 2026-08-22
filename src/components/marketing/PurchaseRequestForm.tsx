"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { purchaseRequestSchema, type PurchaseRequestInput } from "@/lib/validation/forms";
import type { PackagingItem } from "@/lib/content/packaging-catalog";

import type { BuyerFormDefaults } from "@/lib/auth/buyer-profile";

type Props = {
  defaultProduct?: { slug?: string; name?: string };
  packagingOptions: PackagingItem[];
  prefill?: BuyerFormDefaults;
  className?: string;
};

export function PurchaseRequestForm({ defaultProduct, packagingOptions, prefill, className }: Props) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [reference, setReference] = useState<string>();
  const [paymentOptions, setPaymentOptions] = useState<Array<{ id: string; structure: string }>>(
    [],
  );

  useEffect(() => {
    fetch("/api/payment-terms")
      .then((res) => res.json())
      .then((data: { terms?: Array<{ id: string; structure: string }> }) => {
        setPaymentOptions(data.terms ?? []);
      })
      .catch(() => setPaymentOptions([]));
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PurchaseRequestInput>({
    resolver: zodResolver(purchaseRequestSchema),
    defaultValues: {
      companyName: prefill?.companyName ?? "",
      contactName: prefill?.contactName ?? "",
      email: prefill?.email ?? "",
      phone: prefill?.phone ?? "",
      productSlug: defaultProduct?.slug,
      lineItems: [
        {
          productName: defaultProduct?.name ?? "",
          quantity: "",
          unit: "MT",
          packaging: "",
        },
      ],
      incoterm: "FOB",
      acceptTerms: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "lineItems" });

  async function onSubmit(data: PurchaseRequestInput) {
    setStatus("idle");
    const payload = {
      ...data,
      productName: data.lineItems.map((l) => l.productName).join("; "),
      quantity: data.lineItems.map((l) => l.quantity).join("; "),
      unit: data.lineItems.map((l) => l.unit).join("; "),
      packaging: data.lineItems.map((l) => `${l.productName}: ${l.packaging}`).join("\n"),
      specification: [
        data.specification,
        "Line items:",
        ...data.lineItems.map(
          (l, i) =>
            `${i + 1}. ${l.productName} — ${l.quantity} ${l.unit} — Packaging: ${l.packaging}`,
        ),
      ]
        .filter(Boolean)
        .join("\n"),
    };
    try {
      const res = await fetch("/api/leads/purchase-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok?: boolean; id?: string; error?: string };
      if (res.status === 401 || res.status === 403) {
        setStatus("error");
        return;
      }
      if (!res.ok || !json.ok) {
        setStatus("error");
        return;
      }
      setReference(json.id);
      setStatus("success");
      reset({
        incoterm: "FOB",
        lineItems: [
          {
            productName: defaultProduct?.name ?? "",
            quantity: "",
            unit: "MT",
            packaging: "",
          },
        ],
        productSlug: defaultProduct?.slug,
      });
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

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-[var(--navy)]">Products & packaging</p>
          <button
            type="button"
            className="text-sm font-semibold text-[var(--ocean)] underline"
            onClick={() =>
              append({ productName: "", quantity: "", unit: "MT", packaging: "" })
            }
          >
            + Add line
          </button>
        </div>
        {errors.lineItems?.message ? (
          <p className="text-sm text-red-700">{errors.lineItems.message}</p>
        ) : null}
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-md border border-[var(--line)] bg-[var(--cream)]/50 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--stone)]">
                Line {index + 1}
              </span>
              {fields.length > 1 ? (
                <button
                  type="button"
                  className="text-xs text-red-700 underline"
                  onClick={() => remove(index)}
                >
                  Remove
                </button>
              ) : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Product"
                error={errors.lineItems?.[index]?.productName?.message}
              >
                <input className="field" {...register(`lineItems.${index}.productName`)} />
              </Field>
              <Field label="Packaging" error={errors.lineItems?.[index]?.packaging?.message}>
                <select className="field" {...register(`lineItems.${index}.packaging`)} defaultValue="">
                  <option value="">Select packaging</option>
                  {packagingOptions.map((p) => (
                    <option key={p.slug} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                  <option value="Other / to discuss">Other / to discuss</option>
                </select>
              </Field>
              <Field label="Quantity" error={errors.lineItems?.[index]?.quantity?.message}>
                <input className="field" {...register(`lineItems.${index}.quantity`)} />
              </Field>
              <Field label="Unit" error={errors.lineItems?.[index]?.unit?.message}>
                <input className="field" placeholder="MT, bags…" {...register(`lineItems.${index}.unit`)} />
              </Field>
            </div>
          </div>
        ))}
      </div>

      <Field label="Specification notes" error={errors.specification?.message}>
        <textarea className="field min-h-24" {...register("specification")} />
      </Field>

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
        <Field label="Frequency" error={errors.frequency?.message}>
          <input className="field" placeholder="One-off, monthly…" {...register("frequency")} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Inspection preference" error={errors.inspection?.message}>
          <input className="field" placeholder="e.g. SGS at load port" {...register("inspection")} />
        </Field>
        <Field label="Timeline" error={errors.timeline?.message}>
          <input className="field" {...register("timeline")} />
        </Field>
      </div>

      <Field label="Payment preference" error={errors.paymentPreference?.message}>
        <select className="field" {...register("paymentPreference")}>
          <option value="">Select payment structure (optional)</option>
          {paymentOptions.map((option) => (
            <option key={option.id} value={option.structure}>
              {option.structure}
            </option>
          ))}
          <option value="Other / to discuss">Other / to discuss</option>
        </select>
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
        <p className="text-sm text-red-700">
          Something went wrong. Please sign in again or email Info@finekarts.com.
        </p>
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
