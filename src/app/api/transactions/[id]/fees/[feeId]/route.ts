import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertTransactionUnlocked } from "@/lib/transactions/step-service";
import { kindAllowedOnSide, removeFee, updateFee } from "@/lib/transactions/fees-service";
import { feeBodySchema } from "@/lib/transactions/fees-schema";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string; feeId: string }> }) {
  try {
    const auth = await requireApiAuth({ permissions: "finance:write" });
    if ("error" in auth) return auth.error;
    if (!auth.ctx.isInternal) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    const { id, feeId } = await params;
    await assertTransactionUnlocked(id);
    const parsed = feeBodySchema.partial().safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request." }, { status: 422 });
    if (parsed.data.kind) {
      const { Transaction } = await import("@/models");
      const tx = await Transaction.findById(id).select("side").lean();
      if (!tx) return NextResponse.json({ error: "Not found." }, { status: 404 });
      if (!kindAllowedOnSide(parsed.data.kind, tx.side === "supplier" ? "supplier" : "buyer")) {
        return NextResponse.json({ error: "The supplier payment belongs to the supplier order (stage 2)." }, { status: 422 });
      }
    }
    const item = await updateFee({ transactionId: id, feeId, patch: parsed.data, userId: auth.ctx.userId });
    if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string; feeId: string }> }) {
  try {
    const auth = await requireApiAuth({ permissions: "finance:write" });
    if ("error" in auth) return auth.error;
    if (!auth.ctx.isInternal) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    const { id, feeId } = await params;
    await assertTransactionUnlocked(id);
    const removed = await removeFee({ transactionId: id, feeId, userId: auth.ctx.userId });
    if (!removed) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
