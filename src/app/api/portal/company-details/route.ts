import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { writeAuditEvent } from "@/lib/audit/log";
import { tryConnectMongo } from "@/lib/db/mongoose";
import {
  cleanDocumentDetails,
  documentDetailsSchemaFor,
  fieldsForKind,
  type OrgKind,
} from "@/lib/organizations/document-details";

export const runtime = "nodejs";

const KINDS: OrgKind[] = ["buyer", "supplier", "agent", "broker"];

/** The caller's own organization and what kind of portal organization it is. Staff have none. */
function resolveOrganization(ctx: { memberships: { organizationId: string; roles: string[]; status: string }[] }) {
  for (const m of ctx.memberships) {
    if (m.status !== "active") continue;
    for (const kind of KINDS) {
      const role = m.roles.find((r) => r.startsWith(kind + "_"));
      if (role) return { organizationId: m.organizationId, kind, canEdit: role === kind + "_org_admin" };
    }
  }
  return null;
}

export async function GET() {
  try {
    const auth = await requireApiAuth();
    if ("error" in auth) return auth.error;
    const org = resolveOrganization(auth.ctx);
    if (!org) return NextResponse.json({ error: "No organization on this account." }, { status: 403 });
    if (!(await tryConnectMongo())) {
      return NextResponse.json({ error: "Service temporarily unavailable." }, { status: 503 });
    }
    const { Organization } = await import("@/models");
    const doc = await Organization.findById(org.organizationId).select("legalName documentDetails").lean();
    if (!doc) return NextResponse.json({ error: "Organization not found." }, { status: 404 });
    return NextResponse.json({
      kind: org.kind,
      canEdit: org.canEdit,
      companyName: doc.legalName,
      fields: fieldsForKind(org.kind),
      values: cleanDocumentDetails(org.kind, doc.documentDetails as Record<string, unknown> | undefined),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireApiAuth();
    if ("error" in auth) return auth.error;
    const org = resolveOrganization(auth.ctx);
    if (!org) return NextResponse.json({ error: "No organization on this account." }, { status: 403 });
    if (!org.canEdit) {
      return NextResponse.json({ error: "Only your organization administrator can change these details." }, { status: 403 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }
    const parsed = documentDetailsSchemaFor(org.kind).safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Please correct the form." }, { status: 422 });
    }
    if (!(await tryConnectMongo())) {
      return NextResponse.json({ error: "Service temporarily unavailable." }, { status: 503 });
    }

    const details = cleanDocumentDetails(org.kind, parsed.data as Record<string, unknown>);
    const { Organization } = await import("@/models");
    const updated = await Organization.findByIdAndUpdate(
      org.organizationId,
      { $set: { documentDetails: details } },
      { new: true },
    )
      .select("_id")
      .lean();
    if (!updated) return NextResponse.json({ error: "Organization not found." }, { status: 404 });

    await writeAuditEvent({
      action: "organization.document_details.updated",
      targetType: "organization",
      targetId: org.organizationId,
      actorUserId: auth.ctx.userId,
      organizationId: org.organizationId,
      result: "success",
    });

    return NextResponse.json({ ok: true, values: details });
  } catch (error) {
    return handleApiError(error);
  }
}
