import { NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:read" });
    if ("error" in auth) return auth.error;

    const { SupplierOffer } = await import("@/models");
    const items = await SupplierOffer.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({
      items: items.map((o) => ({
        id: String(o._id),
        offerId: o.offerId,
        organizationId: String(o.organizationId),
        productName: o.productName,
        status: o.status,
        source: o.source,
        createdAt: o.createdAt,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
