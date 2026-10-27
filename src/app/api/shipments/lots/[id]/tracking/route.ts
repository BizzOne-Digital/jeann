import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { authContextHasPermission } from "@/lib/auth/auth-context";
import { assertShipmentLotAccess } from "@/lib/shipments/access";
import {
  loadShipmentLotTrackingView,
  syncShipmentLotLiveTracking,
} from "@/lib/shipments/lot-tracking-view";
import { addTrackingReference, recordTrackingEvent } from "@/lib/shipments/tracking-service";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

function viewerSideFromRoles(
  isInternal: boolean,
  roles: string[],
): "internal" | "buyer" | "supplier" {
  if (isInternal) return "internal";
  if (roles.some((r) => r.startsWith("buyer_"))) return "buyer";
  return "supplier";
}

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const auth = await requireApiAuth({ permissions: "shipments:read" });
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const { roles } = await assertShipmentLotAccess(auth.ctx.userId, id);
    const viewerSide = viewerSideFromRoles(auth.ctx.isInternal, roles);
    const canManage =
      auth.ctx.isInternal && authContextHasPermission(auth.ctx, "shipments:write");

    const view = await loadShipmentLotTrackingView(id, viewerSide, {
      canManageTracking: canManage,
    });
    return NextResponse.json(view);
  } catch (error) {
    return handleApiError(error);
  }
}

const postSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("sync"),
  }),
  z.object({
    action: z.literal("add_event"),
    eventType: z.string().min(1),
    eventTimestamp: z.string().min(1),
    location: z.string().optional(),
    description: z.string().min(1),
    confidence: z.enum(["confirmed", "estimated"]).default("estimated"),
    buyerVisible: z.boolean().optional(),
    supplierVisible: z.boolean().optional(),
  }),
  z.object({
    action: z.literal("add_reference"),
    provider: z.string(),
    referenceType: z.string(),
    trackingNumber: z.string(),
    carrier: z.string().optional(),
    scac: z.string().optional(),
  }),
]);

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = postSchema.parse(await request.json());

    if (body.action === "sync") {
      const auth = await requireApiAuth({ permissions: "shipments:read" });
      if ("error" in auth) return auth.error;
      await assertShipmentLotAccess(auth.ctx.userId, id);

      const { roles } = await assertShipmentLotAccess(auth.ctx.userId, id);
      const result = await syncShipmentLotLiveTracking(id);
      const viewerSide = viewerSideFromRoles(auth.ctx.isInternal, roles);
      const view = await loadShipmentLotTrackingView(id, viewerSide, {
        canManageTracking:
          auth.ctx.isInternal && authContextHasPermission(auth.ctx, "shipments:write"),
      });

      return NextResponse.json({
        ...view,
        sync: { refreshed: result.refreshed, snapshot: result.snapshot },
      });
    }

    const auth = await requireApiAuth({ permissions: "shipments:write" });
    if ("error" in auth) return auth.error;
    await assertShipmentLotAccess(auth.ctx.userId, id);

    if (body.action === "add_event") {
      // Manual milestone entry is staff-only; defaults to estimated so nothing shows as confirmed unless staff says so.
      if (!auth.ctx.isInternal) {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
      const evt = await recordTrackingEvent({
        shipmentLotId: id,
        eventType: body.eventType,
        eventTimestamp: new Date(body.eventTimestamp).toISOString(),
        location: body.location,
        description: body.description,
        source: "manual",
        confidence: body.confidence,
        buyerVisible: body.buyerVisible ?? true,
        supplierVisible: body.supplierVisible ?? true,
        actorUserId: auth.ctx.userId,
      });
      return NextResponse.json({ id: String(evt._id) });
    }

    const ref = await addTrackingReference({
      shipmentLotId: id,
      provider: body.provider,
      referenceType: body.referenceType,
      trackingNumber: body.trackingNumber,
      carrier: body.carrier,
      scac: body.scac,
      dataSource:
        body.provider === "terminal49" || body.provider === "easypost" ? body.provider : "manual",
      actorUserId: auth.ctx.userId,
    });

    return NextResponse.json({ id: String(ref._id) });
  } catch (error) {
    return handleApiError(error);
  }
}
