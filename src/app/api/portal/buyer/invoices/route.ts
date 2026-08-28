import { NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "buyer:access" });
    if ("error" in auth) return auth.error;

    const membership = auth.ctx.memberships.find((m) => m.status === "active");
    if (!membership) return NextResponse.json({ items: [] });

    const { BuyerInvoice } = await import("@/models");
    const items = await BuyerInvoice.find({
      buyerOrganizationId: membership.organizationId,
      status: { $nin: ["draft", "voided"] },
    })
      .sort({ invoiceDate: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({
      items: items.map((i) => ({
        id: String(i._id),
        invoiceNumber: i.invoiceNumber,
        currency: i.currency,
        total: i.total?.toString(),
        amountPaid: i.amountPaid?.toString(),
        balance: i.balance?.toString(),
        status: i.status,
        invoiceDate: i.invoiceDate,
        dueDate: i.dueDate,
      })),
      disclaimer: "Operational invoice — not audited financial statement.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
