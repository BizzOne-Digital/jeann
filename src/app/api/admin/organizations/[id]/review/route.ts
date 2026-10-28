import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { reviewCisProfile } from "@/lib/onboarding/cis-service";
import { writeAuditEvent } from "@/lib/audit/log";
import { auditRequestMeta } from "@/lib/api/request-meta";
import { KybGateError } from "@/lib/kyb/kyb-service";

export const runtime = "nodejs";

const reviewSchema = z.object({
  action: z.enum(["approve", "reject", "request_changes", "start_review"]),
  cisProfileId: z.string(),
  comment: z.string().trim().max(2000).optional(),
  reason: z.string().trim().max(2000).optional(),
  kybOverrideReason: z.string().trim().max(2000).optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "orgs:verify" });
    if ("error" in auth) return auth.error;

    const { id: organizationId } = await params;
    const parsed = reviewSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid review request." }, { status: 422 });
    }

    const result = await reviewCisProfile({
      organizationId,
      cisProfileId: parsed.data.cisProfileId,
      actorUserId: auth.ctx.userId,
      action: parsed.data.action,
      comment: parsed.data.comment,
      reason: parsed.data.reason,
      kybOverrideReason: parsed.data.kybOverrideReason,
    });

    const meta = auditRequestMeta(request);
    await writeAuditEvent({
      action: `organization.${parsed.data.action}`,
      targetType: "organization",
      targetId: organizationId,
      actorUserId: auth.ctx.userId,
      organizationId,
      ...meta,
      metadata: {
        cisProfileId: parsed.data.cisProfileId,
        kybOverridden: result.kybOverridden,
        kybWarning: result.kybWarning,
        kybOverrideReason: result.kybOverridden ? parsed.data.kybOverrideReason : undefined,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof KybGateError) {
      return NextResponse.json(
        { error: error.message, code: error.code, canOverride: error.canOverride },
        { status: 409 },
      );
    }
    if (error instanceof Error) {
      if (error.message === "comment_required" || error.message === "reason_required") {
        return NextResponse.json({ error: "A comment or reason is required." }, { status: 422 });
      }
    }
    return handleApiError(error);
  }
}
