import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { skipOfferStep } from "@/lib/transactions/transaction-service";
import { skipProcurementOffer } from "@/lib/transactions/procurement-service";

export const runtime = "nodejs";

const schema = z.object({
  reason: z.string().min(16),
  approverUserId: z.string(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:approve" });
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const body = schema.parse(await request.json());

    const { Transaction } = await import("@/models");
    const existing = await Transaction.findById(id).lean();
    if (!existing) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const tx =
      existing.transactionType === "supplier_purchase"
        ? await skipProcurementOffer({
            transactionId: id,
            actorUserId: auth.ctx.userId,
            approverUserId: body.approverUserId,
            reason: body.reason,
            permissions: auth.ctx.permissions,
          })
        : await skipOfferStep({
            transactionId: id,
            actorUserId: auth.ctx.userId,
            approverUserId: body.approverUserId,
            reason: body.reason,
            permissions: auth.ctx.permissions,
          });

    return NextResponse.json({ ok: true, workflowStatus: tx.workflowStatus });
  } catch (error) {
    if (error instanceof Error && error.message === "forbidden") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
    return handleApiError(error);
  }
}
