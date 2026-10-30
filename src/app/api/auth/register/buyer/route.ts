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
import { sendRegistrationCodes } from "@/lib/auth/registration-codes";
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
    const contactName = input.managerName || input.contactName || "";
    const nameParts = splitName(contactName);

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
        const verification = await sendRegistrationCodes({
          userId: existingEmail._id,
          email,
          phone: existingEmail.phone,
          name: existingEmail.name,
        });
        return NextResponse.json(
          {
            ok: true,
            status: "pending_verification",
            redirectTo: `/verify-email?email=${encodeURIComponent(email)}`,
            message:
              "This email is already registered but not verified. We sent new verification codes — enter them on the next screen.",
            devVerificationCode: verification.devEmailCode,
            devPhoneCode: verification.devPhoneCode,
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

    // A matching registration number no longer stops the sign-up (that left the buyer with no
    // account and no code). The new organization is created separately, flagged for admin review.
    if (duplicateCheck.duplicateReviewFlag) {
      await writeAuditEvent({
        action: "organization.duplicate_flagged",
        targetType: "organization",
        ...meta,
        metadata: { reasons: duplicateCheck.reasons },
      });
    }

    const normalized = normalizeCompanyName(input.legalName) || "buyer";
    const country = countryCode(input.country);

    const org = await Organization.create({
      type: "buyer",
      legalName: input.legalName,
      normalizedLegalName: normalized,
      registrationNumber: input.registrationNumber,
      taxNumber: input.taxNumber,
      previousHsCode: input.previousHsCode,
      jurisdiction: input.country,
      country,
      businessAddressLine1: input.addressLine1,
      businessAddressCity: input.addressCity,
      businessAddressRegion: input.addressRegion,
      businessAddressPostal: input.addressPostal,
      domain: input.domain?.toLowerCase() || undefined,
      status: "pending",
      onboardingStatus: "email_verification_pending",
      duplicateReviewFlag: duplicateCheck.duplicateReviewFlag,
      mergeReviewFlag: duplicateCheck.mergeReviewFlag,
      verificationNotes: duplicateCheck.duplicateReviewFlag
        ? `Possible duplicate of an existing company (${duplicateCheck.reasons.join(", ")}). Review before approving.`
        : undefined,
    });

    const user = await User.create({
      email,
      normalizedEmail,
      passwordHash,
      firstName: nameParts.firstName,
      lastName: nameParts.lastName,
      name: contactName,
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

    const { CisProfile } = await import("@/models");
    await CisProfile.create({
      organizationId: org._id,
      version: 1,
      status: "draft",
      legalName: input.legalName,
      registrationNumber: input.registrationNumber,
      taxId: input.taxNumber,
      jurisdiction: input.country,
      representatives: [
        {
          name: contactName,
          title: "Manager",
          email,
          phone: input.phone,
        },
      ],
      contacts: [{ name: contactName, email, phone: input.phone }],
      addresses: [
        {
          label: "Registered",
          line1: input.addressLine1,
          city: input.addressCity,
          region: input.addressRegion,
          postalCode: input.addressPostal,
          country,
        },
      ],
      productInterests: [{ productName: "—", notes: `Previous HS code: ${input.previousHsCode}` }],
      authorizedSigners: [{ name: contactName, email }],
      sensitiveFieldsMasked: {},
      businessActivities: `Previous HS code: ${input.previousHsCode}`,
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

    const verification = await sendRegistrationCodes({
      userId: user._id,
      email,
      phone: input.phone,
      name: contactName,
    });

    try {
      await Promise.all([
        notifyBuyerRegistrationReceived({
          contactEmail: email,
          contactName,
          organizationName: input.legalName,
        }),
        notifyAdminNewBuyerRegistration({
          organizationName: input.legalName,
          contactName,
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
        devVerificationCode: verification.devEmailCode,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        status: "pending_verification",
        redirectTo: `/verify-email?email=${encodeURIComponent(email)}`,
        emailSent: verification.emailSent,
        emailFailure: verification.emailFailure?.code,
        message: verification.emailSent
          ? "Registration received. Enter the verification code sent to you on the next screen."
          : `Registration received, but the verification email could not be sent. ${verification.emailFailure?.message ?? ""} Use 'Send a new code' on the next screen once this is fixed, or contact support.`,
        devVerificationCode: verification.devEmailCode,
        devPhoneCode: verification.devPhoneCode,
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
