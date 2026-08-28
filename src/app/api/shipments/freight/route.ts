import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Types } from "mongoose";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";

export const runtime = "nodejs";

const schema = z.object({
  shipmentLotId: z.string(),
  freightForwarder: z.string().optional(),
  carrier: z.string().optional(),
  bookingNumber: z.string().optional(),
  transportMode: z.enum(["ocean", "air", "road", "rail", "multimodal"]),
  vesselName: z.string().optional(),
  imoNumber: z.string().optional(),
  voyageNumber: z.string().optional(),
  containerReferences: z.array(z.string()).optional(),
  loadingPort: z.string().optional(),
  destinationPort: z.string().optional(),
  plannedDeparture: z.string().optional(),
  estimatedArrival: z.string().optional(),
  status: z.enum(["draft", "requested", "confirmed"]).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "shipments:write" });
    if ("error" in auth) return auth.error;

    const body = schema.parse(await request.json());
    const { FreightBooking } = await import("@/models");

    const booking = await FreightBooking.create({
      shipmentLotId: new Types.ObjectId(body.shipmentLotId),
      freightForwarder: body.freightForwarder,
      carrier: body.carrier,
      bookingNumber: body.bookingNumber,
      bookingDate: new Date(),
      transportMode: body.transportMode,
      vesselName: body.vesselName,
      imoNumber: body.imoNumber,
      voyageNumber: body.voyageNumber,
      containerReferences: body.containerReferences,
      loadingPort: body.loadingPort,
      destinationPort: body.destinationPort,
      plannedDeparture: body.plannedDeparture ? new Date(body.plannedDeparture) : undefined,
      estimatedArrival: body.estimatedArrival ? new Date(body.estimatedArrival) : undefined,
      status: body.status ?? "confirmed",
      source: "manual",
      createdByUserId: new Types.ObjectId(auth.ctx.userId),
    });

    return NextResponse.json({
      id: String(booking._id),
      status: booking.status,
      bookingNumber: booking.bookingNumber,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
