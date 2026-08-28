import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { transitionTransaction } from "@/lib/transactions/transaction-service";
import { transitionProcurementTransaction } from "@/lib/transactions/procurement-service";
import type { TransactionWorkflowStatus } from "@/models/Transaction";

export const runtime = "nodejs";

const transitionSchema = z.object({
  toStatus: z.string(),
  comment: z.string().optional(),
  reason: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:approve" });
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const body = transitionSchema.parse(await request.json());

    const { Transaction } = await import("@/models");
    const existing = await Transaction.findById(id).lean();
    if (!existing) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const tx =
      existing.transactionType === "supplier_purchase"
        ? await transitionProcurementTransaction({
            transactionId: id,
            toStatus: body.toStatus as TransactionWorkflowStatus,
            actorUserId: auth.ctx.userId,
            permissions: auth.ctx.permissions,
            comment: body.comment,
            reason: body.reason,
          })
        : await transitionTransaction({
            transactionId: id,
            toStatus: body.toStatus as TransactionWorkflowStatus,
            actorUserId: auth.ctx.userId,
            permissions: auth.ctx.permissions,
            comment: body.comment,
            reason: body.reason,
          });

    return NextResponse.json({
      ok: true,
      workflowStatus: tx.workflowStatus,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "invalid_transition") {
        return NextResponse.json({ error: "Invalid status transition." }, { status: 409 });
      }
      if (error.message === "forbidden") {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
    }
    return handleApiError(error);
  }
}
