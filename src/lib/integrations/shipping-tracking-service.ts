import { Types } from "mongoose";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { getShippingTrackingProviderByAdapter } from "@/lib/integrations/providers/shipping-tracking-registry";
import { syncEasyPostReference } from "@/lib/integrations/providers/easypost/provider";
import {
  extractLotAndRefsFromWebhook,
  fetchTerminal49Snapshot,
} from "@/lib/integrations/providers/terminal49/provider";
import { recordTrackingEvent } from "@/lib/shipments/tracking-service";

const LIVE_PROVIDERS = new Set(["terminal49", "easypost"]);

export async function registerCarrierWatch(input: {
  shipmentLotId: string;
  provider: string;
  referenceType: string;
  trackingNumber: string;
  carrier?: string;
  scac?: string;
  trackingReferenceId: string;
}) {
  if (!LIVE_PROVIDERS.has(input.provider)) return;

  const shipping = getShippingTrackingProviderByAdapter(input.provider);
  const metadata: Record<string, string> = {
    shipmentLotId: input.shipmentLotId,
    referenceType: input.referenceType,
  };
  if (input.provider === "terminal49") {
    const scac = input.scac ?? input.carrier;
    if (scac) metadata.scac = scac;
  }
  if (input.provider === "easypost") {
    const carrier = input.carrier ?? input.scac;
    if (!carrier) throw new Error("easypost_carrier_required");
    metadata.carrier = carrier;
  }

  const watch = await shipping.createWatch(input.trackingNumber, metadata);

  await tryConnectMongo();
  const { TrackingReference } = await import("@/models");
  const resourceUpdate: Record<string, string> = {};
  if (watch && "trackingRequestId" in watch && watch.trackingRequestId) {
    if (input.provider === "terminal49") {
      resourceUpdate["providerResourceIds.trackingRequestId"] = watch.trackingRequestId;
    }
    if (input.provider === "easypost") {
      resourceUpdate["providerResourceIds.trackerId"] = watch.trackingRequestId;
    }
  }

  await TrackingReference.updateOne(
    { _id: new Types.ObjectId(input.trackingReferenceId) },
    {
      $set: {
        dataSource: input.provider,
        lastSynchronizedAt: new Date(),
        ...resourceUpdate,
      },
    },
  );

  if (input.provider === "easypost" && watch?.trackingRequestId) {
    const synced = await syncEasyPostReference({
      reference: input.trackingNumber,
      trackerId: watch.trackingRequestId,
    });
    for (const evt of synced.events) {
      await recordTrackingEvent({
        shipmentLotId: input.shipmentLotId,
        trackingReferenceId: input.trackingReferenceId,
        eventType: evt.eventType,
        eventTimestamp: evt.eventTimestamp.toISOString(),
        location: evt.location,
        description: evt.description ?? evt.eventType,
        source: evt.source,
        sourceReference: evt.sourceReference,
        confidence: evt.confirmedStatus ? "confirmed" : "estimated",
        rawProviderStatus: evt.rawProviderStatus,
        buyerVisible: true,
        supplierVisible: true,
      });
    }
  }
}

export async function processTerminal49WebhookPayload(payload: unknown): Promise<{
  processed: number;
  shipmentLotId?: string;
}> {
  const provider = getShippingTrackingProviderByAdapter("terminal49");
  const events = await provider.processWebhook(payload);
  const context = extractLotAndRefsFromWebhook(
    payload as { included?: Array<{ id: string; type: string; attributes?: Record<string, unknown> }> },
  );

  let shipmentLotId = context.shipmentLotId;

  await tryConnectMongo();
  const { TrackingReference } = await import("@/models");

  if (!shipmentLotId && (context.containerNumber || context.containerId)) {
    const query: Record<string, unknown> = { provider: "terminal49", active: true };
    if (context.containerNumber) query.trackingNumber = context.containerNumber;
    const ref = await TrackingReference.findOne(query).lean();
    if (ref) shipmentLotId = String(ref.shipmentLotId);
  }

  if (!shipmentLotId) {
    return { processed: 0 };
  }

  const refDoc = await TrackingReference.findOne({
    shipmentLotId: new Types.ObjectId(shipmentLotId),
    provider: "terminal49",
    active: true,
  });

  if (refDoc && (context.shipmentId || context.containerId)) {
    refDoc.providerResourceIds = {
      ...refDoc.providerResourceIds,
      shipmentId: context.shipmentId ?? refDoc.providerResourceIds?.shipmentId,
      containerId: context.containerId ?? refDoc.providerResourceIds?.containerId,
    };
    refDoc.lastSynchronizedAt = new Date();
    await refDoc.save();
  }

  let processed = 0;
  for (const evt of events) {
    await recordTrackingEvent({
      shipmentLotId,
      trackingReferenceId: refDoc ? String(refDoc._id) : undefined,
      eventType: evt.eventType,
      eventTimestamp: evt.eventTimestamp.toISOString(),
      eventTimezone: evt.eventTimezone,
      location: evt.location,
      description: evt.description ?? evt.eventType,
      source: evt.source,
      sourceReference: evt.sourceReference,
      confidence: evt.confirmedStatus ? "confirmed" : "estimated",
      rawProviderStatus: evt.rawProviderStatus,
      buyerVisible: true,
      supplierVisible: true,
    });
    processed += 1;
  }

  if (refDoc?.providerResourceIds?.containerId || refDoc?.providerResourceIds?.shipmentId) {
    await fetchTerminal49Snapshot({
      reference: refDoc.trackingNumber,
      shipmentId: refDoc.providerResourceIds?.shipmentId,
      containerId: refDoc.providerResourceIds?.containerId,
    }).catch(() => null);
  }

  return { processed, shipmentLotId };
}
