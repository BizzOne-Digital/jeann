import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Types } from "mongoose";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { validateShippingDocuments } from "@/lib/shipments/document-validation";
import { writeAuditEvent } from "@/lib/audit/log";

export const runtime = "nodejs";

const validateSchema = z.object({
  action: z.literal("validate"),
  shipmentLotId: z.string(),
});

const trackingSchema = z.object({
  action: z.literal("add_event"),
  shipmentLotId: z.string(),
  eventType: z.string(),
  eventTimestamp: z.string(),
  location: z.string().optional(),
  description: z.string(),
  confidence: z.enum(["confirmed", "estimated"]).optional(),
  buyerVisible: z.boolean().optional(),
  supplierVisible: z.boolean().optional(),
});

const claimSchema = z.object({
  action: z.literal("create_claim"),
  shipmentLotId: z.string(),
  transactionId: z.string(),
  claimType: z.string(),
  claimantOrganizationId: z.string(),
  description: z.string(),
  quantityAffected: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.action === "validate") {
      const auth = await requireApiAuth({ permissions: "documents:approve" });
      if ("error" in auth) return auth.error;
      const parsed = validateSchema.parse(body);
      const result = await validateShippingDocuments(parsed.shipmentLotId);
      return NextResponse.json(result);
    }

    if (body.action === "add_event") {
      const auth = await requireApiAuth({ permissions: "shipments:write" });
      if ("error" in auth) return auth.error;
      const parsed = trackingSchema.parse(body);
      const { ShipmentTrackingEvent } = await import("@/models");
      const event = await ShipmentTrackingEvent.create({
        shipmentLotId: new Types.ObjectId(parsed.shipmentLotId),
        eventType: parsed.eventType,
        eventTimestamp: new Date(parsed.eventTimestamp),
        location: parsed.location,
        description: parsed.description,
        source: "manual",
        confidence: parsed.confidence ?? "estimated",
        buyerVisible: parsed.buyerVisible ?? false,
        supplierVisible: parsed.supplierVisible ?? false,
      });
      await writeAuditEvent({
        action: "shipment_tracking.manual_event",
        targetType: "shipment_tracking_event",
        targetId: String(event._id),
        actorUserId: auth.ctx.userId,
        result: "success",
      });
      return NextResponse.json({ id: String(event._id) });
    }

    if (body.action === "create_claim") {
      const auth = await requireApiAuth({ permissions: "transactions:write" });
      if ("error" in auth) return auth.error;
      const parsed = claimSchema.parse(body);
      const { createTradeClaim } = await import("@/lib/shipments/claim-service");
      const claim = await createTradeClaim({
        ...parsed,
        actorUserId: auth.ctx.userId,
      });
      return NextResponse.json({ id: String(claim._id), claimNumber: claim.claimNumber });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    return handleApiError(error);
  }
}
