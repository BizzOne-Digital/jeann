import { tryConnectMongo } from "@/lib/db/mongoose";

export type ValidationFinding = {
  severity: "blocking" | "warning" | "info";
  field: string;
  message: string;
  expected?: string;
  actual?: string;
  suggestion?: string;
};

export type DocumentValidationResult = {
  documentId?: string;
  revisionId?: string;
  blocking: ValidationFinding[];
  warnings: ValidationFinding[];
  informational: ValidationFinding[];
};

export async function validateShippingDocuments(
  shipmentLotId: string,
): Promise<DocumentValidationResult> {
  const empty: DocumentValidationResult = {
    blocking: [],
    warnings: [],
    informational: [],
  };

  if (!await tryConnectMongo()) return empty;

  const { ShipmentLot, FreightBooking, Document } = await import("@/models");
  const lot = await ShipmentLot.findById(shipmentLotId).lean();
  if (!lot) return empty;

  const booking = await FreightBooking.findOne({
    shipmentLotId: lot._id,
    status: "confirmed",
  }).lean();
  const docs = await Document.find({
    shipmentLotId: lot._id,
    deletedAt: null,
  }).lean();

  const blocking: ValidationFinding[] = [];
  const warnings: ValidationFinding[] = [];
  const informational: ValidationFinding[] = [];

  if (lot.loadingPort && lot.destinationPort && lot.loadingPort === lot.destinationPort) {
    blocking.push({
      severity: "blocking",
      field: "destinationPort",
      message: "Loading port matches destination port.",
      expected: "Distinct ports",
      actual: lot.destinationPort,
      suggestion: "Correct port mismatch in shipment lot or documents.",
    });
  }

  if (!booking && lot.currentStatus !== "planned" && lot.currentStatus !== "awaiting_allocation") {
    warnings.push({
      severity: "warning",
      field: "freightBooking",
      message: "No confirmed freight booking found for this shipment lot.",
    });
  }

  if (booking?.destinationPort && lot.destinationPort) {
    if (booking.destinationPort !== lot.destinationPort) {
      blocking.push({
        severity: "blocking",
        field: "destinationPort",
        message: "Freight booking destination port does not match shipment lot.",
        expected: lot.destinationPort,
        actual: booking.destinationPort,
      });
    }
  }

  for (const doc of docs) {
    if (doc.workflowStatus === "changes_requested") {
      warnings.push({
        severity: "warning",
        field: "documentStatus",
        message: `Document ${doc.title ?? doc.category} has changes requested.`,
        actual: doc.workflowStatus,
      });
    }
  }

  informational.push({
    severity: "info",
    field: "validation",
    message:
      "Deterministic validation only — does not constitute bank or customs approval.",
  });

  return { blocking, warnings, informational };
}
