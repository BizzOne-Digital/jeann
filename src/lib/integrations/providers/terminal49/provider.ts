import {
  createTrackingRequest,
  getContainer,
  getShipment,
  isTerminal49Configured,
  refreshContainer,
  terminal49HealthCheck,
} from "@/lib/integrations/providers/terminal49/client";
import { terminal49LotRef } from "@/lib/integrations/providers/terminal49/constants";
import {
  mapReferenceTypeToRequestType,
  mapTerminal49ShipmentToSnapshot,
  mapTerminal49WebhookToEvents,
  extractLotAndRefsFromWebhook,
} from "@/lib/integrations/providers/terminal49/mappers";
import type { ShippingTrackingProvider } from "@/lib/shipments/tracking-provider";

export class Terminal49ShippingProvider implements ShippingTrackingProvider {
  readonly name = "terminal49";

  async createWatch(reference: string, metadata?: Record<string, string>): Promise<{ trackingRequestId?: string }> {
    if (!isTerminal49Configured()) return {};

    const requestType = mapReferenceTypeToRequestType(metadata?.referenceType ?? "bill_of_lading");
    const refNumbers: string[] = [];
    if (metadata?.shipmentLotId) {
      refNumbers.push(terminal49LotRef(metadata.shipmentLotId));
    }

    const result = await createTrackingRequest({
      requestType,
      requestNumber: reference,
      scac: metadata?.scac,
      autoDetectScac: !metadata?.scac,
      refNumbers: refNumbers.length ? refNumbers : undefined,
    });
    return { trackingRequestId: result.trackingRequestId };
  }

  async getCurrentStatus(reference: string) {
    const history = await this.getEventHistory(reference);
    return history[0] ?? null;
  }

  async getEventHistory(_reference: string) {
    return [];
  }

  processWebhook(payload: unknown, _signature?: string) {
    const doc = payload as {
      data?: { id?: string; attributes?: { event?: string; created_at?: string } };
      included?: Array<{ id: string; type: string; attributes?: Record<string, unknown> }>;
    };
    const notificationId = doc.data?.id ?? `unknown-${Date.now()}`;
    return Promise.resolve(mapTerminal49WebhookToEvents(doc, notificationId));
  }

  normalizeEvent(raw: Record<string, unknown>) {
    const events = mapTerminal49WebhookToEvents(
      raw as {
        data?: { id?: string };
        included?: Array<{ id: string; type: string; attributes?: Record<string, unknown> }>;
      },
      String(raw.id ?? "inline"),
    );
    return events[0] ?? null;
  }

  async healthCheck() {
    return terminal49HealthCheck();
  }
}

export { extractLotAndRefsFromWebhook };

export async function fetchTerminal49Snapshot(input: {
  reference: string;
  shipmentId?: string;
  containerId?: string;
}) {
  if (!isTerminal49Configured()) return null;

  let shipmentAttrs: Record<string, unknown> | undefined;
  let containerAttrs: Record<string, unknown> | undefined;

  if (input.containerId) {
    const doc = await getContainer(input.containerId);
    containerAttrs = doc.data.attributes;
    const shipmentRel = doc.data.relationships as
      | { shipment?: { data?: { id?: string } } }
      | undefined;
    const shipmentId = input.shipmentId ?? shipmentRel?.shipment?.data?.id;
    if (shipmentId) {
      const shipmentDoc = await getShipment(shipmentId);
      shipmentAttrs = shipmentDoc.data.attributes;
    }
  } else if (input.shipmentId) {
    const doc = await getShipment(input.shipmentId);
    shipmentAttrs = doc.data.attributes;
  } else {
    return null;
  }

  return mapTerminal49ShipmentToSnapshot(input.reference, shipmentAttrs, containerAttrs);
}

export async function triggerTerminal49ContainerRefresh(containerId: string) {
  if (!isTerminal49Configured()) return null;
  return refreshContainer(containerId);
}
