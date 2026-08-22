"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { edibleOilOrderSchema, type EdibleOilOrderInput } from "@/lib/validation/forms";
import {
  CONTRACT_YEAR_OPTIONS,
  deliveriesForContractYears,
  EDIBLE_OIL_GRADES,
  EDIBLE_OIL_PRODUCTS,
  formatProductLabel,
  SHIPPING_INCOTERMS,
} from "@/lib/content/edible-oils";
import type { BuyerFormDefaults } from "@/lib/auth/buyer-profile";
import type { PackagingItem } from "@/lib/content/packaging-catalog";

type PaymentTermApiItem = {
  id: string;
  structure: string;
  iccCode: string;
  preferred?: boolean;
};

type Props = {
  prefill?: BuyerFormDefaults;
  packagingOptions: PackagingItem[];
  defaultProductSlug?: string;
  className?: string;
};

export function EdibleOilOrderForm({
  prefill,
  packagingOptions,
  defaultProductSlug,
  className,
}: Props) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [reference, setReference] = useState<string>();
  const [paymentTerms, setPaymentTerms] = useState<PaymentTermApiItem[]>([]);
  const [termsLoading, setTermsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EdibleOilOrderInput>({
    resolver: zodResolver(edibleOilOrderSchema) as Resolver<EdibleOilOrderInput>,
    defaultValues: {
      companyName: prefill?.companyName ?? "",
      contactName: prefill?.contactName ?? "",
      email: prefill?.email ?? "",
      phone: prefill?.phone ?? "",
      productSlug: defaultProductSlug ?? EDIBLE_OIL_PRODUCTS[0]?.slug ?? "",
      productGrade: "Refined",
      quantityMt: undefined,
      destinationCountry: "",
      destinationPort: "",
      incoterm: "FOB",
      pricePerMt: undefined,
      monthlyDeliveryTotal: undefined,
      contractYears: 1,
      deliveryCount: 12,
      contractTotal: undefined,
      paymentTermId: "",
      iccCode: "",
      acceptTerms: undefined,
    },
  });

  const quantityMt = useWatch({ control, name: "quantityMt" });
  const pricePerMt = useWatch({ control, name: "pricePerMt" });
  const contractYears = useWatch({ control, name: "contractYears" });
  const monthlyDeliveryTotal = useWatch({ control, name: "monthlyDeliveryTotal" });
  const deliveryCount = useWatch({ control, name: "deliveryCount" });
  const paymentTermId = useWatch({ control, name: "paymentTermId" });
  const productSlug = useWatch({ control, name: "productSlug" });
  const productGrade = useWatch({ control, name: "productGrade" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/payment-terms");
        const data = (await res.json()) as { terms?: PaymentTermApiItem[] };
        if (!cancelled && data.terms?.length) {
          setPaymentTerms(data.terms);
          const preferred = data.terms.find((t) => t.preferred) ?? data.terms[0];
          setValue("paymentTermId", preferred.id);
          setValue("iccCode", preferred.iccCode);
        }
      } finally {
        if (!cancelled) setTermsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setValue]);

  useEffect(() => {
    const deliveries = deliveriesForContractYears(contractYears);
    setValue("deliveryCount", deliveries);
  }, [contractYears, setValue]);

  useEffect(() => {
    const qty = Number(quantityMt);
    const price = Number(pricePerMt);
    if (Number.isFinite(qty) && Number.isFinite(price) && qty > 0 && price > 0) {
      const monthly = Number((qty * price).toFixed(2));
      setValue("monthlyDeliveryTotal", monthly, { shouldValidate: true });
    }
  }, [quantityMt, pricePerMt, setValue]);

  useEffect(() => {
    const monthly = Number(monthlyDeliveryTotal);
    const deliveries = Number(deliveryCount);
    if (Number.isFinite(monthly) && Number.isFinite(deliveries) && monthly > 0 && deliveries > 0) {
      setValue("contractTotal", Number((monthly * deliveries).toFixed(2)), { shouldValidate: true });
    }
  }, [monthlyDeliveryTotal, deliveryCount, setValue]);

  useEffect(() => {
    const term = paymentTerms.find((item) => item.id === paymentTermId);
    if (term) setValue("iccCode", term.iccCode, { shouldValidate: true });
  }, [paymentTermId, paymentTerms, setValue]);

  const productSummary = useMemo(() => {
    if (!productSlug || !productGrade) return "";
    return formatProductLabel(productSlug, productGrade);
  }, [productSlug, productGrade]);

  async function onSubmit(data: EdibleOilOrderInput) {
    setStatus("idle");
    try {
      const res = await fetch("/api/leads/edible-oil-order", {
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
      reset({
        companyName: prefill?.companyName ?? "",
        contactName: prefill?.contactName ?? "",
        email: prefill?.email ?? "",
        phone: prefill?.phone ?? "",
        productSlug: defaultProductSlug ?? EDIBLE_OIL_PRODUCTS[0]?.slug ?? "",
        productGrade: "Refined",
        incoterm: "FOB",
        contractYears: 1,
        deliveryCount: 12,
        paymentTermId: paymentTerms.find((t) => t.preferred)?.id ?? paymentTerms[0]?.id ?? "",
        iccCode: paymentTerms.find((t) => t.preferred)?.iccCode ?? paymentTerms[0]?.iccCode ?? "",
      });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={cn("rounded-md border border-forest/30 bg-forest/5 p-6", className)}>
        <p className="display text-2xl text-ink">Order request received</p>
        {reference ? (
          <p className="mt-2 text-sm text-stone">
            Reference: <span className="font-mono text-navy">{reference}</span>
          </p>
        ) : null}
        <p className="mt-3 text-sm leading-relaxed text-stone">
          The trade desk will review your edible oil programme. Submission does not guarantee
          acceptance, pricing, supply, or shipment.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-5", className)} noValidate>
      <div className="rounded-md border border-[var(--line)] bg-[var(--cream)]/40 p-4 text-sm text-[var(--stone)]">
        <p className="font-semibold text-[var(--navy)]">Edible oils programme enquiry</p>
        <p className="mt-1">
          Specify product grade, monthly volume (MT), contract duration, and admin-enabled payment
          terms. Totals are calculated automatically.
        </p>
      </div>

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

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Edible product" error={errors.productSlug?.message}>
          <select className="field" {...register("productSlug")}>
            {EDIBLE_OIL_PRODUCTS.map((product) => (
              <option key={product.slug} value={product.slug}>
                {product.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Product type" error={errors.productGrade?.message}>
          <select className="field" {...register("productGrade")}>
            {EDIBLE_OIL_GRADES.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <p className="text-sm font-medium text-[var(--navy)]">Ordering: {productSummary}</p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Quantity (MT per monthly delivery)" error={errors.quantityMt?.message}>
          <input
            className="field"
            type="number"
            step="0.01"
            min="0"
            {...register("quantityMt", { valueAsNumber: true })}
          />
        </Field>
        <Field label="Price per MT (USD)" error={errors.pricePerMt?.message}>
          <input
            className="field"
            type="number"
            step="0.01"
            min="0"
            {...register("pricePerMt", { valueAsNumber: true })}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Total price — monthly delivery (USD)" error={errors.monthlyDeliveryTotal?.message}>
          <input className="field" type="number" step="0.01" min="0" readOnly {...register("monthlyDeliveryTotal")} />
        </Field>
        <Field label="Contract duration" error={errors.contractYears?.message}>
          <select className="field" {...register("contractYears", { valueAsNumber: true })}>
            {CONTRACT_YEAR_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Deliveries" error={errors.deliveryCount?.message}>
          <input className="field" type="number" readOnly {...register("deliveryCount", { valueAsNumber: true })} />
        </Field>
        <Field label="Contract total (USD)" error={errors.contractTotal?.message}>
          <input className="field" type="number" step="0.01" min="0" readOnly {...register("contractTotal")} />
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
        <Field label="Shipping Incoterm" error={errors.incoterm?.message}>
          <select className="field" {...register("incoterm")}>
            {SHIPPING_INCOTERMS.map((term) => (
              <option key={term} value={term}>
                {term}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Packaging" error={errors.packaging?.message}>
          <select className="field" {...register("packaging")} defaultValue="">
            <option value="">Select packaging (optional)</option>
            {packagingOptions.map((p) => (
              <option key={p.slug} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Inspection preference" error={errors.inspection?.message}>
        <input className="field" placeholder="e.g. SGS at load port" {...register("inspection")} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Payment terms" error={errors.paymentTermId?.message}>
          <select
            className="field"
            {...register("paymentTermId")}
            disabled={termsLoading || paymentTerms.length === 0}
          >
            {termsLoading ? <option value="">Loading payment terms…</option> : null}
            {!termsLoading && paymentTerms.length === 0 ? (
              <option value="">No payment terms enabled — contact admin</option>
            ) : null}
            {paymentTerms.map((term) => (
              <option key={term.id} value={term.id}>
                {term.structure}
                {term.preferred ? " (preferred)" : ""}
              </option>
            ))}
          </select>
        </Field>
        <Field label="ICC code" error={errors.iccCode?.message}>
          <input className="field" readOnly {...register("iccCode")} />
        </Field>
      </div>

      <Field label="Additional notes" error={errors.notes?.message}>
        <textarea className="field min-h-24" {...register("notes")} />
      </Field>

      <label className="flex items-start gap-3 text-sm text-stone">
        <input type="checkbox" className="mt-1" {...register("acceptTerms")} />
        <span>
          I understand this submission is an enquiry only and does not guarantee acceptance,
          pricing, supply, financing, or shipment. I agree to the{" "}
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

      <Button type="submit" disabled={isSubmitting || termsLoading || paymentTerms.length === 0}>
        {isSubmitting ? "Submitting…" : "Submit edible oil order"}
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
