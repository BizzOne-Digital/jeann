import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { WORKFLOW_STATUS_LABELS } from "@/lib/transactions/workflow";
import { PROCUREMENT_STATUS_LABELS } from "@/lib/transactions/procurement-workflow";

export const runtime = "nodejs";

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Staff transaction records: search by order number or company name, and filter by date. */
export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:read" });
    if ("error" in auth) return auth.error;
    if (!auth.ctx.isInternal) {
      return NextResponse.json({ error: "Workspace access required." }, { status: 403 });
    }

    const { Transaction, Organization } = await import("@/models");
    const sp = request.nextUrl.searchParams;
    const filter: Record<string, unknown> = { deletedAt: null };

    const q = (sp.get("q") ?? "").trim().slice(0, 80);
    if (q) {
      const rx = { $regex: escapeRegex(q), $options: "i" };
      const orgs = await Organization.find({ legalName: rx }).select("_id").limit(200).lean();
      filter.$or = [
        { transactionNumber: rx },
        { organizationId: { $in: orgs.map((o) => o._id) } },
      ];
    }
    const status = sp.get("status");
    if (status && ["draft", "active", "on_hold", "completed", "cancelled"].includes(status)) {
      filter.status = status;
    }
    if (sp.get("closed") === "1") filter.closedAt = { $ne: null };
    const range: Record<string, Date> = {};
    const from = sp.get("from");
    const to = sp.get("to");
    if (from && !Number.isNaN(Date.parse(from))) range.$gte = new Date(from);
    if (to && !Number.isNaN(Date.parse(to))) {
      const end = new Date(to);
      end.setUTCHours(23, 59, 59, 999);
      range.$lte = end;
    }
    if (Object.keys(range).length) filter.createdAt = range;

    const items = await Transaction.find(filter).sort({ createdAt: -1 }).limit(200).lean();
    const orgIds = [...new Set(items.map((t) => String(t.organizationId)))];
    const orgs = await Organization.find({ _id: { $in: orgIds } }).select("legalName").lean();
    const orgName = new Map(orgs.map((o) => [String(o._id), o.legalName]));

    return NextResponse.json({
      items: items.map((t) => ({
        id: String(t._id),
        transactionNumber: t.transactionNumber,
        companyName: orgName.get(String(t.organizationId)) ?? "",
        transactionType: t.transactionType,
        side: t.side,
        workflowStatus: t.workflowStatus,
        workflowLabel:
          t.transactionType === "supplier_purchase"
            ? (PROCUREMENT_STATUS_LABELS[t.workflowStatus] ?? t.workflowStatus)
            : (WORKFLOW_STATUS_LABELS[t.workflowStatus as keyof typeof WORKFLOW_STATUS_LABELS] ??
              t.workflowStatus),
        status: t.status,
        locked: t.status === "cancelled" || Boolean(t.closedAt),
        currentStepKey: t.currentStepKey,
        createdAt: t.createdAt,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
