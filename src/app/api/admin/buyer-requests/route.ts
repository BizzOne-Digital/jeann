import { NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:read" });
    if ("error" in auth) return auth.error;

    const { PurchaseRequest } = await import("@/models");
    const items = await PurchaseRequest.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return NextResponse.json({
      items: items.map((r) => ({
        id: String(r._id),
        reference: r.reference,
        productName: r.productName,
        status: r.status,
        organizationId: r.organizationId ? String(r.organizationId) : null,
        contactEmail: r.contactEmail,
        contactCompany: r.contactCompany,
        source: r.source,
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
