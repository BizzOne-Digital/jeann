import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import {
  createBuyerInvoiceDraft,
  approveBuyerInvoice,
  issueBuyerInvoice,
} from "@/lib/finance/invoice-service";
import { syncEntityToAccounting } from "@/lib/finance/accounting-provider";

export const runtime = "nodejs";

const createSchema = z.object({
  buyerOrganizationId: z.string(),
  transactionId: z.string(),
  shipmentLotId: z.string().optional(),
  currency: z.string(),
  invoiceDate: z.string(),
  dueDate: z.string(),
  contractReference: z.string().optional(),
  lineItems: z.array(
    z.object({
      description: z.string(),
      quantity: z.string().optional(),
      unit: z.string().optional(),
      unitPrice: z.string(),
    }),
  ),
});

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "finance:read" });
    if ("error" in auth) return auth.error;

    const { BuyerInvoice } = await import("@/models");
    const items = await BuyerInvoice.find().sort({ createdAt: -1 }).limit(100).lean();

    return NextResponse.json({
      items: items.map((i) => ({
        id: String(i._id),
        invoiceNumber: i.invoiceNumber,
        buyerOrganizationId: String(i.buyerOrganizationId),
        transactionId: String(i.transactionId),
        currency: i.currency,
        total: i.total?.toString(),
        balance: i.balance?.toString(),
        status: i.status,
        invoiceDate: i.invoiceDate,
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
      const invoice = await approveBuyerInvoice({
        invoiceId: body.invoiceId,
        actorUserId: auth.ctx.userId,
      });
      return NextResponse.json({ id: String(invoice._id), status: invoice.status });
    }

    if (body.action === "issue") {
      const auth = await requireApiAuth({ permissions: "finance:write" });
      if ("error" in auth) return auth.error;
      const invoice = await issueBuyerInvoice({
        invoiceId: body.invoiceId,
        actorUserId: auth.ctx.userId,
      });
      const sync = await syncEntityToAccounting("invoice", String(invoice._id));
      return NextResponse.json({
        id: String(invoice._id),
        status: invoice.status,
        accountingSync: sync.status,
      });
    }

    const auth = await requireApiAuth({ permissions: "finance:write" });
    if ("error" in auth) return auth.error;
    const parsed = createSchema.parse(body);
    const invoice = await createBuyerInvoiceDraft({
      ...parsed,
      actorUserId: auth.ctx.userId,
      applyTax: false,
    });
    return NextResponse.json({
      id: String(invoice._id),
      invoiceNumber: invoice.invoiceNumber,
      status: invoice.status,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
