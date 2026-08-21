import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { z } from "zod";
import { requireAdminApiSession } from "@/lib/admin/require-admin-api";
import { decideBuyerOrganization, loadBuyerDetail } from "@/lib/admin/buyer-approval";
import {
  notifyBuyerApproved,
  notifyBuyerRejected,
} from "@/lib/email/buyer-notifications";
import { tryConnectMongo } from "@/lib/db/mongoose";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

const decisionSchema = z.object({
  decision: z.enum(["approved", "rejected"]),
  reason: z.string().trim().max(1000).optional(),
});

export async function GET(_request: NextRequest, context: RouteContext) {
  if (!(await requireAdminApiSession())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!(await tryConnectMongo())) {
    return NextResponse.json({ error: "Service temporarily unavailable." }, { status: 503 });
  }

  const { id } = await context.params;
  const buyer = await loadBuyerDetail(id);
  if (!buyer) {
    return NextResponse.json({ error: "Buyer organization not found." }, { status: 404 });
  }

  const { Approval } = await import("@/models");
  const approvals = await Approval.find({
    targetType: "buyer_organization",
    targetId: new Types.ObjectId(id),
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return NextResponse.json({
    buyer,
    approvals: approvals.map((item) => ({
      _id: String(item._id),
      decision: item.decision,
      reason: item.reason ?? "",
      actorUserId: String(item.actorUserId),
      createdAt: item.createdAt ? new Date(item.createdAt).toLocaleString() : null,
    })),
  });
}

export async function POST(request: NextRequest, context: RouteContext) {
  const session = await requireAdminApiSession();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!(await tryConnectMongo())) {
    return NextResponse.json({ error: "Service temporarily unavailable." }, { status: 503 });
  }

  const { id } = await context.params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid buyer id." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = decisionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 422 });
  }

  try {
    const { org, contact } = await decideBuyerOrganization({
      orgId: id,
      decision: parsed.data.decision,
      actorUserId: new Types.ObjectId(String(session.userId)),
      reason: parsed.data.reason,
    });

    if (contact) {
      if (parsed.data.decision === "approved") {
        await notifyBuyerApproved({
          contactEmail: contact.email,
          contactName: contact.name,
          organizationName: org.legalName,
        });
      } else {
        await notifyBuyerRejected({
          contactEmail: contact.email,
          contactName: contact.name,
          organizationName: org.legalName,
          reason: parsed.data.reason,
        });
      }
    }

    const buyer = await loadBuyerDetail(id);
    return NextResponse.json({ ok: true, buyer });
  } catch (error) {
    console.error("[admin/buyers/:id POST]", error);
    return NextResponse.json({ error: "Unable to update buyer organization." }, { status: 500 });
  }
}
