import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSession } from "@/lib/auth/session";
import { verifyMfaToken } from "@/lib/auth/mfa";
import { verifyUserCode } from "@/lib/auth/verification-service";
import { writeAuditEvent } from "@/lib/audit/log";
import { auditRequestMeta } from "@/lib/api/request-meta";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { rolesRequireMfa } from "@/lib/auth/login-policy";
import type { RoleKey } from "@/lib/authorization/permissions";

export const runtime = "nodejs";

const schema = z.object({
  mfaToken: z.string().min(10),
  code: z.string().trim().min(4).max(12),
});

function portalRedirectForRoles(roles: string[]): string | null {
  if (roles.some((r) => r === "ceo_super_admin" || r === "general_manager")) {
    return "/admin";
  }
  if (
    roles.some((r) =>
      ["trade_manager", "employee_operations", "finance", "compliance_reviewer"].includes(r),
    )
  ) {
    return "/workspace";
  }
  if (roles.some((r) => r.startsWith("supplier_"))) {
    return "/portal/supplier";
  }
  if (roles.includes("banking_advisor")) {
    return "/portal/banking";
  }
  if (roles.some((r) => r === "buyer_org_admin" || r === "buyer_member")) {
    return "/portal/buyer";
  }
  return null;
}

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid MFA request." }, { status: 422 });
  }

  const userId = await verifyMfaToken(parsed.data.mfaToken);
  if (!userId) {
    return NextResponse.json({ error: "MFA session expired. Sign in again." }, { status: 401 });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
  }

  await tryConnectMongo();
  const meta = auditRequestMeta(request);
  const ua = request.headers.get("user-agent") ?? undefined;
  const ip = meta.ipHash ? undefined : request.headers.get("x-forwarded-for")?.split(",")[0];

  const verification = await verifyUserCode({
    userId,
    purpose: "mfa_login",
    code: parsed.data.code,
  });

  if (!verification.valid) {
    await writeAuditEvent({
      action: "mfa.failed",
      targetType: "user",
      targetId: userId,
      actorUserId: userId,
      result: "failure",
      failureReason: verification.reason,
      ...meta,
    });
    return NextResponse.json({ error: "Invalid or expired code." }, { status: 400 });
  }

  const { User, OrganizationMembership } = await import("@/models");
  const user = await User.findById(userId).lean();
  if (!user || user.status === "suspended" || user.status === "disabled") {
    return NextResponse.json({ error: "Account is not active." }, { status: 403 });
  }

  const membership = await OrganizationMembership.findOne({
    userId: user._id,
    status: "active",
    deletedAt: null,
  }).lean();
  const roles = membership?.roles ?? [];
  if (!rolesRequireMfa(roles as RoleKey[])) {
    return NextResponse.json({ error: "MFA not required." }, { status: 400 });
  }

  await createSession({ userId: user._id, userAgent: ua, ip });
  await User.updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date(), failedLoginCount: 0 } });

  await writeAuditEvent({
    action: "mfa.success",
    targetType: "user",
    targetId: userId,
    actorUserId: userId,
    ...meta,
  });
  await writeAuditEvent({
    action: "login.success",
    targetType: "user",
    targetId: userId,
    actorUserId: userId,
    ...meta,
  });

  const redirectTo = portalRedirectForRoles(roles) ?? "/workspace";
  return NextResponse.json({ ok: true, redirectTo });
}
