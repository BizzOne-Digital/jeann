import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth/password";
import { registerBuyerSchema } from "@/lib/validation/auth";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { normalizeCompanyName } from "@/lib/db/ids";
import { splitName } from "@/lib/auth/auth-context";
import { checkDuplicateOrganization } from "@/lib/onboarding/duplicate-org";
import {
  recordTermsAcceptance,
  BUYER_REQUIRED_TERMS_KEYS,
  getCurrentTerms,
} from "@/lib/terms/service";
import { sendVerificationCode } from "@/lib/auth/verification-service";
import {
  notifyAdminNewBuyerRegistration,
  notifyBuyerRegistrationReceived,
} from "@/lib/email/buyer-notifications";
import { writeAuditEvent } from "@/lib/audit/log";
import { auditRequestMeta } from "@/lib/api/request-meta";
import { getClientIp } from "@/lib/api/request-meta";
import { isDuplicateKeyError, isSessionConfigError } from "@/lib/auth/session-config";

export const runtime = "nodejs";

function countryCode(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 2) return trimmed.toUpperCase();
  const map: Record<string, string> = {
    canada: "CA",
    "united states": "US",
    usa: "US",
    india: "IN",
    pakistan: "PK",
    "united kingdom": "GB",
    uk: "GB",
  };
  return map[trimmed.toLowerCase()] ?? (trimmed.slice(0, 2).toUpperCase() || "XX");
}

function validationMessage(issues: { fieldErrors: Record<string, string[] | undefined> }): string {
  const first =
    issues.fieldErrors.confirmPassword?.[0] ??
    issues.fieldErrors.password?.[0] ??
    issues.fieldErrors.email?.[0] ??
    issues.fieldErrors.acceptBuyerTerms?.[0] ??
    issues.fieldErrors.acceptPrivacy?.[0];
  return first ?? "Please correct the highlighted fields.";
}

export async function POST(request: NextRequest) {
  const meta = auditRequestMeta(request);
  const ip = getClientIp(request);
  const ua = request.headers.get("user-agent");

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const parsed = registerBuyerSchema.safeParse(body);
    if (!parsed.success) {
      const flat = parsed.error.flatten();
      return NextResponse.json(
        { error: validationMessage(flat), issues: flat },
        { status: 422 },
      );
    }

    const input = parsed.data;
    const email = input.email.toLowerCase();
    const normalizedEmail = email;
    const passwordHash = await hashPassword(input.password);
    const nameParts = splitName(input.contactName);

    if (!isMongoConfigured()) {
      return NextResponse.json(
        { error: "Database is required for registration." },
        { status: 503 },
      );
    }

    if (!(await tryConnectMongo())) {
      return NextResponse.json(
        { error: "Database is unavailable. Please try again shortly." },
        { status: 503 },
      );
    }

    const { User, Organization, OrganizationMembership } = await import("@/models");

    const existingEmail = await User.findOne({ email, deletedAt: null });
    if (existingEmail) {
      if (existingEmail.status === "pending_verification") {
        const verification = await sendVerificationCode({
          userId: existingEmail._id,
          channel: "email",
          purpose: "email_verify",
          destination: email,
          name: existingEmail.name,
        });
        return NextResponse.json(
          {
            ok: true,
            status: "pending_verification",
            redirectTo: "/login",
            message:
              "This email is already registered but not verified. We sent a new verification code — check your inbox, then sign in.",
            devVerificationCode: verification.devCode,
          },
          { status: 200 },
        );
      }
      return NextResponse.json(
        {
          error:
            "An account with this email already exists. Sign in, or use password reset if you forgot your password.",
          code: "email_exists",
        },
        { status: 409 },
      );
    }

    const duplicateCheck = await checkDuplicateOrganization({
      legalName: input.legalName,
      registrationNumber: input.registrationNumber,
      jurisdiction: input.country,
      domain: input.domain,
      email,
    });

    if (duplicateCheck.blockAutoCreate) {
      await writeAuditEvent({
        action: "organization.duplicate_blocked",
        targetType: "organization",
        ...meta,
        metadata: { reasons: duplicateCheck.reasons },
      });
      return NextResponse.json(
        {
          ok: true,
          status: "review",
          message:
            "A company with this registration details already exists. An administrator will review your request.",
        },
        { status: 202 },
      );
    }

    const normalized = normalizeCompanyName(input.legalName) || "buyer";
    const country = countryCode(input.country);

    const org = await Organization.create({
      type: "buyer",
      legalName: input.legalName,
      normalizedLegalName: normalized,
      registrationNumber: input.registrationNumber,
      jurisdiction: input.country,
      country,
      domain: input.domain?.toLowerCase() || undefined,
      status: "pending",
      onboardingStatus: "email_verification_pending",
      duplicateReviewFlag: duplicateCheck.duplicateReviewFlag,
      mergeReviewFlag: duplicateCheck.mergeReviewFlag,
    });

    const user = await User.create({
      email,
      normalizedEmail,
      passwordHash,
      firstName: nameParts.firstName,
      lastName: nameParts.lastName,
      name: input.contactName,
      phone: input.phone,
      status: "pending_verification",
      mfaEnabled: false,
    });

    org.createdByUserId = user._id;
    await org.save();

    await OrganizationMembership.create({
      userId: user._id,
      organizationId: org._id,
      roles: ["buyer_org_admin"],
      customPermissions: [],
      status: "active",
    });

    const requiredTerms = await getCurrentTerms([...BUYER_REQUIRED_TERMS_KEYS]);
    for (const term of requiredTerms) {
      await recordTermsAcceptance({
        userId: user._id,
        organizationId: String(org._id),
        termsKey: term.key,
        termsVersion: term.version,
        ip,
        userAgent: ua ?? undefined,
        metadata: { source: "buyer_registration" },
      });
    }

    const { Approval } = await import("@/models");
    await Approval.create({
      targetType: "buyer_organization",
      targetId: org._id,
      decision: "pending",
      actorUserId: user._id,
    });

    const verification = await sendVerificationCode({
      userId: user._id,
      channel: "email",
      purpose: "email_verify",
      destination: email,
      name: input.contactName,
    });

    try {
      await Promise.all([
        notifyBuyerRegistrationReceived({
          contactEmail: email,
          contactName: input.contactName,
          organizationName: input.legalName,
        }),
        notifyAdminNewBuyerRegistration({
          organizationName: input.legalName,
          contactName: input.contactName,
          contactEmail: email,
          country,
          organizationId: String(org._id),
        }),
      ]);
    } catch (emailError) {
      console.error("[register/buyer] email", emailError);
    }

    await writeAuditEvent({
      action: "registration.buyer",
      targetType: "user",
      targetId: user._id,
      actorUserId: user._id,
      organizationId: String(org._id),
      ...meta,
      metadata: {
        duplicateReviewFlag: duplicateCheck.duplicateReviewFlag,
        devVerificationCode: verification.devCode,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        status: "pending_verification",
        redirectTo: "/login",
        message: "Registration received. Verify your email to continue onboarding.",
        devVerificationCode: verification.devCode,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[register/buyer]", error);
    if (isDuplicateKeyError(error)) {
      return NextResponse.json(
        {
          error:
            "An account or company with these details may already exist. Sign in or contact support.",
          code: "duplicate",
        },
        { status: 409 },
      );
    }
    if (isSessionConfigError(error)) {
      return NextResponse.json(
        { error: "Server auth is not configured. Please contact support." },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { error: "Unable to complete registration. Please try again or contact support." },
      { status: 500 },
    );
  }
}
