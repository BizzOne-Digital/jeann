import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { submitCisProfile } from "@/lib/onboarding/cis-service";
import { writeAuditEvent } from "@/lib/audit/log";
import { auditRequestMeta } from "@/lib/api/request-meta";

export const runtime = "nodejs";

const schema = z.object({
  organizationId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ requireEmailVerified: true });
    if ("error" in auth) return auth.error;

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request." }, { status: 422 });
    }

    const { organizationId } = parsed.data;
    const allowed =
      auth.ctx.isInternal ||
      auth.ctx.memberships.some((m) => m.organizationId === organizationId);
    if (!allowed) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const result = await submitCisProfile({
      organizationId,
      userId: auth.ctx.userId,
    });

    const meta = auditRequestMeta(request);
    await writeAuditEvent({
      action: "cis.submitted",
      targetType: "cis_profile",
      actorUserId: auth.ctx.userId,
      organizationId,
      ...meta,
      metadata: { version: result.version },
    });

    return NextResponse.json({ ok: true, version: result.version });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "incomplete_cis") {
        return NextResponse.json({ error: "Complete required CIS fields first." }, { status: 422 });
      }
      if (error.message === "documents_required") {
        return NextResponse.json({ error: "Upload supporting documents first." }, { status: 422 });
      }
      if (error.message === "no_editable_cis") {
        return NextResponse.json({ error: "No editable CIS profile." }, { status: 409 });
      }
    }
    return handleApiError(error);
  }
}
