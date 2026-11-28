import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertTransactionUnlocked } from "@/lib/transactions/step-service";
import { nextCycleLabel, startMonthlyCycle } from "@/lib/transactions/requested-documents-service";

export const runtime = "nodejs";

const schema = z.object({
  /** The month, as YYYY-MM. When it is left out, the month after the latest round is used. */
  cycleLabel: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Use a month such as 2026-12.").optional(),
});

/**
 * Staff: start the next monthly round of the documents on this transaction. The contract is filled in once; the
 * documents are asked for again every month, in their own list for that month.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireApiAuth({ permissions: "documents:write" });
    if ("error" in auth) return auth.error;
    if (!auth.ctx.isInternal) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    const { id } = await params;
    await assertTransactionUnlocked(id);
    const { Transaction, RequestedDocument } = await import("@/models");
    const tx = await Transaction.findById(id).select("organizationId side").lean();
    if (!tx) return NextResponse.json({ error: "Not found." }, { status: 404 });

    const parsed = schema.safeParse(await request.json().catch(() => ({})));
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request." }, { status: 422 });
    const labels = (await RequestedDocument.distinct("cycleLabel", { transactionId: tx._id, deletedAt: null })) as string[];
    const cycleLabel = parsed.data.cycleLabel ?? nextCycleLabel(labels);

    const result = await startMonthlyCycle({
      transaction: { _id: tx._id, organizationId: tx.organizationId, side: tx.side },
      cycleLabel,
      userId: auth.ctx.userId,
    });
    if ("error" in result) {
      const message =
        result.error === "exists"
          ? "That month already has its list of documents."
          : "Add the documents of the contract first. The monthly round repeats that list.";
      return NextResponse.json({ error: message }, { status: 409 });
    }
    return NextResponse.json({ ok: true, cycleLabel, created: result.created });
  } catch (error) {
    return handleApiError(error);
  }
}
