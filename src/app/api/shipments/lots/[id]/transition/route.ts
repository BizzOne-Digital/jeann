import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertShipmentLotAccess } from "@/lib/shipments/access";
import { transitionShipmentLot } from "@/lib/shipments/lot-service";
import type { ShipmentLotStatus } from "@/models/ShipmentLot";

export const runtime = "nodejs";

const schema = z.object({
  toStatus: z.string(),
  reason: z.string().optional(),
  evidence: z.string().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const auth = await requireApiAuth({ permissions: "shipments:write" });
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const { lot, permissions } = await assertShipmentLotAccess(auth.ctx.userId, id);
    const body = schema.parse(await request.json());

    const updated = await transitionShipmentLot({
      lotId: String(lot._id),
      toStatus: body.toStatus as ShipmentLotStatus,
      actorUserId: auth.ctx.userId,
      permissions,
      reason: body.reason,
      evidence: body.evidence,
    });

    return NextResponse.json({
      id: String(updated._id),
      currentStatus: updated.currentStatus,
    });
  } catch (error) {
    if (error instanceof Error) {
      const code = error.message;
      if (
        [
          "invalid_transition",
          "forbidden",
          "reason_required",
          "evidence_required",
          "booking_required",
          "delivery_evidence_required",
          "shipment_immutable",
        ].includes(code)
      ) {
        return NextResponse.json({ error: code }, { status: 400 });
      }
    }
    return handleApiError(error);
  }
}
