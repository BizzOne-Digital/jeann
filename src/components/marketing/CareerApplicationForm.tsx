"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { CareerFormPrefill } from "@/lib/auth/career-prefill";
import {
  ACCURACY_CERTIFICATION_TEXT,
  CAREERS_FORM,
  COMMODITY_FAMILIARITY_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  TRADE_DOCUMENT_OPTIONS,
  WORK_AUTHORIZATION_OPTIONS,
} from "@/lib/content/careers-page-content";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[#001a3d]">{label}</label>
      {children}
      {hint ? <p className="mt-1 text-xs text-[#888888]">{hint}</p> : null}
    </div>
  );
}

function SectionCard({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay }}
      className="rounded-2xl border border-[#d5d0c8] bg-white p-6 shadow-sm sm:p-8"
    >
      <h3 className="text-lg font-semibold text-[#001a3d] sm:text-xl">{title}</h3>
      <div className="mt-6 space-y-5">{children}</div>
    </motion.section>
  );
}

function CheckboxGroup({
  name,
  options,
}: {
  name: string;
  options: readonly string[];
}) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => (
        <li key={option}>
          <label className="flex cursor-pointer gap-3 rounded-lg border border-[#e8e4dc] bg-[#faf9f6] px-3 py-2.5 text-sm leading-snug text-[#444444] transition hover:border-[#c88e4a]/40">
            <input type="checkbox" name={name} value={option} className="mt-0.5 shrink-0" />
            {option}
          </label>
        </li>
      ))}
    </ul>
  );
}

