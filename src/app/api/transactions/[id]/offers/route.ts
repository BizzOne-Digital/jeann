import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { createOrReviseOffer, getOfferPrefill } from "@/lib/transactions/offer-service";

export const runtime = "nodejs";

const schema = z.object({
  documentType: z.enum(["sco", "fco"]),
  documentId: z.string().optional(),
  productName: z.string().min(1),
  unitPrice: z.string().regex(/^\d+(\.\d+)?$/),
  currency: z.string().length(3),
  quantity: z.string().min(1),
  quantityUnit: z.string().min(1),
  incoterm: z.string().min(1),
  loadingPort: z.string().optional(),
  destinationPort: z.string().optional(),
  paymentTerms: z.string().optional(),
  validity: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "documents:write" });
    if ("error" in auth) return auth.error;
    if (!auth.ctx.isInternal) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    const { id } = await params;
    return NextResponse.json({ prefill: await getOfferPrefill(id) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "documents:write" });
    if ("error" in auth) return auth.error;
    if (!auth.ctx.isInternal) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    const { id } = await params;
    const body = schema.parse(await request.json());
    const r = await createOrReviseOffer({ ...body, transactionId: id, actorUserId: auth.ctx.userId });
    return NextResponse.json({
      ok: true,
      documentId: r.documentId,
      versionId: r.versionId,
      version: r.version,
    });
  } catch (error) {
    if (error instanceof Error) {
      const map: Record<string, [string, number]> = {
        not_found: ["Not found.", 404],
        document_not_found: ["Offer document not found.", 404],
        not_buyer_transaction: ["Offers apply to buyer transactions only.", 409],
        invalid_price: ["Enter a valid price greater than zero.", 422],
      };
      const m = map[error.message];
      if (m) return NextResponse.json({ error: m[0] }, { status: m[1] });
    }
    return handleApiError(error);
  }
}
