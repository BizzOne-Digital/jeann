/**
 * Pure KYB checklist / validation logic (no DB access, safe to unit test).
 * "KYB collects, validation verifies."
 */

export const KYB_ITEM_STATUSES = ["not_started", "received", "verified", "issue"] as const;
export type KybItemStatus = (typeof KYB_ITEM_STATUSES)[number];

export const KYB_SECTIONS = [
  {
    key: "company_identification",
    label: "Company identification",
    items: [
      "Full legal name",
      "Trading name",
      "Registration / incorporation number",
      "Country of registration",
      "Incorporation date",
      "Legal structure",
      "Registered address",
      "Operating address",
    ],
  },
  {
    key: "corporate_documents",
    label: "Corporate documents",
    items: [
      "Certificate of incorporation / registration",
      "Registry extract or good-standing certificate",
      "Articles of incorporation",
      "Annual filings",
    ],
  },
  {
    key: "directors_representatives",
    label: "Directors and authorized representatives",
    items: [
      "Directors / senior officers",
      "Authorized signatories and roles",
      "Evidence the communicating / signing person is authorized",
    ],
  },
  {
    key: "ownership_ubo",
    label: "Ownership and beneficial owners",
    items: [
      "Shareholders and ownership %",
      "Ultimate beneficial owners (UBOs)",
      "Controlling individuals",
      "Corporate ownership chart",
    ],
  },
  {
    key: "identity_verification",
    label: "Identity verification",
    items: ["ID of relevant UBOs", "ID of directors", "ID of representatives"],
  },
  {
    key: "business_activity_licenses",
    label: "Business activity and licenses",
    items: [
      "Description of business",
      "Website and corporate email",
      "Industry permits",
      "Import / export licenses",
      "Evidence of operational capacity",
    ],
  },
  {
    key: "compliance_reputation",
    label: "Compliance and reputation",
    items: [
      "Sanctions screening",
      "PEP checks",
      "Adverse media",
      "Regulatory actions",
      "Litigation / insolvency indicators",
      "Links to restricted entities",
    ],
  },
  {
    key: "commercial_financial",
    label: "Commercial and financial profile",
    items: [
      "Trade references",
      "Financial statements",
      "Credit information",
      "Banking reference",
      "Evidence of capacity to fulfil the transaction",
    ],
  },
] as const;

export type KybSectionKey = (typeof KYB_SECTIONS)[number]["key"];
export const KYB_SECTION_KEYS = KYB_SECTIONS.map((s) => s.key) as KybSectionKey[];

export const COMMODITY_CHECKS = [
  { key: "supplier_verification", label: "Supplier / manufacturer verification (actual producer, authority, availability, volume capability)" },
  { key: "buyer_verification", label: "Buyer verification (identity, purchasing authority, financial capacity, ability to meet payment terms)" },
  { key: "banking_details", label: "Banking details (beneficiary account belongs to contracting entity, or deviation explained and verified)" },
  { key: "commodity_verification", label: "Commodity verification (specs, quantity, origin, certificates, inspection evidence)" },
  { key: "shipment_readiness", label: "Shipment readiness (loading facilities, shipping arrangements, export docs, Incoterms)" },
  { key: "transaction_risk_review", label: "Transaction risk review (volume, price, payment, route, counterparty consistency)" },
] as const;
export type CommodityCheckKey = (typeof COMMODITY_CHECKS)[number]["key"];

export const VALIDATION_CHECKS = [
  { key: "registration", label: "Registration (official registry: legal name, reg number, incorporation date, status, address)" },
  { key: "ownership_management", label: "Ownership and management (directors, shareholders, UBOs, signatory authority)" },
  { key: "documents", label: "Documents (certificates, licenses, tax registration, filings checked with issuing authority)" },
  { key: "compliance_reputation", label: "Compliance and reputation (sanctions, regulatory warnings, adverse media)" },
  { key: "commercial_capability", label: "Commercial capability (payment terms, delivery capability, banking, availability, inspection evidence)" },
] as const;
export type ValidationCheckKey = (typeof VALIDATION_CHECKS)[number]["key"];

