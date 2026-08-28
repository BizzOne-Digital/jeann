import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { createProcurementTransaction } from "@/lib/transactions/procurement-service";
import { PROCUREMENT_STATUS_LABELS } from "@/lib/transactions/procurement-workflow";

export const runtime = "nodejs";

const createSchema = z.object({
  supplierOrganizationId: z.string(),
  sourceSupplierOfferId: z.string().optional(),
  productId: z.string().optional(),
  productName: z.string().optional(),
  assignedTradeManagerId: z.string().optional(),
  internalNotes: z.string().optional(),
});

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "procurement:read" });
    if ("error" in auth) return auth.error;

    const { Transaction } = await import("@/models");
    const items = await Transaction.find({
      transactionType: "supplier_purchase",
      deletedAt: null,
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({
      items: items.map((t) => ({
        id: String(t._id),
        transactionNumber: t.transactionNumber,
        organizationId: String(t.organizationId),
        workflowStatus: t.workflowStatus,
        workflowLabel: PROCUREMENT_STATUS_LABELS[t.workflowStatus] ?? t.workflowStatus,
        status: t.status,
        assignedTradeManagerId: t.assignedTradeManagerId
          ? String(t.assignedTradeManagerId)
          : null,
        createdAt: t.createdAt,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "procurement:write" });
    if ("error" in auth) return auth.error;

    const body = createSchema.parse(await request.json());
    const tx = await createProcurementTransaction({
      supplierOrganizationId: body.supplierOrganizationId,
      actorUserId: auth.ctx.userId,
      sourceSupplierOfferId: body.sourceSupplierOfferId,
      productId: body.productId,
      productName: body.productName,
      assignedTradeManagerId: body.assignedTradeManagerId ?? auth.ctx.userId,
      internalNotes: body.internalNotes,
    });

    return NextResponse.json({
      id: String(tx._id),
      transactionNumber: tx.transactionNumber,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "supplier_not_approved") {
        return NextResponse.json({ error: "Supplier not approved." }, { status: 403 });
      }
    }
    return handleApiError(error);
  }
}
