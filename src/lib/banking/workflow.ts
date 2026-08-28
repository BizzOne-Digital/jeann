import type { BankingInstrumentLifecycleStatus } from "@/models/BankingInstrument";
import type { Permission } from "@/lib/authorization/permissions";

export type BankingLifecycleTransition = {
  from: BankingInstrumentLifecycleStatus;
  to: BankingInstrumentLifecycleStatus;
  permission: Permission;
  requiresReason?: boolean;
  requiresEvidence?: boolean;
};

export const BANKING_LIFECYCLE_TRANSITIONS: BankingLifecycleTransition[] = [
  { from: "draft_wording", to: "internal_review", permission: "banking:review" },
  {
    from: "internal_review",
    to: "changes_requested",
    permission: "banking:review",
    requiresReason: true,
  },
  { from: "internal_review", to: "counterparty_review", permission: "banking:review" },
  { from: "changes_requested", to: "draft_wording", permission: "banking:review" },
  { from: "counterparty_review", to: "counterparty_agreed", permission: "banking:review" },
  {
    from: "counterparty_agreed",
    to: "issuance_requested",
    permission: "banking:select",
    requiresEvidence: true,
  },
  {
    from: "issuance_requested",
    to: "issued_copy_uploaded",
    permission: "banking:review",
    requiresEvidence: true,
  },
  {
    from: "issued_copy_uploaded",
    to: "awaiting_advice_evidence",
    permission: "banking:review",
  },
  {
    from: "awaiting_advice_evidence",
    to: "advice_evidence_recorded",
    permission: "banking:review",
    requiresEvidence: true,
  },
  {
    from: "advice_evidence_recorded",
    to: "instrument_comparison_required",
    permission: "banking:review",
  },
  {
    from: "instrument_comparison_required",
    to: "amendment_required",
    permission: "banking:review",
    requiresReason: true,
  },
  {
    from: "instrument_comparison_required",
    to: "active",
    permission: "banking:review",
    requiresEvidence: true,
  },
  { from: "active", to: "presentation_pending", permission: "banking:review" },
  { from: "presentation_pending", to: "presented", permission: "banking:review", requiresEvidence: true },
  { from: "presented", to: "complying", permission: "banking:review" },
  { from: "presented", to: "discrepant", permission: "banking:review", requiresReason: true },
  { from: "discrepant", to: "waiver_pending", permission: "banking:review" },
  { from: "discrepant", to: "amendment_required", permission: "banking:review" },
  { from: "waiver_pending", to: "complying", permission: "banking:review", requiresEvidence: true },
  { from: "complying", to: "honoured", permission: "banking:review", requiresEvidence: true },
  { from: "presented", to: "refused", permission: "banking:review", requiresReason: true },
  { from: "active", to: "expired", permission: "banking:review" },
  { from: "active", to: "cancelled", permission: "banking:select", requiresReason: true },
  { from: "honoured", to: "closed", permission: "banking:review" },
  { from: "refused", to: "closed", permission: "banking:review" },
];

export function findBankingTransition(
  from: BankingInstrumentLifecycleStatus,
  to: BankingInstrumentLifecycleStatus,
): BankingLifecycleTransition | undefined {
  return BANKING_LIFECYCLE_TRANSITIONS.find((t) => t.from === from && t.to === to);
}

export const BANKING_STATUS_LABELS: Record<string, string> = {
  not_selected: "Not Selected",
  draft_wording: "Draft Wording",
  internal_review: "Internal Review",
  changes_requested: "Changes Requested",
  counterparty_review: "Counterparty Review",
  counterparty_agreed: "Counterparty Agreed",
  issuance_requested: "Issuance Requested",
  issued_copy_uploaded: "Issued Copy Uploaded",
  awaiting_advice_evidence: "Awaiting Advice/Authentication Evidence",
  advice_evidence_recorded: "Advised/Authentication Evidence Recorded",
  instrument_comparison_required: "Instrument Comparison Required",
  amendment_required: "Amendment Required",
  active: "Active",
  presentation_pending: "Presentation Pending",
  presented: "Presented",
  complying: "Complying",
  discrepant: "Discrepant",
  waiver_pending: "Waiver Pending",
  honoured: "Honoured",
  refused: "Refused",
  expired: "Expired",
  cancelled: "Cancelled",
  closed: "Closed",
};
