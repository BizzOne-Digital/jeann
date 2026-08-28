import { tryConnectMongo } from "@/lib/db/mongoose";
import { getVisibleTrackingEvents } from "@/lib/shipments/tracking-service";

export async function loadShipmentLotWorkspace(
  lotId: string,
  viewerSide: "internal" | "buyer" | "supplier",
) {
  await tryConnectMongo();
  const {
    ShipmentLot,
    FreightBooking,
    TransportUnit,
    InspectionRecord,
    ShipmentDocumentChecklist,
    ShipmentDocumentRequirement,
    Document,
    TrackingReference,
    CustomsClearanceRecord,
    DeliveryRecord,
    TradeClaim,
    ShipmentIncident,
    PresentationPackage,
    ShipmentLotAllocation,
  } = await import("@/models");

  const lot = await ShipmentLot.findById(lotId).lean();
  if (!lot) return null;

  const trackingEvents = await getVisibleTrackingEvents(lotId, viewerSide);

  const checklists = await ShipmentDocumentChecklist.find({ shipmentLotId: lot._id })
    .sort({ version: -1 })
    .lean();

  const checklistIds = checklists.map((c) => c._id);
  const requirements = checklistIds.length
    ? await ShipmentDocumentRequirement.find({ checklistId: { $in: checklistIds } }).lean()
    : [];

  const docQuery: Record<string, unknown> = {
    shipmentLotId: lot._id,
    deletedAt: null,
  };
  if (viewerSide === "buyer") docQuery.buyerVisible = true;
  if (viewerSide === "supplier") docQuery.supplierVisible = true;

  const documents = await Document.find(docQuery).lean();

  const inspections =
    viewerSide === "buyer"
      ? await InspectionRecord.find({
          shipmentLotId: lot._id,
          status: { $in: ["accepted", "scheduled", "report_uploaded", "under_review"] },
        }).lean()
      : await InspectionRecord.find({ shipmentLotId: lot._id }).lean();

  const freight = await FreightBooking.find({ shipmentLotId: lot._id }).lean();
  const transportUnits = await TransportUnit.find({ shipmentLotId: lot._id }).lean();
  const trackingRefs = await TrackingReference.find({ shipmentLotId: lot._id }).lean();
  const customs = await CustomsClearanceRecord.find({ shipmentLotId: lot._id }).lean();
  const deliveries = await DeliveryRecord.find({ shipmentLotId: lot._id }).lean();

  const claimQuery: Record<string, unknown> = { shipmentLotId: lot._id };
  if (viewerSide === "buyer") claimQuery.buyerVisible = true;
  if (viewerSide === "supplier") claimQuery.supplierVisible = true;
  const claims =
    viewerSide === "internal"
      ? await TradeClaim.find({ shipmentLotId: lot._id }).lean()
      : await TradeClaim.find(claimQuery).lean();

  const incidents =
    viewerSide === "internal"
      ? await ShipmentIncident.find({ shipmentLotId: lot._id }).lean()
      : [];

  const presentationPackages =
    viewerSide === "internal" || viewerSide === "buyer"
      ? await PresentationPackage.find({ shipmentLotId: lot._id }).lean()
      : [];

  const allocations =
    viewerSide === "internal"
      ? await ShipmentLotAllocation.find({
          $or: [
            { buyerShipmentLotId: lot._id },
            { supplierShipmentLotId: lot._id },
          ],
        }).lean()
      : [];

  return {
    lot,
    freight,
    transportUnits,
    inspections,
    checklists,
    requirements,
    documents,
    trackingRefs,
    trackingEvents,
    customs,
    deliveries,
    claims,
    incidents,
    presentationPackages,
    allocations,
  };
}
