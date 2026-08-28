import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertShipmentLotAccess } from "@/lib/shipments/access";
import { SHIPMENT_STATUS_LABELS } from "@/lib/shipments/workflow";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const auth = await requireApiAuth({ permissions: "shipments:read" });
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const { lot } = await assertShipmentLotAccess(auth.ctx.userId, id);

    return NextResponse.json({
      id: String(lot._id),
      shipmentLotNumber: lot.shipmentLotNumber,
      transactionId: String(lot.transactionId),
      transactionSide: lot.transactionSide,
      plannedQuantity: lot.plannedQuantity?.toString(),
      actualQuantity: lot.actualQuantity?.toString(),
      quantityUnit: lot.quantityUnit,
      productName: lot.productName,
      loadingPort: lot.loadingPort,
      destinationPort: lot.destinationPort,
      incoterm: lot.incoterm,
      packaging: lot.packaging,
      plannedLoadingDate: lot.plannedLoadingDate,
      actualLoadingDate: lot.actualLoadingDate,
      estimatedArrival: lot.estimatedArrival,
      actualArrival: lot.actualArrival,
      deliveryDate: lot.deliveryDate,
      currentStatus: lot.currentStatus,
      statusLabel: SHIPMENT_STATUS_LABELS[lot.currentStatus] ?? lot.currentStatus,
      createdAt: lot.createdAt,
      updatedAt: lot.updatedAt,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
