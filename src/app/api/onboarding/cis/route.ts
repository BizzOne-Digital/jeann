import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import {
  getLatestCisProfile,
  getOrCreateDraftCis,
  updateCisDraft,
  submitCisProfile,
  listCisVersions,
} from "@/lib/onboarding/cis-service";
import { writeAuditEvent } from "@/lib/audit/log";
import { auditRequestMeta } from "@/lib/api/request-meta";

export const runtime = "nodejs";

const patchSchema = z.object({
  organizationId: z.string(),
  legalName: z.string().trim().min(2).max(200).optional(),
  tradingName: z.string().trim().max(200).optional(),
  registrationNumber: z.string().trim().max(80).optional(),
  jurisdiction: z.string().trim().max(120).optional(),
  businessType: z.string().trim().max(120).optional(),
  website: z.string().trim().max(200).optional(),
  businessActivities: z.string().trim().max(2000).optional(),
  representatives: z.array(z.record(z.string(), z.unknown())).optional(),
  contacts: z.array(z.record(z.string(), z.unknown())).optional(),
  addresses: z.array(z.record(z.string(), z.unknown())).optional(),
  authorizedSigners: z.array(z.record(z.string(), z.unknown())).optional(),
});

function assertOrgAccess(
  ctx: { userId: string; memberships: { organizationId: string }[]; isInternal: boolean },
  organizationId: string,
): boolean {
  return (
    ctx.isInternal ||
    ctx.memberships.some((m) => m.organizationId === organizationId)
  );
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth();
    if ("error" in auth) return auth.error;

    const organizationId = request.nextUrl.searchParams.get("organizationId");
    if (!organizationId || !assertOrgAccess(auth.ctx, organizationId)) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const latest = await getLatestCisProfile(organizationId);
    const versions = await listCisVersions(organizationId);
    return NextResponse.json({ profile: latest, versions });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ requireEmailVerified: true });
    if ("error" in auth) return auth.error;

    const parsed = patchSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid CIS data." }, { status: 422 });
    }

    const { organizationId, ...patch } = parsed.data;
    if (!assertOrgAccess(auth.ctx, organizationId)) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    await getOrCreateDraftCis(organizationId);
    await updateCisDraft(organizationId, patch);

    const meta = auditRequestMeta(request);
    await writeAuditEvent({
      action: "cis.draft_updated",
      targetType: "cis_profile",
      actorUserId: auth.ctx.userId,
      organizationId,
      ...meta,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "cis_locked") {
      return NextResponse.json({ error: "CIS profile is locked." }, { status: 409 });
    }
    return handleApiError(error);
  }
}
