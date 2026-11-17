import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { writeAuditEvent } from "@/lib/audit/log";

export const runtime = "nodejs";

/**
 * Close a transaction once the final delivery is confirmed. A closed transaction is a locked record:
 * documents can be viewed and downloaded but never changed. This cannot be undone.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:approve" });
    if ("error" in auth) return auth.error;
    if (!auth.ctx.isInternal) {
      return NextResponse.json({ error: "Workspace access required." }, { status: 403 });
    }
    const { id } = await params;
    const { Transaction } = await import("@/models");
    const tx = await Transaction.findById(id);
    if (!tx || tx.deletedAt) return NextResponse.json({ error: "Not found." }, { status: 404 });
    if (tx.closedAt || tx.status === "cancelled") {
      return NextResponse.json({ error: "This transaction is already closed." }, { status: 409 });
    }
    tx.status = "completed";
    tx.closedAt = new Date();
    await tx.save();
    await writeAuditEvent({
      action: "transaction.closed",
      targetType: "transaction",
      targetId: String(tx._id),
      actorUserId: auth.ctx.userId,
      organizationId: String(tx.organizationId),
      result: "success",
      metadata: { transactionNumber: tx.transactionNumber },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
