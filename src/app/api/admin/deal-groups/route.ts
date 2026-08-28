import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { createDealGroup, linkTransactionToDealGroup } from "@/lib/transactions/deal-group-service";
import { assertInternalDealGroupAccess } from "@/lib/transactions/supplier-access";

export const runtime = "nodejs";

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  productId: z.string().optional(),
  productName: z.string().optional(),
  leadTradeManagerId: z.string().optional(),
  internalNotes: z.string().optional(),
  linkTransactionId: z.string().optional(),
});

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "deal_groups:read" });
    if ("error" in auth) return auth.error;

    const roles = auth.ctx.memberships.flatMap((m) => m.roles);
    assertInternalDealGroupAccess(roles);

    const { DealGroup } = await import("@/models");
    const items = await DealGroup.find().sort({ createdAt: -1 }).limit(100).lean();

    return NextResponse.json({
      items: items.map((g) => ({
        id: String(g._id),
        dealGroupNumber: g.dealGroupNumber,
        name: g.name,
        status: g.status,
        productName: g.productName,
        specificationCompatibilityStatus: g.specificationCompatibilityStatus,
        createdAt: g.createdAt,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "deal_groups:write" });
    if ("error" in auth) return auth.error;

    const roles = auth.ctx.memberships.flatMap((m) => m.roles);
    assertInternalDealGroupAccess(roles);

    const body = createSchema.parse(await request.json());
    const group = await createDealGroup({
      name: body.name,
      description: body.description,
      productId: body.productId,
      productName: body.productName,
      leadTradeManagerId: body.leadTradeManagerId,
      actorUserId: auth.ctx.userId,
      internalNotes: body.internalNotes,
    });

    if (body.linkTransactionId) {
      await linkTransactionToDealGroup({
        dealGroupId: String(group._id),
        transactionId: body.linkTransactionId,
        actorUserId: auth.ctx.userId,
      });
    }

    return NextResponse.json({
      id: String(group._id),
      dealGroupNumber: group.dealGroupNumber,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
