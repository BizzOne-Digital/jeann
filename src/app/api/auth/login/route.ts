import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth/session";
import { findDevUserByEmail } from "@/lib/auth/dev-store";
import {
  getSessionConfigError,
  isSessionConfigError,
} from "@/lib/auth/session-config";
import { verifyPassword } from "@/lib/auth/password";
import { loginSchema } from "@/lib/validation/auth";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import {
  isAccountLocked,
  lockoutUntilFromAttempts,
  rolesRequireMfa,
  MAX_FAILED_LOGINS,
} from "@/lib/auth/login-policy";
import { sendVerificationCode } from "@/lib/auth/verification-service";
import { createMfaToken } from "@/lib/auth/mfa";
import { writeAuditEvent } from "@/lib/audit/log";
import { auditRequestMeta } from "@/lib/api/request-meta";
import { getClientIp } from "@/lib/api/request-meta";
import { isProductionEnvironment } from "@/lib/security/production-guards";
import { logSecurityEvent } from "@/lib/security/security-service";
import type { RoleKey } from "@/lib/authorization/permissions";

export const runtime = "nodejs";

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
  const meta = auditRequestMeta(request);
  const ua = request.headers.get("user-agent") ?? undefined;
  const ip = getClientIp(request);

  try {
    const parsed = loginSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const email = parsed.data.email.trim().toLowerCase();
    const password = parsed.data.password;

    if (isMongoConfigured()) {
      if (!(await tryConnectMongo())) {
        return NextResponse.json(
          { error: "Service temporarily unavailable. Please try again shortly." },
          { status: 503 },
        );
      }

      const { User, OrganizationMembership } = await import("@/models");
      const user = await User.findOne({ email, deletedAt: null }).select("+passwordHash");

      if (!user?.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
        if (user) {
          user.failedLoginCount = (user.failedLoginCount ?? 0) + 1;
          if (user.failedLoginCount >= MAX_FAILED_LOGINS) {
            user.lockedUntil = lockoutUntilFromAttempts(user.failedLoginCount);
            user.status = "locked";
          }
          await user.save();
        }
        await writeAuditEvent({
          action: "login.failed",
          targetType: "user",
          targetId: user?._id,
          ...meta,
          result: "failure",
          failureReason: "invalid_credentials",
        });
        await logSecurityEvent({
          eventType: "auth.login.failed",
          severity: user?.failedLoginCount >= MAX_FAILED_LOGINS ? "high" : "medium",
          userId: user?._id,
          ipAddress: ip,
          userAgent: ua,
          result: "failure",
          safeMetadata: { failedCount: user?.failedLoginCount },
        });
        if (user?.failedLoginCount >= MAX_FAILED_LOGINS) {
          await logSecurityEvent({
            eventType: "auth.account.lockout",
            severity: "high",
            userId: user._id,
            ipAddress: ip,
            userAgent: ua,
            result: "blocked",
          });
        }
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
      }

      if (isAccountLocked(user.lockedUntil) || user.status === "locked") {
        return NextResponse.json(
          { error: "Account temporarily locked. Try again later." },
          { status: 403 },
        );
      }

      if (user.status === "suspended" || user.status === "disabled") {
        return NextResponse.json({ error: "Your account is not active." }, { status: 403 });
      }

      const membership = await OrganizationMembership.findOne({
        userId: user._id,
        status: "active",
        deletedAt: null,
      }).lean();
      const roles = membership?.roles ?? [];
      const redirectTo = portalRedirectForRoles(roles);
      if (!redirectTo) {
        return NextResponse.json(
          { error: "Your account has no portal access yet. Please contact support." },
          { status: 403 },
        );
      }

      if (rolesRequireMfa(roles as RoleKey[])) {
        const sent = await sendVerificationCode({
          userId: user._id,
          channel: "email",
          purpose: "mfa_login",
          destination: user.email,
          name: user.name,
        });
        const mfaToken = await createMfaToken(String(user._id));
        return NextResponse.json({
          ok: true,
          requiresMfa: true,
          mfaToken,
          ...(isProductionEnvironment() ? {} : { devCode: sent.devCode }),
        });
      }

      const sessionIssue = getSessionConfigError();
      if (sessionIssue) {
        return NextResponse.json({ error: sessionIssue }, { status: 503 });
      }

      try {
        await createSession({ userId: user._id, userAgent: ua, ip });
      } catch (sessionError) {
        console.error("[login] session", sessionError);
        if (isSessionConfigError(sessionError)) {
          return NextResponse.json({ error: sessionIssue ?? "Unable to sign in." }, { status: 503 });
        }
        throw sessionError;
      }

      await User.updateOne(
        { _id: user._id },
        { $set: { lastLoginAt: new Date(), failedLoginCount: 0 }, $unset: { lockedUntil: 1 } },
      );

      await writeAuditEvent({
        action: "login.success",
        targetType: "user",
        targetId: user._id,
        actorUserId: user._id,
        ...meta,
      });

      return NextResponse.json({ ok: true, redirectTo });
    }

    const devUser = await findDevUserByEmail(email);
    if (!devUser || !(await verifyPassword(password, devUser.passwordHash))) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    if (devUser.status !== "active") {
      return NextResponse.json(
        { error: "Your registration is still under review." },
        { status: 403 },
      );
    }
    await createSession({
      userId: devUser.id,
      userAgent: ua,
      ip,
    });
    const redirectTo =
      devUser.role === "admin"
        ? "/admin"
        : devUser.role === "employee"
          ? "/workspace"
          : `/portal/${devUser.role === "buyer" ? "buyer" : devUser.role}`;
    return NextResponse.json({ ok: true, redirectTo });
  } catch (error) {
    console.error("[login]", error);
    return NextResponse.json({ error: "Unable to sign in." }, { status: 400 });
  }
}
