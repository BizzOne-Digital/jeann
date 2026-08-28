import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertInternalShipmentAllocationAccess } from "@/lib/shipments/access";
import {
  checkLotAllocationCompatibility,
  confirmShipmentAllocation,
  cancelShipmentAllocation,
} from "@/lib/shipments/allocation-service";
import { createShipmentLotAllocation } from "@/lib/shipments/lot-service";
import { z } from "zod";

const createAllocSchema = z.object({
  dealGroupId: z.string(),
  buyerShipmentLotId: z.string(),
  supplierShipmentLotId: z.string(),
  allocatedQuantity: z.string(),
  unit: z.string(),
});

export const runtime = "nodejs";

const compatibilitySchema = z.object({
  action: z.literal("compatibility_check"),
  buyerShipmentLotId: z.string(),
  supplierShipmentLotId: z.string(),
});

const confirmSchema = z.object({
  action: z.literal("confirm"),
  allocationId: z.string(),
});

const cancelSchema = z.object({
  action: z.literal("cancel"),
  allocationId: z.string(),
  reason: z.string(),
});

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "deal_groups:read" });
    if ("error" in auth) return auth.error;

    if (!auth.ctx.isInternal) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const roles = auth.ctx.memberships.flatMap((m) => m.roles);
    assertInternalShipmentAllocationAccess(roles);

    const { ShipmentLotAllocation } = await import("@/models");
    const items = await ShipmentLotAllocation.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({
      items: items.map((a) => ({
        id: String(a._id),
        dealGroupId: String(a.dealGroupId),
        buyerShipmentLotId: String(a.buyerShipmentLotId),
        supplierShipmentLotId: String(a.supplierShipmentLotId),
        allocatedQuantity: a.allocatedQuantity?.toString(),
        unit: a.unit,
        allocationStatus: a.allocationStatus,
        compatibilityResult: a.compatibilityResult,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "deal_groups:write" });
    if ("error" in auth) return auth.error;

    const roles = auth.ctx.memberships.flatMap((m) => m.roles);
    assertInternalShipmentAllocationAccess(roles);

    const body = await request.json();

    if (body.action === "compatibility_check") {
      const parsed = compatibilitySchema.parse(body);
      const result = await checkLotAllocationCompatibility(parsed);
      return NextResponse.json(result);
    }

    if (body.action === "confirm") {
      const parsed = confirmSchema.parse(body);
      const alloc = await confirmShipmentAllocation({
        allocationId: parsed.allocationId,
        actorUserId: auth.ctx.userId,
      });
      return NextResponse.json({
        id: String(alloc._id),
        allocationStatus: alloc.allocationStatus,
      });
    }

    if (body.action === "cancel") {
      const parsed = cancelSchema.parse(body);
      const alloc = await cancelShipmentAllocation({
        allocationId: parsed.allocationId,
        reason: parsed.reason,
        actorUserId: auth.ctx.userId,
      });
      return NextResponse.json({
        id: String(alloc._id),
        allocationStatus: alloc.allocationStatus,
      });
    }

    const parsed = createAllocSchema.parse(body);
    const alloc = await createShipmentLotAllocation({
      ...parsed,
      actorUserId: auth.ctx.userId,
    });
    return NextResponse.json({
      id: String(alloc._id),
      allocationStatus: alloc.allocationStatus,
      compatibilityResult: alloc.compatibilityResult,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
