import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { reviewSupplierOffer } from "@/lib/transactions/supplier-offer-service";
import { createProcurementTransaction } from "@/lib/transactions/procurement-service";

export const runtime = "nodejs";

const reviewSchema = z.object({
  action: z.enum(["under_review", "more_info", "qualify", "decline", "spam"]),
  notes: z.string().optional(),
  reason: z.string().optional(),
});

const convertSchema = z.object({
  assignedTradeManagerId: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:approve" });
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const body = reviewSchema.parse(await request.json());
    const offer = await reviewSupplierOffer({
      offerId: id,
      actorUserId: auth.ctx.userId,
      action: body.action,
      notes: body.notes,
      reason: body.reason,
    });

    return NextResponse.json({ ok: true, status: offer.status });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:assign" });
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const body = convertSchema.parse(await request.json());
    const { SupplierOffer } = await import("@/models");
    const offer = await SupplierOffer.findById(id);
    if (!offer || offer.status !== "qualified") {
      return NextResponse.json({ error: "Offer must be qualified." }, { status: 409 });
    }

    const tx = await createProcurementTransaction({
      supplierOrganizationId: String(offer.organizationId),
      actorUserId: auth.ctx.userId,
      sourceSupplierOfferId: id,
      assignedTradeManagerId: body.assignedTradeManagerId,
    });

    return NextResponse.json({
      transactionId: String(tx._id),
      transactionNumber: tx.transactionNumber,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