export const VALIDATION_OUTCOMES = [
  "validated",
  "partially_validated",
  "unable_to_validate",
  "escalated_for_review",
] as const;
export type ValidationOutcome = (typeof VALIDATION_OUTCOMES)[number];

export const REGISTRY_LINKS = [
  { label: "Canada: Corporations Canada federal corporation search", url: "https://ised-isde.canada.ca/cc/lgcy/fdrlCrpSrch.html" },
  { label: "UK: Companies House", url: "https://find-and-update.company-information.service.gov.uk/" },
  { label: "OpenCorporates (starting point only; confirm with official sources)", url: "https://opencorporates.com/" },
] as const;

export const KYB_DISCLAIMERS = [
  "A validated company is not automatically a safe trading partner. Company validation and commodity verification are separate checks.",
  "KYB is a due-diligence process, not a guarantee against fraud, financial loss, or failed delivery.",
] as const;

/** Minimum info needed to start a KYB search (registration number and website are optional). */
export function kybSearchReadiness(input: {
  legalName?: string | null;
  country?: string | null;
}): { ready: boolean; missing: string[] } {
  const missing: string[] = [];
  if (!input.legalName?.trim()) missing.push("legal company name");
  if (!input.country?.trim()) missing.push("country of incorporation");
  return { ready: missing.length === 0, missing };
}

export type SectionState = { sectionKey: string; items: { status: KybItemStatus }[] };

/** A section is complete when it has items and every item is verified. */
export function isSectionComplete(section: SectionState): boolean {
  return section.items.length > 0 && section.items.every((i) => i.status === "verified");
}

export function checklistProgress(sections: SectionState[]): {
  complete: number;
  total: number;
  withIssues: number;
  label: string;
} {
  const total = KYB_SECTIONS.length;
  const byKey = new Map(sections.map((s) => [s.sectionKey, s]));
  let complete = 0;
  let withIssues = 0;
  for (const def of KYB_SECTIONS) {
    const s = byKey.get(def.key);
    if (!s) continue;
    if (isSectionComplete(s)) complete += 1;
    if (s.items.some((i) => i.status === "issue")) withIssues += 1;
  }
  return { complete, total, withIssues, label: `${complete} of ${total} complete` };
}

/**
 * Buyer/supplier-facing progress: based only on what the org itself has
 * submitted (fields + uploaded document types). Never exposes staff findings.
 * The staff-only "compliance and reputation" section is excluded.
 */
export function submissionProgress(input: {
  hasLegalIdentity: boolean;
  hasOperatingAddress: boolean;
  hasDirectorsOrSigners: boolean;
  hasOwners: boolean;
  hasBusinessInfo: boolean;
  documentTypes: string[];
}): { sections: { key: string; label: string; complete: boolean }[]; complete: number; total: number; label: string } {
  const docs = new Set(input.documentTypes);
  const has = (types: readonly string[]) => types.some((t) => docs.has(t));
  const flags: Record<string, boolean> = {
    company_identification: input.hasLegalIdentity && input.hasOperatingAddress,
    corporate_documents: has(["certificate_of_incorporation", "business_registration"]),
    directors_representatives: input.hasDirectorsOrSigners,
    ownership_ubo: input.hasOwners || has(["ownership_chart", "ubo_declaration"]),
    identity_verification: has(["identity_document"]),
    business_activity_licenses: input.hasBusinessInfo,
    commercial_financial: has(["trade_reference", "financial_statements", "bank_reference"]),
  };
  const sections = KYB_SECTIONS.filter((s) => s.key !== "compliance_reputation").map((s) => ({
    key: s.key,
    label: s.label,
    complete: Boolean(flags[s.key]),
  }));
  const complete = sections.filter((s) => s.complete).length;
  return { sections, complete, total: sections.length, label: `${complete} of ${sections.length} complete` };
}

