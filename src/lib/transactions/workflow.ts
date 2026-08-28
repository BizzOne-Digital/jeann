import type { TransactionWorkflowStatus } from "@/models/Transaction";
import type { Permission } from "@/lib/authorization/permissions";

export type WorkflowTransition = {
  from: TransactionWorkflowStatus;
  to: TransactionWorkflowStatus;
  permission: Permission;
  requiresReason?: boolean;
  requiresComment?: boolean;
};

export const WORKFLOW_TRANSITIONS: WorkflowTransition[] = [
  { from: "draft", to: "submitted", permission: "transactions:write" },
  { from: "submitted", to: "qualification", permission: "transactions:approve" },
  { from: "submitted", to: "more_information_required", permission: "transactions:approve", requiresComment: true },
  { from: "submitted", to: "declined", permission: "transactions:approve", requiresReason: true },
  { from: "submitted", to: "on_hold", permission: "transactions:approve", requiresReason: true },
  { from: "qualification", to: "more_information_required", permission: "transactions:approve", requiresComment: true },
  { from: "qualification", to: "qualified", permission: "transactions:approve" },
  { from: "qualification", to: "declined", permission: "transactions:approve", requiresReason: true },
  { from: "qualification", to: "on_hold", permission: "transactions:approve", requiresReason: true },
  { from: "more_information_required", to: "submitted", permission: "transactions:write" },
  { from: "qualified", to: "offer_draft", permission: "transactions:write" },
  { from: "qualified", to: "icpo_pending", permission: "transactions:approve", requiresReason: true },
  { from: "offer_draft", to: "offer_under_review", permission: "transactions:write" },
  { from: "offer_under_review", to: "offer_changes_requested", permission: "documents:approve", requiresComment: true },
  { from: "offer_under_review", to: "offer_approved", permission: "documents:approve", requiresComment: true },
  { from: "offer_changes_requested", to: "offer_draft", permission: "transactions:write" },
  { from: "offer_approved", to: "offer_sent", permission: "documents:write" },
  { from: "offer_sent", to: "icpo_pending", permission: "transactions:write" },
  { from: "icpo_pending", to: "icpo_draft", permission: "transactions:write" },
  { from: "icpo_draft", to: "icpo_submitted", permission: "transactions:write" },
  { from: "icpo_submitted", to: "icpo_under_review", permission: "transactions:approve" },
  { from: "icpo_under_review", to: "icpo_changes_requested", permission: "documents:approve", requiresComment: true },
  { from: "icpo_under_review", to: "icpo_approved", permission: "documents:approve", requiresComment: true },
  { from: "icpo_changes_requested", to: "icpo_draft", permission: "transactions:write" },
  { from: "icpo_approved", to: "contract_draft", permission: "transactions:write" },
  { from: "contract_draft", to: "contract_under_review", permission: "transactions:write" },
  { from: "contract_under_review", to: "contract_changes_requested", permission: "documents:approve", requiresComment: true },
  { from: "contract_under_review", to: "contract_approved", permission: "documents:approve", requiresComment: true },
  { from: "contract_changes_requested", to: "contract_draft", permission: "transactions:write" },
  { from: "contract_approved", to: "awaiting_buyer_signature", permission: "documents:write" },
  { from: "awaiting_buyer_signature", to: "awaiting_finekarts_signature", permission: "documents:write" },
  { from: "awaiting_finekarts_signature", to: "contract_executed", permission: "documents:approve" },
  { from: "contract_executed", to: "banking_setup", permission: "transactions:approve" },
  { from: "on_hold", to: "qualification", permission: "transactions:approve" },
  { from: "on_hold", to: "submitted", permission: "transactions:approve" },
  { from: "draft", to: "cancelled", permission: "transactions:write", requiresReason: true },
  { from: "submitted", to: "cancelled", permission: "transactions:approve", requiresReason: true },
  { from: "qualification", to: "cancelled", permission: "transactions:approve", requiresReason: true },
  { from: "qualified", to: "cancelled", permission: "transactions:approve", requiresReason: true },
];

export function findTransition(
  from: TransactionWorkflowStatus,
  to: TransactionWorkflowStatus,
): WorkflowTransition | undefined {
  return WORKFLOW_TRANSITIONS.find((t) => t.from === from && t.to === to);
}

export function allowedTransitionsFrom(
  from: TransactionWorkflowStatus,
): WorkflowTransition[] {
  return WORKFLOW_TRANSITIONS.filter((t) => t.from === from);
}

export const WORKFLOW_STATUS_LABELS: Record<TransactionWorkflowStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  qualification: "Qualification",
  more_information_required: "More Information Required",
  qualified: "Qualified",
  declined: "Declined",
  on_hold: "On Hold",
  offer_draft: "Offer Draft",
  offer_under_review: "Offer Under Review",
  offer_changes_requested: "Offer Changes Requested",
  offer_approved: "Offer Approved",
  offer_sent: "Offer Sent",
  icpo_pending: "ICPO Pending",
  icpo_draft: "ICPO Draft",
  icpo_submitted: "ICPO Submitted",
  icpo_under_review: "ICPO Under Review",
  icpo_changes_requested: "ICPO Changes Requested",
  icpo_approved: "ICPO Approved",
  contract_draft: "Contract Draft",
  contract_under_review: "Contract Under Review",
  contract_changes_requested: "Contract Changes Requested",
  contract_approved: "Contract Approved",
  awaiting_buyer_signature: "Awaiting Buyer Signature",
  awaiting_finekarts_signature: "Awaiting Finekarts Signature",
  contract_executed: "Contract Executed",
  banking_setup: "Banking Setup",
  procurement_need_identified: "Procurement Need Identified",
  supplier_selection: "Supplier Selection",
  offer_pending: "Offer Pending",
  icpo_sent: "ICPO Sent",
  contract_pending: "Contract Pending",
  awaiting_supplier_signature: "Awaiting Supplier Signature",
  instrument_issuance_requested: "Instrument Issuance Requested",
  cancelled: "Cancelled",
};
