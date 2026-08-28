import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertSupplierTransactionAccess } from "@/lib/transactions/supplier-access";
import {
  createSupplierOfferDraft,
  submitSupplierOffer,
} from "@/lib/transactions/supplier-offer-service";

export const runtime = "nodejs";

const createSchema = z.object({
  productName: z.string().min(1),
  productId: z.string().optional(),
  productCategory: z.string().optional(),
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
  certifications: z.array(z.string()).optional(),
  offerValidity: z.string().optional(),
});

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "procurement:read" });
    if ("error" in auth) return auth.error;

    const access = await assertSupplierTransactionAccess(auth.ctx.userId);
    const { SupplierOffer } = await import("@/models");
    const items = await SupplierOffer.find({
      organizationId: access.organizationId,
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({
      items: items.map((o) => ({
        id: String(o._id),
        offerId: o.offerId,
        productName: o.productName,
        status: o.status,
        availableQuantity: o.availableQuantity,
        unit: o.unit,
        price: o.price,
        currency: o.currency,
        createdAt: o.createdAt,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "procurement:write" });
    if ("error" in auth) return auth.error;

    const access = await assertSupplierTransactionAccess(auth.ctx.userId);
    const body = createSchema.parse(await request.json());

    const offer = await createSupplierOfferDraft({
      organizationId: access.organizationId,
      userId: auth.ctx.userId,
      ...body,
    });

    return NextResponse.json({ id: String(offer._id), offerId: offer.offerId });
  } catch (error) {
    return handleApiError(error);
  }
}
