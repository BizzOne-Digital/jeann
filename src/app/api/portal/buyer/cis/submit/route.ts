import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getBuyerOrganizationId } from "@/lib/auth/buyer-org";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { notifyBuyerProfileSubmitted } from "@/lib/email/buyer-notifications";
import { submitCisProfile } from "@/lib/onboarding/cis-service";
import { writeAuditEvent } from "@/lib/audit/log";
import { auditRequestMeta } from "@/lib/api/request-meta";

export const runtime = "nodejs";

/** The buyer sends the saved company profile to Finekarts for approval. */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    if (!isMongoConfigured()) {
      return NextResponse.json({ error: "Service temporarily unavailable." }, { status: 503 });
    }
    await tryConnectMongo();
    const orgId = await getBuyerOrganizationId(session);
    if (!orgId) {
      return NextResponse.json({ error: "No buyer organization on this account." }, { status: 403 });
    }

    const result = await submitCisProfile({
      organizationId: String(orgId),
      userId: session.userId,
      requireDocuments: false,
    });

    await writeAuditEvent({
      action: "cis.submitted",
      targetType: "cis_profile",
      actorUserId: session.userId,
      organizationId: String(orgId),
      ...auditRequestMeta(request),
      metadata: { version: result.version, source: "buyer_company_profile" },
    });

    // Email must never undo a successful submission, but a failure must not stay invisible either.
    let emailSent = true;
    try {
      const { Organization } = await import("@/models");
      const org = await Organization.findById(orgId).select("legalName").lean();
      await notifyBuyerProfileSubmitted({
        organizationName: org?.legalName ?? "A buyer",
        contactName: session.user.name || session.user.email,
        contactEmail: session.user.email,
        organizationId: String(orgId),
      });
    } catch (mailError) {
      emailSent = false;
      console.error("[portal/buyer/cis/submit] email failed", mailError);
    }

    return NextResponse.json({ ok: true, version: result.version, emailSent });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "incomplete_cis") {
        return NextResponse.json({ error: "Complete and save the company profile first." }, { status: 422 });
      }
      if (error.message === "no_editable_cis") {
        return NextResponse.json(
          { error: "Save your company profile first, or it has already been submitted." },
          { status: 409 },
        );
      }
    }
    console.error("[portal/buyer/cis/submit]", error);
    return NextResponse.json({ error: "Unable to submit the company profile." }, { status: 400 });
  }
}
