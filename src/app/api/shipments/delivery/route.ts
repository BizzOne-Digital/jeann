import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { confirmDelivery } from "@/lib/shipments/delivery-service";

export const runtime = "nodejs";

const schema = z.object({
  shipmentLotId: z.string(),
  deliveredQuantity: z.string(),
  unit: z.string(),
  deliveryDate: z.string(),
  recipient: z.string().optional(),
  deliveryLocation: z.string().optional(),
  proofDocumentId: z.string().optional(),
  condition: z.string().optional(),
  shortageDamageNotes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "shipments:write" });
    if ("error" in auth) return auth.error;

    const body = schema.parse(await request.json());
    const record = await confirmDelivery({
      ...body,
      actorUserId: auth.ctx.userId,
    });

    return NextResponse.json({
      id: String(record._id),
      status: record.status,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "delivery_already_confirmed") {
      return NextResponse.json({ error: "Delivery already confirmed." }, { status: 409 });
    }
    return handleApiError(error);
  }
}
