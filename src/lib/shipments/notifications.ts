import { notifyAdmins, notifyUser } from "@/lib/notifications/service";
import { SHIPMENT_STATUS_LABELS } from "@/lib/shipments/workflow";

export async function notifyShipmentLotCreated(input: {
  shipmentLotNumber: string;
  lotId: string;
  transactionSide: string;
  actorUserId: string;
}) {
  await notifyAdmins({
    type: "shipment.lot_created",
    title: "Shipment lot created",
    body: `${input.shipmentLotNumber} (${input.transactionSide}) was created.`,
    href: `/workspace/shipments/${input.lotId}`,
  });
}

export async function notifyShipmentStatusChange(input: {
  shipmentLotNumber: string;
  lotId: string;
  toStatus: string;
  organizationId?: string;
  notifyUserIds?: string[];
}) {
  const label = SHIPMENT_STATUS_LABELS[input.toStatus] ?? input.toStatus;
  const body = `${input.shipmentLotNumber} status updated to ${label}.`;

  if (input.notifyUserIds?.length) {
    for (const userId of input.notifyUserIds) {
      await notifyUser({
        userId,
        organizationId: input.organizationId,
        type: "shipment.status_updated",
        title: "Shipment status updated",
        body,
        href: `/portal/buyer/shipments/${input.lotId}`,
      });
    }
  }

  await notifyAdmins({
    type: "shipment.status_updated",
    title: "Shipment status updated",
    body,
    href: `/workspace/shipments/${input.lotId}`,
  });
}

export async function notifyFreightBookingConfirmed(input: {
  shipmentLotNumber: string;
  lotId: string;
  bookingNumber?: string;
}) {
  await notifyAdmins({
    type: "shipment.freight_confirmed",
    title: "Freight booking confirmed",
    body: `Booking ${input.bookingNumber ?? "—"} for ${input.shipmentLotNumber}.`,
    href: `/workspace/shipments/${input.lotId}`,
  });
}

export async function notifyInspectionScheduled(input: {
  shipmentLotNumber: string;
  lotId: string;
  provider: string;
  scheduledDate?: Date;
}) {
  await notifyAdmins({
    type: "shipment.inspection_scheduled",
    title: "Inspection scheduled",
    body: `${input.provider} inspection scheduled for ${input.shipmentLotNumber}.`,
    href: `/workspace/shipments/${input.lotId}`,
  });
}

export async function notifyChecklistLocked(input: {
  shipmentLotNumber: string;
  lotId: string;
}) {
  await notifyAdmins({
    type: "shipment.checklist_locked",
    title: "Document checklist locked",
    body: `Checklist locked for ${input.shipmentLotNumber}.`,
    href: `/workspace/shipments/${input.lotId}`,
  });
}

export async function notifyPresentationPackageReady(input: {
  packageReference: string;
  lotId: string;
}) {
  await notifyAdmins({
    type: "shipment.presentation_ready",
    title: "Presentation package ready",
    body: `Package ${input.packageReference} is ready for banking review.`,
    href: `/workspace/shipments/${input.lotId}`,
  });
}

export async function notifyClaimSubmitted(input: {
  claimNumber: string;
  lotId: string;
}) {
  await notifyAdmins({
    type: "shipment.claim_submitted",
    title: "Trade claim submitted",
    body: `Claim ${input.claimNumber} requires review.`,
    href: `/workspace/shipments/${input.lotId}`,
  });
}

export async function notifyDeliveryConfirmed(input: {
  shipmentLotNumber: string;
  lotId: string;
  notifyUserIds?: string[];
  organizationId?: string;
}) {
  const body = `Delivery confirmed for ${input.shipmentLotNumber}.`;
  if (input.notifyUserIds?.length) {
    for (const userId of input.notifyUserIds) {
      await notifyUser({
        userId,
        organizationId: input.organizationId,
        type: "shipment.delivery_confirmed",
        title: "Delivery confirmed",
        body,
        href: `/portal/buyer/shipments/${input.lotId}`,
      });
    }
  }
  await notifyAdmins({
    type: "shipment.delivery_confirmed",
    title: "Delivery confirmed",
    body,
    href: `/workspace/shipments/${input.lotId}`,
  });
}
