import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertOrgScope } from "@/lib/authorization/authorize";
import { assertBuyerTransactionAccess } from "@/lib/transactions/buyer-access";
import { assertTransactionUnlocked } from "@/lib/transactions/step-service";
import { addRequestedDocument, listRequestedDocuments } from "@/lib/transactions/requested-documents-service";

export const runtime = "nodejs";

const addSchema = z.object({
  title: z.string().trim().min(2, "Name the document.").max(200),
  notes: z.string().trim().max(1000).optional(),
});

/** The documents requested on this transaction. Everyone with access to the transaction sees its own list. */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireApiAuth({ permissions: "documents:read" });
    if ("error" in auth) return auth.error;
    const { id } = await params;
    const { Transaction } = await import("@/models");
    const tx = await Transaction.findById(id).select("organizationId side").lean();
    if (!tx) return NextResponse.json({ error: "Not found." }, { status: 404 });
    if (!auth.ctx.isInternal) await assertOrgScope(auth.ctx.userId, String(tx.organizationId), "documents:read");
    return NextResponse.json({ items: await listRequestedDocuments(id) });
  } catch (error) {
    return handleApiError(error);
  }
}

/** The buyer adds what they ask for; staff can add to any transaction. The supplier cannot add. */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireApiAuth({ permissions: "documents:write" });
    if ("error" in auth) return auth.error;
    const { id } = await params;
    const { Transaction } = await import("@/models");
    const tx = await Transaction.findById(id).select("organizationId side status closedAt").lean();
    if (!tx) return NextResponse.json({ error: "Not found." }, { status: 404 });

    if (!auth.ctx.isInternal) {
      if (tx.side === "supplier") return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      const access = await assertBuyerTransactionAccess(auth.ctx.userId);
      if (access.organizationId !== String(tx.organizationId)) {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
    }
    await assertTransactionUnlocked(id);

    const parsed = addSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request." }, { status: 422 });
    }
    const item = await addRequestedDocument({
      transaction: { _id: tx._id, organizationId: tx.organizationId, side: tx.side },
      title: parsed.data.title,
      notes: parsed.data.notes,
      requestedBy: auth.ctx.isInternal ? "staff" : "buyer",
      userId: auth.ctx.userId,
    });
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    return handleApiError(error);
  }
}
