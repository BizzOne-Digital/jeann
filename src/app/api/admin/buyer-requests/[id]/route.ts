import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { reviewBuyerRequest } from "@/lib/transactions/buyer-request-service";
import { createTransactionFromRequest } from "@/lib/transactions/transaction-service";
import { writeAuditEvent } from "@/lib/audit/log";
import { auditRequestMeta } from "@/lib/api/request-meta";

export const runtime = "nodejs";

const schema = z.object({
  action: z.enum(["qualify", "decline", "more_info", "spam", "convert"]),
  comment: z.string().optional(),
  reason: z.string().optional(),
  assignedTradeManagerId: z.string().optional(),
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
    const meta = auditRequestMeta(request);

    const doc = await reviewBuyerRequest({
      requestId: id,
      action: body.action,
      actorUserId: auth.ctx.userId,
      comment: body.comment,
      reason: body.reason,
    });

    let transactionId: string | undefined;
    if (body.action === "convert") {
      const tx = await createTransactionFromRequest({
        purchaseRequestId: id,
        actorUserId: auth.ctx.userId,
        assignedTradeManagerId: body.assignedTradeManagerId,
      });
      transactionId = String(tx._id);
    }

    await writeAuditEvent({
      action: `buyer_request.${body.action}`,
      targetType: "purchase_request",
      targetId: id,
      actorUserId: auth.ctx.userId,
      ...meta,
      metadata: { transactionId },
    });

    return NextResponse.json({
      ok: true,
      status: doc.status,
      transactionId,
      transactionNumber: transactionId
        ? (
            await (await import("@/models")).Transaction.findById(transactionId).lean()
          )?.transactionNumber
        : undefined,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "reason_required" || error.message === "comment_required") {
        return NextResponse.json({ error: "Comment or reason required." }, { status: 422 });
      }
      if (error.message === "already_converted") {
        return NextResponse.json({ error: "Already converted." }, { status: 409 });
      }
    }
    return handleApiError(error);
  }
}
