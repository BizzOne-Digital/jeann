import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertShipmentLotAccess } from "@/lib/shipments/access";
import { loadShipmentLotWorkspace } from "@/lib/shipments/workspace-data";
import { SHIPMENT_STATUS_LABELS } from "@/lib/shipments/workflow";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const auth = await requireApiAuth({ permissions: "shipments:read" });
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const { lot, roles } = await assertShipmentLotAccess(auth.ctx.userId, id);

    const isInternal = auth.ctx.isInternal;
    const isBuyer = roles.some((r) => r.startsWith("buyer_"));
    const isSupplier = roles.some((r) => r.startsWith("supplier_"));
    const viewerSide: "internal" | "buyer" | "supplier" = isInternal
      ? "internal"
      : isBuyer
        ? "buyer"
        : "supplier";

    const data = await loadShipmentLotWorkspace(String(lot._id), viewerSide);
    if (!data) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    return NextResponse.json({
      lot: {
        id: String(data.lot._id),
        shipmentLotNumber: data.lot.shipmentLotNumber,
        transactionId: String(data.lot.transactionId),
        transactionSide: data.lot.transactionSide,
        plannedQuantity: data.lot.plannedQuantity?.toString(),
        actualQuantity: data.lot.actualQuantity?.toString(),
        quantityUnit: data.lot.quantityUnit,
        productName: data.lot.productName,
        loadingPort: data.lot.loadingPort,
        destinationPort: data.lot.destinationPort,
        packaging: data.lot.packaging,
        currentStatus: data.lot.currentStatus,
        statusLabel: SHIPMENT_STATUS_LABELS[data.lot.currentStatus] ?? data.lot.currentStatus,
        plannedLoadingDate: data.lot.plannedLoadingDate,
        estimatedArrival: data.lot.estimatedArrival,
        deliveryDate: data.lot.deliveryDate,
      },
      freight: data.freight.map((f) => ({
        id: String(f._id),
        carrier: f.carrier,
        bookingNumber: f.bookingNumber,
        vesselName: f.vesselName,
        voyageNumber: f.voyageNumber,
        status: f.status,
        destinationPort: f.destinationPort,
      })),
      transportUnits: data.transportUnits.map((t) => ({
        id: String(t._id),
        type: t.type,
        containerNumber: t.containerNumber,
        sealNumber: t.sealNumber,
        status: t.status,
      })),
      inspections: data.inspections.map((i) => ({
        id: String(i._id),
        provider: i.inspectionProvider,
        status: i.status,
        scheduledDate: i.scheduledDate,
        verificationStatus: i.verificationStatus,
      })),
      checklists: data.checklists.map((c) => ({
        id: String(c._id),
        version: c.version,
        status: c.status,
      })),
      requirements: data.requirements.map((r) => ({
        id: String(r._id),
        documentType: r.documentType,
        responsibleParty: r.responsibleParty,
        required: r.required,
        uploadStatus: r.uploadStatus,
        approvalStatus: r.approvalStatus,
      })),
      documents: data.documents.map((d) => ({
        id: String(d._id),
        title: d.title,
        shippingDocumentType: d.shippingDocumentType,
        workflowStatus: d.workflowStatus,
      })),
      trackingEvents: data.trackingEvents.map((e) => ({
        id: String(e._id),
        eventType: e.eventType,
        eventTimestamp: e.eventTimestamp,
        location: e.location,
        description: e.description,
        confidence: e.confidence,
        source: e.source,
      })),
      customs: data.customs.map((c) => ({
        id: String(c._id),
        country: c.country,
        currentStatus: c.currentStatus,
        dataSource: c.dataSource,
        holdReason: c.holdReason,
      })),
      deliveries: data.deliveries.map((d) => ({
        id: String(d._id),
        deliveredQuantity: d.deliveredQuantity?.toString(),
        unit: d.unit,
        deliveryDate: d.deliveryDate,
        status: d.status,
        condition: d.condition,
      })),
      claims: data.claims.map((c) => ({
        id: String(c._id),
        claimNumber: c.claimNumber,
        claimType: c.claimType,
        status: c.status,
      })),
      incidents: isInternal
        ? data.incidents.map((i) => ({
            id: String(i._id),
            incidentType: i.incidentType,
            severity: i.severity,
            status: i.status,
          }))
        : [],
      presentationPackages: data.presentationPackages.map((p) => ({
        id: String(p._id),
        packageReference: p.packageReference,
        status: p.status,
      })),
      allocations: isInternal
        ? data.allocations.map((a) => ({
            id: String(a._id),
            buyerShipmentLotId: String(a.buyerShipmentLotId),
            supplierShipmentLotId: String(a.supplierShipmentLotId),
            allocatedQuantity: a.allocatedQuantity?.toString(),
            unit: a.unit,
            allocationStatus: a.allocationStatus,
            compatibilityResult: a.compatibilityResult,
          }))
        : [],
      viewerSide,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
