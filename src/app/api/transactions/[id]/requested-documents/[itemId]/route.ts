import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertBuyerTransactionAccess } from "@/lib/transactions/buyer-access";
import { assertTransactionUnlocked } from "@/lib/transactions/step-service";
import { removeRequestedDocument, updateRequestedDocument } from "@/lib/transactions/requested-documents-service";

export const runtime = "nodejs";

const patchSchema = z.object({
  title: z.string().trim().min(2).max(200).optional(),
  notes: z.string().trim().max(1000).optional(),
  status: z.enum(["requested", "received_from_supplier", "provided_to_buyer"]).optional(),
});

/** Staff change an item at any time: its name, its notes and where it stands. */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string; itemId: string }> }) {
  try {
    const auth = await requireApiAuth({ permissions: "documents:write" });
    if ("error" in auth) return auth.error;
    if (!auth.ctx.isInternal) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    const { id, itemId } = await params;
    await assertTransactionUnlocked(id);
    const parsed = patchSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 422 });
    const item = await updateRequestedDocument({ transactionId: id, itemId, patch: parsed.data, userId: auth.ctx.userId });
    if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    return handleApiError(error);
  }
}

/** Staff remove any item. A buyer can only withdraw their own item that is still just requested. */
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string; itemId: string }> }) {
  try {
    const auth = await requireApiAuth({ permissions: "documents:write" });
    if ("error" in auth) return auth.error;
    const { id, itemId } = await params;
    const { Transaction } = await import("@/models");
    const tx = await Transaction.findById(id).select("organizationId side").lean();
    if (!tx) return NextResponse.json({ error: "Not found." }, { status: 404 });
    if (!auth.ctx.isInternal) {
      if (tx.side === "supplier") return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      const access = await assertBuyerTransactionAccess(auth.ctx.userId);
      if (access.organizationId !== String(tx.organizationId)) {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
    }
    await assertTransactionUnlocked(id);
    const removed = await removeRequestedDocument({
      transactionId: id,
      itemId,
      userId: auth.ctx.userId,
      onlyIfBuyerOwnAndRequested: !auth.ctx.isInternal,
    });
    if (!removed) return NextResponse.json({ error: "Not found, or it can no longer be withdrawn." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
