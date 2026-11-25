import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { z } from "zod";
import { adminDeniedResponse, requireAdminApiSession } from "@/lib/admin/require-admin-api";
import { decideBuyerOrganization, loadBuyerDetail } from "@/lib/admin/buyer-approval";
import {
  notifyBuyerChangesRequested,
  notifyBuyerApproved,
  notifyBuyerRejected,
} from "@/lib/email/buyer-notifications";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { KybGateError } from "@/lib/kyb/kyb-service";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

const decisionSchema = z.object({
  decision: z.enum(["approved", "rejected", "changes_requested"]),
  reason: z.string().trim().max(1000).optional(),
  kybOverrideReason: z.string().trim().max(2000).optional(),
});

export async function GET(_request: NextRequest, context: RouteContext) {
  if (!(await requireAdminApiSession())) {
    return adminDeniedResponse();
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
    return adminDeniedResponse();
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
    if (parsed.data.decision === "changes_requested") {
      const comment = parsed.data.reason?.trim();
      if (!comment) {
        return NextResponse.json({ error: "Tell the buyer what to change." }, { status: 422 });
      }
      const { CisProfile } = await import("@/models");
      const cis = await CisProfile.findOne({ organizationId: new Types.ObjectId(id) })
        .sort({ version: -1 })
        .select("_id status")
        .lean();
      if (!cis) {
        return NextResponse.json({ error: "This buyer has not saved a company profile yet." }, { status: 409 });
      }
      const { reviewCisProfile } = await import("@/lib/onboarding/cis-service");
      await reviewCisProfile({
        organizationId: id,
        cisProfileId: String(cis._id),
        actorUserId: String(session.userId),
        action: "request_changes",
        comment,
      });
      const detail = await loadBuyerDetail(id);
      if (detail?.primaryContact) {
        try {
          await notifyBuyerChangesRequested({
            contactEmail: detail.primaryContact.email,
            contactName: detail.primaryContact.name,
            organizationName: detail.legalName,
            comment,
          });
        } catch (mailError) {
          console.error("[admin/buyers/:id] changes email failed", mailError);
        }
      }
      return NextResponse.json({ ok: true, buyer: detail });
    }

    const { org, contact, kyb } = await decideBuyerOrganization({
      orgId: id,
      decision: parsed.data.decision,
      actorUserId: new Types.ObjectId(String(session.userId)),
      reason: parsed.data.reason,
      kybOverrideReason: parsed.data.kybOverrideReason,
    });

    if (kyb.overridden || kyb.warning) {
      const { writeAuditEvent } = await import("@/lib/audit/log");
      await writeAuditEvent({
        action: kyb.overridden ? "kyb.approval_override" : "kyb.approval_warning",
        targetType: "organization",
        targetId: id,
        actorUserId: String(session.userId),
        organizationId: id,
        metadata: { warning: kyb.warning, reason: kyb.overridden ? parsed.data.kybOverrideReason : undefined },
      });
    }

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
    if (error instanceof KybGateError) {
      return NextResponse.json(
        { error: error.message, code: error.code, canOverride: error.canOverride },
        { status: 409 },
      );
    }
    console.error("[admin/buyers/:id POST]", error);
    return NextResponse.json({ error: "Unable to update buyer organization." }, { status: 500 });
  }
}