export type ApprovalGateInput = {
  orgType: string;
  outcome?: ValidationOutcome | null;
  waived?: boolean;
  actorIsCeoOrGm: boolean;
  overrideReason?: string | null;
};

export type ApprovalGateResult =
  | { allowed: true; warning?: string; overridden?: boolean }
  | {
      allowed: false;
      code: "validation_required" | "validation_blocked" | "override_reason_required";
      message: string;
      canOverride: boolean;
    };

/**
 * Gate for approving/activating an organization.
 * - Suppliers: need validated/partially_validated or a CEO/GM waiver. The override path does not apply (waiver is the path for known suppliers).
 * - Buyers: unable_to_validate / escalated_for_review block unless CEO/GM override with reason. No outcome yet = allowed with warning.
 */
export function evaluateApprovalGate(input: ApprovalGateInput): ApprovalGateResult {
  const outcome = input.outcome ?? null;
  const ok = outcome === "validated" || outcome === "partially_validated";

  if (input.orgType === "supplier") {
    if (input.waived || ok) return { allowed: true };
    return {
      allowed: false,
      code: outcome ? "validation_blocked" : "validation_required",
      message: outcome
        ? "Supplier validation outcome does not permit approval. Resolve it, or have the CEO/GM waive KYB for a known supplier."
        : "New suppliers must complete KYB validation (validated or partially validated) before approval.",
      canOverride: false,
    };
  }

  if (ok || input.waived) return { allowed: true };
  if (!outcome) {
    return { allowed: true, warning: "No KYB validation outcome has been recorded for this organization." };
  }
  if (!input.actorIsCeoOrGm) {
    return {
      allowed: false,
      code: "validation_blocked",
      message: `Validation outcome is "${outcome}". Only the CEO or General Manager may override with a reason.`,
      canOverride: false,
    };
  }
  if (!input.overrideReason?.trim()) {
    return {
      allowed: false,
      code: "override_reason_required",
      message: `Validation outcome is "${outcome}". Provide an override reason to approve.`,
      canOverride: true,
    };
  }
  return { allowed: true, overridden: true, warning: `Approved despite validation outcome "${outcome}" (override).` };
}

export type SimpleCheck = { ok: true } | { ok: false; error: string };

/** Only CEO/GM may waive; only for suppliers; reason mandatory. */
export function validateWaiver(input: {
  orgType: string;
  actorIsCeoOrGm: boolean;
  reason?: string | null;
}): SimpleCheck {
  if (input.orgType !== "supplier") {
    return { ok: false, error: "KYB can only be waived for known suppliers. Buyers always complete KYB." };
  }
  if (!input.actorIsCeoOrGm) return { ok: false, error: "Only the CEO or General Manager can waive KYB." };
  if (!input.reason?.trim() || input.reason.trim().length < 10) {
    return { ok: false, error: "A reason (at least 10 characters) is required to waive KYB." };
  }
  return { ok: true };
}

/** A report is required for any outcome; "validated" also requires all 5 checks verified. */
export function canRecordOutcome(input: {
  outcome: ValidationOutcome;
  checks: { key: string; status: KybItemStatus }[];
  report?: string | null;
}): SimpleCheck {
  if (!input.report?.trim()) return { ok: false, error: "A validation report/summary is required to record an outcome." };
  if (input.outcome === "validated") {
    const byKey = new Map(input.checks.map((c) => [c.key, c.status]));
    const incomplete = VALIDATION_CHECKS.filter((c) => byKey.get(c.key) !== "verified");
    if (incomplete.length) {
      return {
        ok: false,
        error: `All 5 validation checks must be verified for "validated" (pending: ${incomplete.map((c) => c.key).join(", ")}).`,
      };
    }
  }
  return { ok: true };
}
