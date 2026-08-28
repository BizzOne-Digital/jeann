import { NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "supplier:access" });
    if ("error" in auth) return auth.error;

    const membership = auth.ctx.memberships.find((m) => m.status === "active");
    if (!membership) return NextResponse.json({ items: [] });

    const { SupplierBill } = await import("@/models");
    const items = await SupplierBill.find({
      supplierOrganizationId: membership.organizationId,
      status: { $nin: ["draft", "voided"] },
    })
      .sort({ invoiceDate: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({
      items: items.map((b) => ({
        id: String(b._id),
        billNumber: b.billNumber,
        supplierInvoiceReference: b.supplierInvoiceReference,
        currency: b.currency,
        total: b.total?.toString(),
        amountPaid: b.amountPaid?.toString(),
        balance: b.balance?.toString(),
        status: b.status,
        invoiceDate: b.invoiceDate,
        dueDate: b.dueDate,
      })),
      disclaimer: "Supplier bill status — payment verification may be required.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
