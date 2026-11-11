import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { writeAuditEvent } from "@/lib/audit/log";

export const runtime = "nodejs";

const bodySchema = z.object({
  waived: z.boolean(),
  reason: z.string().trim().max(500).optional(),
});

/** Staff only: allow (or stop allowing) this transaction to proceed without an FIS. */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "documents:approve" });
    if ("error" in auth) return auth.error;
    if (!auth.ctx.isInternal) {
      return NextResponse.json({ error: "Workspace access required." }, { status: 403 });
    }
    const parsed = bodySchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request." }, { status: 422 });
    }
    if (parsed.data.waived && !parsed.data.reason) {
      return NextResponse.json({ error: "A reason is required to waive the FIS." }, { status: 422 });
    }

    const { id } = await params;
    const { Transaction } = await import("@/models");
    const tx = await Transaction.findByIdAndUpdate(
      id,
      {
        $set: {
          fisWaived: parsed.data.waived,
          fisWaivedReason: parsed.data.waived ? parsed.data.reason : "",
        },
      },
      { new: true },
    )
      .select("_id fisWaived")
      .lean();
    if (!tx) return NextResponse.json({ error: "Not found." }, { status: 404 });

    await writeAuditEvent({
      action: parsed.data.waived ? "transaction.fis_waived" : "transaction.fis_waiver_removed",
      targetType: "transaction",
      targetId: id,
      actorUserId: auth.ctx.userId,
      metadata: { reason: parsed.data.reason },
    });
    return NextResponse.json({ ok: true, fisWaived: Boolean(tx.fisWaived) });
  } catch (error) {
    return handleApiError(error);
  }
}
