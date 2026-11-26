import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { z } from "zod";
import { getEnv } from "@/lib/config/env";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { verifyBuyerDecisionToken } from "@/lib/admin/buyer-decision-token";
import { decideBuyerOrganization, loadBuyerDetail } from "@/lib/admin/buyer-approval";
import { KybGateError } from "@/lib/kyb/kyb-service";
import { notifyBuyerApproved, notifyBuyerRejected } from "@/lib/email/buyer-notifications";
import { writeAuditEvent } from "@/lib/audit/log";
import { auditRequestMeta } from "@/lib/api/request-meta";

export const runtime = "nodejs";

const schema = z.object({
  token: z.string().min(10),
  decision: z.enum(["approved", "rejected"]),
  reason: z.string().trim().max(1000).optional(),
});

/** The Finekarts admin account that the decision is recorded under when it is made from the email link. */
async function findDecisionActorId(): Promise<string | null> {
  const env = getEnv();
  const { User, OrganizationMembership } = await import("@/models");
  for (const email of [env.ADMIN_NOTIFY_EMAIL, env.INITIAL_ADMIN_EMAIL]) {
    if (!email) continue;
    const user = await User.findOne({ email: email.toLowerCase(), status: "active", deletedAt: null }).select("_id").lean();
    if (user) return String(user._id);
  }
  const membership = await OrganizationMembership.findOne({
    status: "active",
    deletedAt: null,
    roles: { $in: ["ceo_super_admin", "general_manager"] },
  })
    .select("userId")
    .lean();
  return membership ? String(membership.userId) : null;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 422 });

  const check = verifyBuyerDecisionToken(parsed.data.token);
  if (!check.ok) {
    return NextResponse.json(
      { error: check.reason === "expired" ? "This link has expired. Open the buyer in the admin instead." : "This link is not valid." },
      { status: 400 },
    );
  }
  if (!Types.ObjectId.isValid(check.orgId)) return NextResponse.json({ error: "This link is not valid." }, { status: 400 });
  if (!(await tryConnectMongo())) {
    return NextResponse.json({ error: "Service temporarily unavailable." }, { status: 503 });
  }

  const detail = await loadBuyerDetail(check.orgId);
  if (!detail) return NextResponse.json({ error: "Buyer not found." }, { status: 404 });
  if (detail.status !== "pending") {
    return NextResponse.json(
      { error: `This buyer has already been decided (${detail.status}).`, status: detail.status },
      { status: 409 },
    );
  }

  const actorUserId = await findDecisionActorId();
  if (!actorUserId) {
    return NextResponse.json({ error: "No admin account is set up to record this decision." }, { status: 500 });
  }

  try {
    const { org, contact } = await decideBuyerOrganization({
      orgId: check.orgId,
      decision: parsed.data.decision,
      actorUserId: new Types.ObjectId(actorUserId),
      reason: parsed.data.reason,
    });

    await writeAuditEvent({
      action: parsed.data.decision === "approved" ? "buyer.approved_by_email_link" : "buyer.rejected_by_email_link",
      targetType: "organization",
      targetId: check.orgId,
      actorUserId,
      organizationId: check.orgId,
      ...auditRequestMeta(request),
    });

    if (contact) {
      try {
        if (parsed.data.decision === "approved") {
          await notifyBuyerApproved({ contactEmail: contact.email, contactName: contact.name, organizationName: org.legalName });
        } else {
          await notifyBuyerRejected({
            contactEmail: contact.email,
            contactName: contact.name,
            organizationName: org.legalName,
            reason: parsed.data.reason,
          });
        }
      } catch (mailError) {
        console.error("[buyer-decision] email to buyer failed", mailError);
      }
    }
    return NextResponse.json({ ok: true, decision: parsed.data.decision });
  } catch (error) {
    if (error instanceof KybGateError) {
      return NextResponse.json(
        { error: "This buyer needs a KYB check before approval. Please open the buyer in the admin.", code: error.code },
        { status: 409 },
      );
    }
    console.error("[buyer-decision]", error);
    return NextResponse.json({ error: "Unable to record the decision." }, { status: 500 });
  }
}
