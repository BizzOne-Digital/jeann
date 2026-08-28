import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import {
  createSupplierBill,
  approveSupplierBill,
  postSupplierBill,
} from "@/lib/finance/invoice-service";

export const runtime = "nodejs";

const createSchema = z.object({
  supplierOrganizationId: z.string(),
  transactionId: z.string(),
  shipmentLotId: z.string().optional(),
  supplierInvoiceReference: z.string().optional(),
  currency: z.string(),
  total: z.string(),
  description: z.string(),
  invoiceDate: z.string(),
  dueDate: z.string(),
});

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "finance:read" });
    if ("error" in auth) return auth.error;

    const { SupplierBill } = await import("@/models");
    const items = await SupplierBill.find().sort({ createdAt: -1 }).limit(100).lean();

    return NextResponse.json({
      items: items.map((b) => ({
        id: String(b._id),
        billNumber: b.billNumber,
        supplierOrganizationId: String(b.supplierOrganizationId),
        transactionId: String(b.transactionId),
        currency: b.currency,
        total: b.total?.toString(),
        balance: b.balance?.toString(),
        status: b.status,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.action === "approve") {
      const auth = await requireApiAuth({ permissions: "finance:write" });
      if ("error" in auth) return auth.error;
      const bill = await approveSupplierBill({
        billId: body.billId,
        actorUserId: auth.ctx.userId,
      });
      return NextResponse.json({ id: String(bill._id), status: bill.status });
    }

    if (body.action === "post") {
      const auth = await requireApiAuth({ permissions: "finance:write" });
      if ("error" in auth) return auth.error;
      const bill = await postSupplierBill({
        billId: body.billId,
        actorUserId: auth.ctx.userId,
      });
      return NextResponse.json({ id: String(bill._id), status: bill.status });
    }

    const auth = await requireApiAuth({ permissions: "finance:write" });
    if ("error" in auth) return auth.error;
    const parsed = createSchema.parse(body);
    const bill = await createSupplierBill({
      ...parsed,
      actorUserId: auth.ctx.userId,
    });
    return NextResponse.json({
      id: String(bill._id),
      billNumber: bill.billNumber,
      status: bill.status,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
