import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { createShipmentLot } from "@/lib/shipments/lot-service";
import { SHIPMENT_STATUS_LABELS } from "@/lib/shipments/workflow";

export const runtime = "nodejs";

const createSchema = z.object({
  transactionId: z.string(),
  transactionSide: z.enum(["buyer_sale", "supplier_purchase"]),
  plannedQuantity: z.string(),
  quantityUnit: z.string(),
  productName: z.string().optional(),
  loadingPort: z.string().optional(),
  destinationPort: z.string().optional(),
  plannedLoadingDate: z.string().optional(),
  estimatedArrival: z.string().optional(),
  packaging: z.string().optional(),
});

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "shipments:read" });
    if ("error" in auth) return auth.error;

    const { ShipmentLot, Transaction } = await import("@/models");
    const ctx = auth.ctx;
    const isInternal = ctx.isInternal;

    let query: Record<string, unknown> = {};
    if (!isInternal) {
      const membership = ctx.memberships.find((m) => m.status === "active");
      if (!membership) {
        return NextResponse.json({ items: [] });
      }
      const txs = await Transaction.find({ organizationId: membership.organizationId }).lean();
      const txIds = txs.map((t) => t._id);
      const roles = ctx.memberships.flatMap((m) => m.roles);
      const isBuyer = roles.some((r) => r.startsWith("buyer_"));
      const isSupplier = roles.some((r) => r.startsWith("supplier_"));
      query = {
        transactionId: { $in: txIds },
        ...(isBuyer ? { transactionSide: "buyer_sale" } : {}),
        ...(isSupplier && !isBuyer ? { transactionSide: "supplier_purchase" } : {}),
      };
    }

    const items = await ShipmentLot.find(query).sort({ createdAt: -1 }).limit(100).lean();

    return NextResponse.json({
      items: items.map((lot) => ({
        id: String(lot._id),
        shipmentLotNumber: lot.shipmentLotNumber,
        transactionId: String(lot.transactionId),
        transactionSide: lot.transactionSide,
        plannedQuantity: lot.plannedQuantity?.toString(),
        quantityUnit: lot.quantityUnit,
        loadingPort: lot.loadingPort,
        destinationPort: lot.destinationPort,
        currentStatus: lot.currentStatus,
        statusLabel: SHIPMENT_STATUS_LABELS[lot.currentStatus] ?? lot.currentStatus,
        plannedLoadingDate: lot.plannedLoadingDate,
        estimatedArrival: lot.estimatedArrival,
        createdAt: lot.createdAt,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "shipments:write" });
    if ("error" in auth) return auth.error;

    const body = createSchema.parse(await request.json());
    const lot = await createShipmentLot({
      ...body,
      actorUserId: auth.ctx.userId,
    });

    return NextResponse.json({
      id: String(lot._id),
      shipmentLotNumber: lot.shipmentLotNumber,
      currentStatus: lot.currentStatus,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
