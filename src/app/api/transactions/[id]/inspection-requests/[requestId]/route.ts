import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertBuyerTransactionAccess } from "@/lib/transactions/buyer-access";
import { assertTransactionUnlocked } from "@/lib/transactions/step-service";
import { decideInspectionRequest, withdrawInspectionRequest } from "@/lib/transactions/inspection-service";

export const runtime = "nodejs";

const decideSchema = z.object({
  status: z.enum(["granted", "declined", "report_received"]),
  note: z.string().trim().max(1000).optional(),
});

/** Staff only: grant or decline the request, and record that the report has been received. */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string; requestId: string }> }) {
  try {
    const auth = await requireApiAuth({ permissions: "documents:write" });
    if ("error" in auth) return auth.error;
    if (!auth.ctx.isInternal) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    const { id, requestId } = await params;
    await assertTransactionUnlocked(id);
    const parsed = decideSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 422 });
    const item = await decideInspectionRequest({ transactionId: id, requestId, status: parsed.data.status, note: parsed.data.note, userId: auth.ctx.userId });
    if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    return handleApiError(error);
  }
}

/** Staff remove any request. A buyer can only withdraw their own request that nobody has decided yet. */
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string; requestId: string }> }) {
  try {
    const auth = await requireApiAuth({ permissions: "documents:write" });
    if ("error" in auth) return auth.error;
    const { id, requestId } = await params;
    const { Transaction } = await import("@/models");
    const tx = await Transaction.findById(id).select("organizationId side").lean();
    if (!tx || tx.side === "supplier") return NextResponse.json({ error: "Not found." }, { status: 404 });
    if (!auth.ctx.isInternal) {
      const access = await assertBuyerTransactionAccess(auth.ctx.userId);
      if (access.organizationId !== String(tx.organizationId)) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
    await assertTransactionUnlocked(id);
    const removed = await withdrawInspectionRequest({ transactionId: id, requestId, userId: auth.ctx.userId, onlyIfOwnAndRequested: !auth.ctx.isInternal });
    if (!removed) return NextResponse.json({ error: "Not found, or it can no longer be withdrawn." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
