import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertSupplierTransactionAccess } from "@/lib/transactions/supplier-access";
import { submitSupplierOffer } from "@/lib/transactions/supplier-offer-service";

export const runtime = "nodejs";

const updateSchema = z.object({
  productName: z.string().optional(),
  specification: z.string().optional(),
  origin: z.string().optional(),
  availableQuantity: z.string().optional(),
  unit: z.string().optional(),
  monthlyCapacity: z.string().optional(),
  price: z.string().optional(),
  currency: z.string().optional(),
  loadingPort: z.string().optional(),
  incoterm: z.string().optional(),
  packaging: z.string().optional(),
  inspectionAvailability: z.string().optional(),
  offerValidity: z.string().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "procurement:read" });
    if ("error" in auth) return auth.error;

    const access = await assertSupplierTransactionAccess(auth.ctx.userId);
    const { id } = await params;
    const { SupplierOffer } = await import("@/models");
    const offer = await SupplierOffer.findOne({
      _id: id,
      organizationId: access.organizationId,
    }).lean();
    if (!offer) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    return NextResponse.json({
      id: String(offer._id),
      offerId: offer.offerId,
      productName: offer.productName,
      status: offer.status,
      specification: offer.specification,
      origin: offer.origin,
      availableQuantity: offer.availableQuantity,
      unit: offer.unit,
      monthlyCapacity: offer.monthlyCapacity,
      price: offer.price,
      currency: offer.currency,
      loadingPort: offer.loadingPort,
      incoterm: offer.incoterm,
      packaging: offer.packaging,
      inspectionAvailability: offer.inspectionAvailability,
      offerValidity: offer.offerValidity,
      reviewNotes: offer.reviewNotes,
      createdAt: offer.createdAt,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "procurement:write" });
    if ("error" in auth) return auth.error;

    const access = await assertSupplierTransactionAccess(auth.ctx.userId);
    const { id } = await params;
    const body = updateSchema.parse(await request.json());
    const { SupplierOffer } = await import("@/models");
    const offer = await SupplierOffer.findOne({
      _id: id,
      organizationId: access.organizationId,
    });
    if (!offer) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    if (offer.status !== "draft" && offer.status !== "more_information_required") {
      return NextResponse.json({ error: "Offer cannot be edited." }, { status: 409 });
    }

    Object.assign(offer, body);
    await offer.save();

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "procurement:write" });
    if ("error" in auth) return auth.error;

    const access = await assertSupplierTransactionAccess(auth.ctx.userId);
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    if (body?.action === "submit") {
      const offer = await submitSupplierOffer(id, auth.ctx.userId, access.organizationId);
      return NextResponse.json({ ok: true, status: offer.status });
    }
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    if (error instanceof Error && error.message === "invalid_status") {
      return NextResponse.json({ error: "Invalid offer status for submit." }, { status: 409 });
    }
    return handleApiError(error);
  }
}