function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
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
  const [dragOver, setDragOver] = useState(false);
  const [fileLabel, setFileLabel] = useState("");
  const [logistics, setLogistics] = useState("");
  const [quality, setQuality] = useState("");

  const onFileChange = useCallback((files: FileList | null) => {
    const file = files?.[0];
    setFileLabel(file ? file.name : "");
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("idle");
    setErrorMessage("");

    if (wordCount(logistics) > 250) {
      setStatus("error");
      setErrorMessage("Logistics scenario must be 250 words or fewer.");
      return;
    }
    if (wordCount(quality) > 200) {
      setStatus("error");
      setErrorMessage("Quality control response must be 200 words or fewer.");
      return;
    }

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
      setFileLabel("");
      setLogistics("");
      setQuality("");
    } catch {
      setStatus("error");
      setErrorMessage("Unable to submit application.");
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "success") {
    return (
      <div className={cn("marketing-box rounded-2xl p-8 sm:p-10", className)}>
        <h2 className="text-2xl font-semibold text-[#001a3d]">{CAREERS_FORM.successTitle}</h2>
        <p className="mt-3 text-sm leading-relaxed text-[#555555]">{CAREERS_FORM.successBody}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn("space-y-8", className)}
      noValidate
      encType="multipart/form-data"
    >
      <div className="hidden" aria-hidden>
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <SectionCard title="Contact details" delay={0}>
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
          <Field label="Email (portal username) *">
            <input
              className="field"
              name="email"
              type="email"
              required
              readOnly={Boolean(prefill?.email)}
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
        </div>
      </SectionCard>

      <SectionCard title={CAREERS_FORM.educationTitle} delay={0.05}>
        <Field label="Highest level of education completed *">
          <select className="field" name="educationHighest" required defaultValue="">
            <option value="" disabled>Select level</option>
            {EDUCATION_LEVEL_OPTIONS.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </Field>
        <Field label="Field of study / major *">
          <input
            className="field"
            name="educationField"
            required
            placeholder="e.g. International trade, supply chain management"
          />
        </Field>
        <Field label="Institution / university name *">
          <input className="field" name="educationInstitution" required />
        </Field>
        <Field label="Country & graduation year *">
          <input className="field" name="educationCountryYear" required placeholder="e.g. Canada, 2022" />
        </Field>
        <Field label="Professional certifications & licenses">
          <input
            className="field"
            name="educationCertifications"
            placeholder="e.g. CSCP, CICS, customs brokerage, freight forwarding"
          />
        </Field>
      </SectionCard>

      <SectionCard title={CAREERS_FORM.experienceTitle} delay={0.08}>
        <p className="text-sm font-semibold text-[#001a3d]">Most recent position</p>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Job title *">
            <input className="field" name="expRecentTitle" required />
          </Field>
          <Field label="Company name *">
            <input className="field" name="expRecentCompany" required />
          </Field>
          <Field label="Start date *">
            <input className="field" name="expRecentStart" type="month" required />
          </Field>
          <Field label="End date / present *">
            <input className="field" name="expRecentEnd" placeholder="YYYY-MM or Present" required />
          </Field>
        </div>
        <Field label="Primary responsibilities & achievements *">
          <textarea
            className="field min-h-[120px]"
            name="expRecentDetails"
            required
            placeholder="Key duties, commodities handled, deal size, or team leadership."
          />
        </Field>

        <p className="border-t border-[#ebe6de] pt-5 text-sm font-semibold text-[#001a3d]">Previous position</p>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Job title">
            <input className="field" name="expPrevTitle" />
          </Field>
          <Field label="Company name">
            <input className="field" name="expPrevCompany" />
          </Field>
          <Field label="Start date">
            <input className="field" name="expPrevStart" type="month" />
          </Field>
          <Field label="End date">
            <input className="field" name="expPrevEnd" type="month" />
          </Field>
        </div>
        <Field label="Primary responsibilities">
          <textarea className="field min-h-[100px]" name="expPrevDetails" />
        </Field>
      </SectionCard>

      <SectionCard title={CAREERS_FORM.hrTitle} delay={0.1}>
        <p className="text-sm font-semibold text-[#001a3d]">General candidate details</p>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Current employment status *">
            <select className="field" name="employmentStatus" required defaultValue="">
              <option value="" disabled>Select status</option>
              {EMPLOYMENT_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Current location *">
            <input
              className="field"
              name="currentLocation"
              required
              placeholder="City, province/state, country"
            />
          </Field>
          <Field label="Legal work authorization in Canada *">
            <select className="field" name="workAuthorization" required defaultValue="">
              <option value="" disabled>Select authorization</option>
              {WORK_AUTHORIZATION_OPTIONS.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </Field>
          <Field label="Earliest available start date *">
            <input className="field" name="startDate" type="date" required />
          </Field>
          <Field label="Target salary expectation (CAD) *">
            <input className="field" name="salaryExpectation" required placeholder="e.g. 75,000 – 90,000" />
          </Field>
        </div>

        <p className="border-t border-[#ebe6de] pt-5 text-sm font-semibold text-[#001a3d]">
          Technical & industry expertise
        </p>
        <Field label="Commodity portfolio familiarity *" hint="Select all that apply.">
          <CheckboxGroup name="commodityFamiliarity" options={COMMODITY_FAMILIARITY_OPTIONS} />
        </Field>
        <Field label="Trade documentation & compliance competency *" hint="Select all that apply.">
          <CheckboxGroup name="tradeDocuments" options={TRADE_DOCUMENT_OPTIONS} />
        </Field>
        <Field label="Trade finance & SWIFT instruments *">
          <textarea
            className="field min-h-[100px]"
            name="tradeFinance"
            required
            placeholder="Briefly describe familiarity with T/T wire (MT103), documentary credit / L/C (MT700), SBLC (MT760), etc."
          />
        </Field>

        <p className="border-t border-[#ebe6de] pt-5 text-sm font-semibold text-[#001a3d]">
          Operational scenarios & problem solving
        </p>
        <Field
          label="Logistics & supply chain resolution *"
          hint={`${wordCount(logistics)} / 250 words`}
        >
          <textarea
            className="field min-h-[140px]"
            name="logisticsScenario"
            required
            value={logistics}
            onChange={(e) => setLogistics(e.target.value)}
            placeholder="Describe resolving an unexpected bulk shipment delay (port congestion, customs, container shortage, failed inspection)."
          />
        </Field>
        <Field label="Zero-defect quality control *" hint={`${wordCount(quality)} / 200 words`}>
          <textarea
            className="field min-h-[120px]"
            name="qualityControl"
            required
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            placeholder="Steps or personal checklists you use to ensure accuracy on weight, HS codes, and packing specs."
          />
        </Field>
      </SectionCard>

      <SectionCard title={CAREERS_FORM.uploadTitle} delay={0.12}>
        <p className="text-sm font-semibold text-[#001a3d]">{CAREERS_FORM.uploadHeadline}</p>
        <p className="text-sm text-[#666666]">{CAREERS_FORM.uploadHint}</p>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const input = e.currentTarget.querySelector<HTMLInputElement>('input[type="file"]');
            if (input && e.dataTransfer.files.length) {
              input.files = e.dataTransfer.files;
              onFileChange(e.dataTransfer.files);
            }
          }}
          className={cn(
            "mt-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition",
            dragOver ? "border-[#c88e4a] bg-[#fffaf3]" : "border-[#d5d0c8] bg-[#faf9f6]",
          )}
        >
          <p className="text-sm font-medium text-[#001a3d]">Drag & drop files here</p>
          <p className="mt-1 text-xs text-[#888888]">or browse from your device</p>
          <input
            className="mt-4 block w-full max-w-xs text-sm file:mr-4 file:rounded-md file:border-0 file:bg-[#001a3d] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            name="dossier"
            type="file"
            required
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => onFileChange(e.target.files)}
          />
          {fileLabel ? <p className="mt-3 text-xs text-[#555555]">Selected: {fileLabel}</p> : null}
        </div>

        <label className="flex items-start gap-3 text-sm text-[#555555]">
          <input className="mt-1" name="accuracyCertified" type="checkbox" value="true" required />
          <span>{ACCURACY_CERTIFICATION_TEXT}</span>
        </label>
        <label className="flex items-start gap-3 text-sm text-[#555555]">
          <input className="mt-1" name="consent" type="checkbox" value="true" required />
          <span>
            I consent to Finekarts processing my application details and dossier for recruitment purposes.
          </span>
        </label>
      </SectionCard>

      {status === "error" ? <p className="text-sm text-red-700">{errorMessage}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="focus-ring marketing-btn-primary inline-flex w-full items-center justify-center px-8 py-4 text-sm font-semibold sm:w-auto disabled:opacity-60"
      >
        {submitting ? "Submitting…" : CAREERS_FORM.submitLabel}
      </button>
    </form>
  );
}
