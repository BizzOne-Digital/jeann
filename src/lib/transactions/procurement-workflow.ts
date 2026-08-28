import type { TransactionWorkflowStatus } from "@/models/Transaction";
import type { Permission } from "@/lib/authorization/permissions";
import type { WorkflowTransition } from "@/lib/transactions/workflow";

export const PROCUREMENT_TRANSITIONS: WorkflowTransition[] = [
  { from: "draft", to: "procurement_need_identified", permission: "transactions:write" },
  { from: "procurement_need_identified", to: "supplier_selection", permission: "transactions:write" },
  { from: "supplier_selection", to: "offer_pending", permission: "transactions:write" },
  { from: "offer_pending", to: "offer_draft", permission: "transactions:write" },
  { from: "offer_draft", to: "offer_under_review", permission: "transactions:write" },
  {
    from: "offer_under_review",
    to: "offer_changes_requested",
    permission: "documents:approve",
    requiresComment: true,
  },
  {
    from: "offer_under_review",
    to: "offer_approved",
    permission: "documents:approve",
    requiresComment: true,
  },
  { from: "offer_changes_requested", to: "offer_draft", permission: "transactions:write" },
  { from: "offer_approved", to: "icpo_draft", permission: "transactions:write" },
  {
    from: "offer_pending",
    to: "icpo_draft",
    permission: "transactions:approve",
    requiresReason: true,
  },
  { from: "icpo_draft", to: "icpo_under_review", permission: "transactions:write" },
  {
    from: "icpo_under_review",
    to: "icpo_changes_requested",
    permission: "documents:approve",
    requiresComment: true,
  },
  {
    from: "icpo_under_review",
    to: "icpo_approved",
    permission: "documents:approve",
    requiresComment: true,
  },
  { from: "icpo_changes_requested", to: "icpo_draft", permission: "transactions:write" },
  { from: "icpo_approved", to: "icpo_sent", permission: "documents:write" },
  { from: "icpo_sent", to: "contract_pending", permission: "transactions:write" },
  { from: "contract_pending", to: "contract_draft", permission: "transactions:write" },
  { from: "contract_draft", to: "contract_under_review", permission: "transactions:write" },
  {
    from: "contract_under_review",
    to: "contract_changes_requested",
    permission: "documents:approve",
    requiresComment: true,
  },
  {
    from: "contract_under_review",
    to: "contract_approved",
    permission: "documents:approve",
    requiresComment: true,
  },
  { from: "contract_changes_requested", to: "contract_draft", permission: "transactions:write" },
  {
    from: "contract_approved",
    to: "awaiting_finekarts_signature",
    permission: "documents:write",
  },
  {
    from: "awaiting_finekarts_signature",
    to: "awaiting_supplier_signature",
    permission: "documents:write",
  },
  {
    from: "awaiting_supplier_signature",
    to: "contract_executed",
    permission: "documents:approve",
  },
  { from: "contract_executed", to: "banking_setup", permission: "transactions:approve" },
  {
    from: "banking_setup",
    to: "instrument_issuance_requested",
    permission: "banking:select",
  },
  { from: "draft", to: "on_hold", permission: "transactions:approve", requiresReason: true },
  { from: "offer_pending", to: "on_hold", permission: "transactions:approve", requiresReason: true },
  { from: "on_hold", to: "offer_pending", permission: "transactions:approve" },
  { from: "draft", to: "cancelled", permission: "transactions:write", requiresReason: true },
  { from: "offer_pending", to: "cancelled", permission: "transactions:approve", requiresReason: true },
  { from: "offer_under_review", to: "declined", permission: "transactions:approve", requiresReason: true },
  { from: "declined", to: "cancelled", permission: "transactions:approve" },
];

export function findProcurementTransition(
  from: TransactionWorkflowStatus,
  to: TransactionWorkflowStatus,
): WorkflowTransition | undefined {
  return PROCUREMENT_TRANSITIONS.find((t) => t.from === from && t.to === to);
}

export function allowedProcurementTransitionsFrom(
  from: TransactionWorkflowStatus,
): WorkflowTransition[] {
  return PROCUREMENT_TRANSITIONS.filter((t) => t.from === from);
}

export const PROCUREMENT_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  procurement_need_identified: "Procurement Need Identified",
  supplier_selection: "Supplier Selection",
  offer_pending: "Offer Pending",
  offer_draft: "Offer Draft",
  offer_under_review: "Offer Under Review",
  offer_changes_requested: "Offer Changes Requested",
  offer_approved: "Offer Approved",
  icpo_draft: "ICPO Draft",
  icpo_under_review: "ICPO Under Review",
  icpo_changes_requested: "ICPO Changes Requested",
  icpo_approved: "ICPO Approved",
  icpo_sent: "ICPO Sent",
  contract_pending: "Contract Pending",
  contract_draft: "Contract Draft",
  contract_under_review: "Contract Under Review",
  contract_changes_requested: "Contract Changes Requested",
  contract_approved: "Contract Approved",
  awaiting_finekarts_signature: "Awaiting Finekarts Signature",
  awaiting_supplier_signature: "Awaiting Supplier Signature",
  contract_executed: "Contract Executed",
  banking_setup: "Procurement Banking Setup",
  instrument_issuance_requested: "Instrument Issuance Requested",
  on_hold: "On Hold",
  declined: "Declined",
  cancelled: "Cancelled",
};
