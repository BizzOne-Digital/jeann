import { NextResponse } from "next/server";
import type { Permission } from "@/lib/authorization/permissions";
import { ForbiddenError, AuthError } from "@/lib/auth/errors";
import { getSession } from "@/lib/auth/session";
import { authContextHasPermission, getAuthContext, type AuthContext } from "@/lib/auth/auth-context";
import { writeAuditEvent } from "@/lib/audit/log";
import { isPrimaryContactVerified } from "@/lib/auth/verification-policy";
import { logSecurityEvent } from "@/lib/security/security-service";

export type ApiAuthOptions = {
  permissions?: Permission | Permission[];
  requireEmailVerified?: boolean;
  allowStatuses?: string[];
};

export type ApiAuthResult =
  | { ctx: AuthContext; sessionUserId: string }
  | { error: NextResponse };

export async function requireApiAuth(options: ApiAuthOptions = {}): Promise<ApiAuthResult> {
  const session = await getSession();
  if (!session) {
    return {
      error: NextResponse.json({ error: "Authentication required." }, { status: 401 }),
    };
  }

  const ctx = await getAuthContext(session.userId);
  if (!ctx) {
    return {
      error: NextResponse.json({ error: "Authentication required." }, { status: 401 }),
    };
  }

  if (options.allowStatuses && !options.allowStatuses.includes(ctx.user.status)) {
    return {
      error: NextResponse.json({ error: "Account is not permitted to perform this action." }, { status: 403 }),
    };
  }

  if (ctx.user.status === "suspended" || ctx.user.status === "disabled") {
    return {
      error: NextResponse.json({ error: "Account is suspended." }, { status: 403 }),
    };
  }

  if (options.requireEmailVerified && !isPrimaryContactVerified(ctx.user)) {
    return {
      error: NextResponse.json(
        { error: "Please verify your phone number (primary) to continue." },
        { status: 403 },
      ),
    };
  }

  if (options.permissions && !authContextHasPermission(ctx, options.permissions)) {
    await writeAuditEvent({
      action: "access.denied",
      targetType: "api",
      actorUserId: ctx.userId,
      result: "failure",
      failureReason: "insufficient_permissions",
      metadata: { required: options.permissions },
    });
    await logSecurityEvent({
      eventType: "auth.unauthorized_api_access",
      severity: "high",
      userId: ctx.userId,
      organizationId: ctx.memberships[0]?.organizationId,
      targetType: "api",
      result: "blocked",
      safeMetadata: { required: options.permissions },
    });
    return {
      error: NextResponse.json({ error: "Forbidden." }, { status: 403 }),
    };
  }

  return { ctx, sessionUserId: session.userId };
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof AuthError) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
  if (error instanceof ForbiddenError) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
  if (error instanceof Error && error.name === "ZodError") {
    const issues = (error as Error & { issues?: Array<{ message?: string; path?: unknown[] }> }).issues;
    const first = issues?.[0];
    const where = first?.path?.length ? `${first.path.join(".")}: ` : "";
    return NextResponse.json({ error: `${where}${first?.message ?? "Invalid input."}` }, { status: 422 });
  }
  if (error instanceof Error && error.name === "StepRuleError") {
    const status = (error as Error & { status?: number }).status ?? 409;
    return NextResponse.json({ error: error.message }, { status });
  }
  if (error instanceof Error) {
    const known: Record<string, [string, number]> = {
      version_not_submitted: ["Only a submitted version can be reviewed.", 409],
      version_not_signable: ["This document version cannot be signed.", 409],
      version_not_approved: ["The version must be approved before sending.", 409],
      version_not_editable: ["This version is locked and cannot be changed.", 409],
      passport_required: ["Upload a passport copy of the signer (document type Passport copy) before signing.", 422],
      document_not_found: ["Document not found.", 404],
      version_not_found: ["Version not found.", 404],
      comment_required: ["A comment is required.", 422],
      reason_required: ["A reason is required.", 422],
      invalid_transition: ["That status change is not allowed from the current state.", 409],
      not_found: ["Not found.", 404],
    };
    const hit = known[error.message];
    if (hit) return NextResponse.json({ error: hit[0] }, { status: hit[1] });
  }
  console.error("[api]", error);
  return NextResponse.json({ error: "Unable to process request." }, { status: 500 });
}
