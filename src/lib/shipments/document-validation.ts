import { tryConnectMongo } from "@/lib/db/mongoose";
import {
  compareShippingDocumentFields,
  compareToLotReference,
  type ShippingDocFields,
} from "@/lib/shipments/cross-document-checks";

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

  // Cross-document exact-match checks from structured data of each document's current version.
  const { DocumentVersion } = await import("@/models");
  const versionIds = docs.map((d) => d.currentVersionId).filter(Boolean);
  const versions = versionIds.length
    ? await DocumentVersion.find({ _id: { $in: versionIds } }).select("documentId structuredData").lean()
    : [];
  const fieldsByDoc: ShippingDocFields[] = [];
  for (const doc of docs) {
    if (!doc.shippingDocumentType) continue;
    const v = versions.find((x) => String(x.documentId) === String(doc._id));
    const data = (v?.structuredData ?? {}) as Record<string, unknown>;
    if (!Object.keys(data).length) continue;
    fieldsByDoc.push({
      documentType: doc.shippingDocumentType,
      label: doc.title,
      amount: data.amount as string | number | undefined,
      currency: data.currency as string | undefined,
      consignee: data.consignee as string | undefined,
      shipper: data.shipper as string | undefined,
      blNumber: data.blNumber as string | undefined,
      quantity: data.quantity as string | number | undefined,
      quantityUnit: data.quantityUnit as string | undefined,
      product: data.product as string | undefined,
      portOfLoading: data.portOfLoading as string | undefined,
      portOfDischarge: data.portOfDischarge as string | undefined,
      vesselName: data.vesselName as string | undefined,
      issueDate: data.issueDate as string | undefined,
      shippedOnBoardDate: data.shippedOnBoardDate as string | undefined,
      lcNumber: data.lcNumber as string | undefined,
    });
  }
  const crossFindings = [
    ...compareShippingDocumentFields(fieldsByDoc),
    ...compareToLotReference(fieldsByDoc, {
      product: lot.productName,
      portOfLoading: lot.loadingPort,
      portOfDischarge: lot.destinationPort,
      quantity: lot.plannedQuantity ? Number(lot.plannedQuantity.toString()) : undefined,
      quantityUnit: lot.quantityUnit,
    }),
  ];
  for (const f of crossFindings) {
    if (f.severity === "blocking") blocking.push(f);
    else if (f.severity === "warning") warnings.push(f);
    else informational.push(f);
  }

  informational.push({
    severity: "info",
    field: "validation",
    message:
      "Deterministic validation only — does not constitute bank or customs approval.",
  });

  return { blocking, warnings, informational };
}
