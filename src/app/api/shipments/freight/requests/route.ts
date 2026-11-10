import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { writeAuditEvent } from "@/lib/audit/log";
import { getBookingProvider, listBookingProviders } from "@/lib/shipments/booking-provider";
import { bookingRequestSchema, requiresCharteringBroker } from "@/lib/shipments/booking-request";

export const runtime = "nodejs";

/** Finekarts staff submit a shipment booking request through the central booking module. */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "shipments:write" });
    if ("error" in auth) return auth.error;
    if (!auth.ctx.isInternal) {
      return NextResponse.json({ error: "Only Finekarts staff can submit booking requests." }, { status: 403 });
    }

    const parsed = bookingRequestSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Complete the cargo, ports, loading date, FOB or CIF term, shipper and consignee." },
        { status: 422 },
      );
    }
    const input = parsed.data;
    if (!Types.ObjectId.isValid(input.shipmentLotId)) {
      return NextResponse.json({ error: "Shipment lot not found." }, { status: 404 });
    }

    const provider = getBookingProvider(input.provider);
    if (!provider) {
      return NextResponse.json(
        { error: `Provider "${input.provider}" is not connected yet. Available: ${listBookingProviders().join(", ")}.` },
        { status: 422 },
      );
    }

    const { FreightBooking, ShipmentLot } = await import("@/models");
    const lot = await ShipmentLot.exists({ _id: input.shipmentLotId });
    if (!lot) return NextResponse.json({ error: "Shipment lot not found." }, { status: 404 });

    const result = await provider.submit(input);
    const booking = await FreightBooking.create({
      shipmentLotId: new Types.ObjectId(input.shipmentLotId),
      transportMode: "ocean",
      carrier: provider.name === "manual" ? undefined : provider.name,
      bookingNumber: result.bookingNumber,
      bookingDate: new Date(),
      vesselName: result.vesselName,
      plannedDeparture: result.plannedDeparture,
      loadingPort: input.loadingPort,
      destinationPort: input.destinationPort,
      status: result.status,
      source: provider.name,
      cargoType: input.cargoType,
      commodity: input.commodity,
      quantityMt: input.quantityMt,
      preferredLoadingDate: input.preferredLoadingDate,
      incoterm: input.incoterm,
      packagingHandling: input.packagingHandling,
      shipperName: input.shipperName,
      consigneeName: input.consigneeName,
      customerAccountNumber: input.customerAccountNumber,
      providerReference: result.providerReference,
      createdByUserId: new Types.ObjectId(auth.ctx.userId),
    });

    await writeAuditEvent({
      action: "freight_booking.requested",
      targetType: "freight_booking",
      targetId: booking._id,
      actorUserId: auth.ctx.userId,
      metadata: { provider: provider.name, cargoType: input.cargoType },
    });

    return NextResponse.json({
      ok: true,
      id: String(booking._id),
      status: booking.status,
      message: result.message,
      needsCharteringBroker: requiresCharteringBroker(input.cargoType),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
