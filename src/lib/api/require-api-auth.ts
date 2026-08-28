import { NextResponse } from "next/server";
import type { Permission } from "@/lib/authorization/permissions";
import { ForbiddenError, AuthError } from "@/lib/auth/errors";
import { getSession } from "@/lib/auth/session";
import { authContextHasPermission, getAuthContext, type AuthContext } from "@/lib/auth/auth-context";
import { writeAuditEvent } from "@/lib/audit/log";
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

  if (options.requireEmailVerified && !ctx.user.emailVerified) {
    return {
      error: NextResponse.json({ error: "Email verification required." }, { status: 403 }),
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
  console.error("[api]", error);
  return NextResponse.json({ error: "Unable to process request." }, { status: 500 });
}
