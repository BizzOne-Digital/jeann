import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertTransactionUnlocked } from "@/lib/transactions/step-service";
import { addFee, kindAllowedOnSide, listFees } from "@/lib/transactions/fees-service";
import { feeBodySchema } from "@/lib/transactions/fees-schema";

export const runtime = "nodejs";

/** Staff only: the fees and payments of this transaction. */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireApiAuth({ permissions: "finance:read" });
    if ("error" in auth) return auth.error;
    if (!auth.ctx.isInternal) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    const { id } = await params;
    const { Transaction } = await import("@/models");
    if (!(await Transaction.exists({ _id: id }))) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json(await listFees(id));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireApiAuth({ permissions: "finance:write" });
    if ("error" in auth) return auth.error;
    if (!auth.ctx.isInternal) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    const { id } = await params;
    await assertTransactionUnlocked(id);
    const { Transaction } = await import("@/models");
    const tx = await Transaction.findById(id).select("organizationId side").lean();
    if (!tx) return NextResponse.json({ error: "Not found." }, { status: 404 });
    const parsed = feeBodySchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request." }, { status: 422 });
    if (!kindAllowedOnSide(parsed.data.kind, tx.side === "supplier" ? "supplier" : "buyer")) {
      return NextResponse.json({ error: "The supplier payment belongs to the supplier order (stage 2)." }, { status: 422 });
    }
    const fee = await addFee({ transaction: { _id: tx._id, organizationId: tx.organizationId }, fee: parsed.data, userId: auth.ctx.userId });
    return NextResponse.json({ ok: true, item: fee });
  } catch (error) {
    return handleApiError(error);
  }
}
