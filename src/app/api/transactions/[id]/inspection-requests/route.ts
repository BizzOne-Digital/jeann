import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertOrgScope } from "@/lib/authorization/authorize";
import { assertBuyerTransactionAccess } from "@/lib/transactions/buyer-access";
import { assertTransactionUnlocked } from "@/lib/transactions/step-service";
import { createInspectionRequest, listInspectionRequests } from "@/lib/transactions/inspection-service";

export const runtime = "nodejs";

const createSchema = z.object({
  inspectionCompany: z.string().trim().max(200).optional(),
  scope: z.string().trim().max(1000).optional(),
  loadingPort: z.string().trim().max(200).optional(),
});

/** The inspection requests of a buyer order. The buyer sees their own; the supplier never sees them. */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireApiAuth({ permissions: "documents:read" });
    if ("error" in auth) return auth.error;
    const { id } = await params;
    const { Transaction } = await import("@/models");
    const tx = await Transaction.findById(id).select("organizationId side").lean();
    if (!tx || tx.side === "supplier") return NextResponse.json({ error: "Not found." }, { status: 404 });
    if (!auth.ctx.isInternal) await assertOrgScope(auth.ctx.userId, String(tx.organizationId), "documents:read");
    return NextResponse.json({ items: await listInspectionRequests(id) });
  } catch (error) {
    return handleApiError(error);
  }
}

/** The buyer asks for an inspection at the loading port; staff can also record one on the buyer's behalf. */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireApiAuth({ permissions: "documents:write" });
    if ("error" in auth) return auth.error;
    const { id } = await params;
    const { Transaction } = await import("@/models");
    const tx = await Transaction.findById(id).select("organizationId side").lean();
    if (!tx || tx.side === "supplier") return NextResponse.json({ error: "Not found." }, { status: 404 });
    if (!auth.ctx.isInternal) {
      const access = await assertBuyerTransactionAccess(auth.ctx.userId);
      if (access.organizationId !== String(tx.organizationId)) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
    await assertTransactionUnlocked(id);
    const parsed = createSchema.safeParse(await request.json().catch(() => ({})));
    if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 422 });
    const item = await createInspectionRequest({
      transaction: { _id: tx._id, organizationId: tx.organizationId },
      ...parsed.data,
      requestedBy: auth.ctx.isInternal ? "staff" : "buyer",
      userId: auth.ctx.userId,
    });
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    return handleApiError(error);
  }
}
