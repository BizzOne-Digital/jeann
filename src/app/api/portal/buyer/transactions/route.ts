import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertBuyerTransactionAccess } from "@/lib/transactions/buyer-access";
import { WORKFLOW_STATUS_LABELS } from "@/lib/transactions/workflow";

export const runtime = "nodejs";

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:read" });
    if ("error" in auth) return auth.error;

    const access = await assertBuyerTransactionAccess(auth.ctx.userId);
    const { Transaction } = await import("@/models");
    const sp = request.nextUrl.searchParams;
    const filter: Record<string, unknown> = {
      organizationId: access.organizationId,
      side: "buyer",
      deletedAt: null,
    };
    const q = (sp.get("q") ?? "").trim().slice(0, 60);
    if (q) filter.transactionNumber = { $regex: escapeRegex(q), $options: "i" };
    const status = sp.get("status");
    if (status && /^[a-z_]{2,40}$/.test(status)) filter.workflowStatus = status;
    const type = sp.get("type");
    if (type && /^[a-z_]{2,40}$/.test(type)) filter.transactionType = type;
    const range: Record<string, Date> = {};
    const from = sp.get("from");
    const to = sp.get("to");
    if (from && !Number.isNaN(Date.parse(from))) range.$gte = new Date(from);
    if (to && !Number.isNaN(Date.parse(to))) range.$lte = new Date(to);
    if (Object.keys(range).length) filter.createdAt = range;
    const page = Math.max(1, Number(sp.get("page") ?? 1) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(sp.get("pageSize") ?? 25) || 25));
    const total = await Transaction.countDocuments(filter);
    const items = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    return NextResponse.json({
      page,
      pageSize,
      total,
      items: items.map((t) => ({
        id: String(t._id),
        transactionNumber: t.transactionNumber,
        workflowStatus: t.workflowStatus,
        workflowLabel: WORKFLOW_STATUS_LABELS[t.workflowStatus as keyof typeof WORKFLOW_STATUS_LABELS],
        status: t.status,
        currentStepKey: t.currentStepKey,
        createdAt: t.createdAt,
        submittedAt: t.submittedAt,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
