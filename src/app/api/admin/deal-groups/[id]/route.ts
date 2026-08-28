import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import {
  linkTransactionToDealGroup,
  unlinkTransactionFromDealGroup,
  createDealAllocation,
  confirmDealAllocation,
  evaluateSpecificationCompatibility,
} from "@/lib/transactions/deal-group-service";
import { assertInternalDealGroupAccess } from "@/lib/transactions/supplier-access";

export const runtime = "nodejs";

const linkSchema = z.object({
  action: z.enum(["link", "unlink", "allocate", "confirm_allocation", "compatibility"]),
  transactionId: z.string().optional(),
  reason: z.string().optional(),
  buyerTransactionId: z.string().optional(),
  supplierTransactionId: z.string().optional(),
  allocatedQuantity: z.string().optional(),
  unit: z.string().optional(),
  allocationId: z.string().optional(),
  confirmWarnings: z.boolean().optional(),
  internalNote: z.string().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "deal_groups:read" });
    if ("error" in auth) return auth.error;

    const roles = auth.ctx.memberships.flatMap((m) => m.roles);
    assertInternalDealGroupAccess(roles);

    const { id } = await params;
    const { DealGroup, DealGroupTransaction, DealAllocation, Transaction } = await import(
      "@/models"
    );

    const group = await DealGroup.findById(id).lean();
    if (!group) return NextResponse.json({ error: "Not found." }, { status: 404 });

    const links = await DealGroupTransaction.find({
      dealGroupId: id,
      active: true,
    }).lean();
    const allocations = await DealAllocation.find({ dealGroupId: id }).lean();

    const transactionIds = links.map((l) => l.transactionId);
    const transactions = await Transaction.find({ _id: { $in: transactionIds } }).lean();

    return NextResponse.json({
      dealGroup: {
        id: String(group._id),
        dealGroupNumber: group.dealGroupNumber,
        name: group.name,
        description: group.description,
        status: group.status,
        productName: group.productName,
        specificationCompatibilityStatus: group.specificationCompatibilityStatus,
        internalNotes: group.internalNotes,
      },
      transactions: transactions.map((t) => ({
        id: String(t._id),
        transactionNumber: t.transactionNumber,
        transactionType: t.transactionType,
        workflowStatus: t.workflowStatus,
      })),
      allocations: allocations.map((a) => ({
        id: String(a._id),
        buyerTransactionId: String(a.buyerTransactionId),
        supplierTransactionId: String(a.supplierTransactionId),
        allocatedQuantity: a.allocatedQuantity.toString(),
        unit: a.unit,
        allocationStatus: a.allocationStatus,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "deal_groups:write" });
    if ("error" in auth) return auth.error;

    const roles = auth.ctx.memberships.flatMap((m) => m.roles);
    assertInternalDealGroupAccess(roles);

    const { id } = await params;
    const body = linkSchema.parse(await request.json());

    switch (body.action) {
      case "link":
        if (!body.transactionId) throw new Error("transactionId required");
        await linkTransactionToDealGroup({
          dealGroupId: id,
          transactionId: body.transactionId,
          actorUserId: auth.ctx.userId,
        });
        return NextResponse.json({ ok: true });
      case "unlink":
        if (!body.transactionId || !body.reason) {
          return NextResponse.json({ error: "transactionId and reason required." }, { status: 400 });
        }
        await unlinkTransactionFromDealGroup({
          dealGroupId: id,
          transactionId: body.transactionId,
          actorUserId: auth.ctx.userId,
          reason: body.reason,
        });
        return NextResponse.json({ ok: true });
      case "allocate":
        if (
          !body.buyerTransactionId ||
          !body.supplierTransactionId ||
          !body.allocatedQuantity ||
          !body.unit
        ) {
          return NextResponse.json({ error: "Missing allocation fields." }, { status: 400 });
        }
        const result = await createDealAllocation({
          dealGroupId: id,
          buyerTransactionId: body.buyerTransactionId,
          supplierTransactionId: body.supplierTransactionId,
          allocatedQuantity: body.allocatedQuantity,
          unit: body.unit,
          actorUserId: auth.ctx.userId,
          internalNote: body.internalNote,
          confirmWarnings: body.confirmWarnings,
        });
        return NextResponse.json({
          ok: true,
          allocationId: String(result.allocation._id),
          compatibility: result.compatibility,
        });
      case "confirm_allocation":
        if (!body.allocationId) {
          return NextResponse.json({ error: "allocationId required." }, { status: 400 });
        }
        await confirmDealAllocation(body.allocationId, auth.ctx.userId);
        return NextResponse.json({ ok: true });
      case "compatibility":
        if (!body.buyerTransactionId || !body.supplierTransactionId) {
          return NextResponse.json({ error: "Transaction IDs required." }, { status: 400 });
        }
        const compatibility = await evaluateSpecificationCompatibility({
          buyerTransactionId: body.buyerTransactionId,
          supplierTransactionId: body.supplierTransactionId,
        });
        return NextResponse.json(compatibility);
      default:
        return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "incompatible") {
        return NextResponse.json({ error: "Transactions incompatible." }, { status: 409 });
      }
      if (error.message === "warnings_require_confirmation") {
        return NextResponse.json({ error: "Compatibility warnings require confirmation." }, { status: 409 });
      }
      if (error.message === "over_allocation_buyer" || error.message === "over_allocation_supplier") {
        return NextResponse.json({ error: "Over-allocation detected." }, { status: 409 });
      }
    }
    return handleApiError(error);
  }
}
