import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertBuyerTransactionAccess } from "@/lib/transactions/buyer-access";
import {
  updateBuyerRequestDraft,
  deleteBuyerRequestDraft,
} from "@/lib/transactions/buyer-request-service";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:read" });
    if ("error" in auth) return auth.error;

    const access = await assertBuyerTransactionAccess(auth.ctx.userId);
    const { id } = await params;
    const { PurchaseRequest } = await import("@/models");
    const doc = await PurchaseRequest.findOne({
      _id: id,
      organizationId: access.organizationId,
    }).lean();
    if (!doc) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ request: doc });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:write" });
    if ("error" in auth) return auth.error;

    const access = await assertBuyerTransactionAccess(auth.ctx.userId);
    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    const doc = await updateBuyerRequestDraft(id, access.organizationId, body);
    return NextResponse.json({ ok: true, id: String(doc._id) });
  } catch (error) {
    if (error instanceof Error && error.message === "request_not_editable") {
      return NextResponse.json({ error: "Request is locked." }, { status: 409 });
    }
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:write" });
    if ("error" in auth) return auth.error;

    const access = await assertBuyerTransactionAccess(auth.ctx.userId);
    const { id } = await params;
    await deleteBuyerRequestDraft(id, access.organizationId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
