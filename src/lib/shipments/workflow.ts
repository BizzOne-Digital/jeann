import type { ShipmentLotStatus } from "@/models/ShipmentLot";
import type { Permission } from "@/lib/authorization/permissions";

export type ShipmentLotTransition = {
  from: ShipmentLotStatus;
  to: ShipmentLotStatus;
  permission: Permission;
  requiresReason?: boolean;
  requiresEvidence?: boolean;
};

export const SHIPMENT_LOT_TRANSITIONS: ShipmentLotTransition[] = [
  { from: "planned", to: "awaiting_allocation", permission: "shipments:write" },
  { from: "awaiting_allocation", to: "allocated", permission: "shipments:write" },
  { from: "allocated", to: "booking_requested", permission: "shipments:write" },
  { from: "booking_requested", to: "booking_confirmed", permission: "shipments:write" },
  { from: "booking_confirmed", to: "document_requirements_draft", permission: "shipments:write" },
  { from: "document_requirements_draft", to: "document_requirements_locked", permission: "shipments:approve" },
  { from: "document_requirements_locked", to: "inspection_scheduled", permission: "shipments:write" },
  { from: "inspection_scheduled", to: "goods_preparation", permission: "shipments:write" },
  { from: "goods_preparation", to: "ready_for_loading", permission: "shipments:write" },
  { from: "ready_for_loading", to: "loading", permission: "shipments:write" },
  { from: "loading", to: "loaded", permission: "shipments:write", requiresEvidence: true },
  { from: "loaded", to: "departed", permission: "shipments:write" },
  { from: "departed", to: "in_transit", permission: "shipments:write" },
  { from: "in_transit", to: "arrived", permission: "shipments:write" },
  { from: "arrived", to: "customs_hold", permission: "shipments:write" },
  { from: "customs_hold", to: "customs_clearance", permission: "shipments:write" },
  { from: "customs_clearance", to: "customs_released", permission: "shipments:write" },
  { from: "customs_released", to: "out_for_delivery", permission: "shipments:write" },
  { from: "out_for_delivery", to: "delivered", permission: "shipments:approve", requiresEvidence: true },
  { from: "delivered", to: "closed", permission: "shipments:approve" },
  { from: "planned", to: "cancelled", permission: "shipments:approve", requiresReason: true },
  { from: "delivered", to: "delivery_exception", permission: "shipments:write", requiresReason: true },
  { from: "delivery_exception", to: "claim_opened", permission: "shipments:write" },
];

export function findShipmentTransition(from: ShipmentLotStatus, to: ShipmentLotStatus) {
  return SHIPMENT_LOT_TRANSITIONS.find((t) => t.from === from && t.to === to);
}

export const SHIPMENT_STATUS_LABELS: Record<string, string> = {
  planned: "Planned",
  awaiting_allocation: "Awaiting Allocation",
  allocated: "Allocated",
  booking_requested: "Booking Requested",
  booking_confirmed: "Booking Confirmed",
  document_requirements_draft: "Document Requirements Draft",
  document_requirements_locked: "Document Requirements Locked",
  inspection_scheduled: "Inspection Scheduled",
  goods_preparation: "Goods Preparation",
  ready_for_loading: "Ready for Loading",
  loading: "Loading",
  loaded: "Loaded",
  departed: "Departed",
  in_transit: "In Transit",
  transshipment: "Transshipment",
  arrived: "Arrived",
  discharged: "Discharged",
  customs_hold: "Customs Hold",
  customs_clearance: "Customs Clearance",
  customs_released: "Customs Released",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  delivery_exception: "Delivery Exception",
  claim_opened: "Claim Opened",
  reconciliation_pending: "Reconciliation Pending",
  closed: "Closed",
  cancelled: "Cancelled",
};
