import { Types } from "mongoose";
import type { OrganizationOnboardingStatus } from "@/models/Organization";
import type { CisProfileStatus } from "@/models/CisProfile";

export type OnboardingStepKey =
  | "email_verification"
  | "phone_verification"
  | "terms_acceptance"
  | "cis_kyb"
  | "admin_review";

export type OnboardingStep = {
  key: OnboardingStepKey;
  label: string;
  complete: boolean;
  required: boolean;
};

export function buildOnboardingSteps(input: {
  emailVerified: boolean;
  phoneVerified: boolean;
  phoneRequired: boolean;
  termsAccepted: boolean;
  cisStatus?: CisProfileStatus;
  orgOnboardingStatus?: OrganizationOnboardingStatus;
  orgStatus?: string;
}): OnboardingStep[] {
  const cisComplete =
    input.cisStatus === "submitted" ||
    input.cisStatus === "under_review" ||
    input.cisStatus === "approved" ||
    input.cisStatus === "changes_requested" ||
    input.cisStatus === "resubmitted";

  return [
    {
      key: "email_verification",
      label: "Verify email",
      complete: input.emailVerified,
      required: true,
    },
    {
      key: "phone_verification",
      label: "Verify phone",
      complete: input.phoneVerified,
      required: input.phoneRequired,
    },
    {
      key: "terms_acceptance",
      label: "Accept required terms",
      complete: input.termsAccepted,
      required: true,
    },
    {
      key: "cis_kyb",
      label: "Complete CIS/KYB profile",
      complete: cisComplete,
      required: true,
    },
    {
      key: "admin_review",
      label: "Admin review and approval",
      complete: input.orgStatus === "verified" && input.orgOnboardingStatus === "approved",
      required: true,
    },
  ];
}

export function canAccessTradingFunctions(input: {
  orgStatus?: string;
  orgOnboardingStatus?: OrganizationOnboardingStatus;
  steps: OnboardingStep[];
}): boolean {
  if (input.orgStatus !== "verified") return false;
  if (input.orgOnboardingStatus !== "approved") return false;
  return input.steps.filter((s) => s.required).every((s) => s.complete);
}

export async function loadOnboardingStatusForUser(userId: string, organizationId: string) {
  const { User, CisProfile, TermsAcceptance, TermsDocument } = await import("@/models");
  const user = await User.findById(userId).lean();
  const org = await (await import("@/models")).Organization.findById(organizationId).lean();
  if (!user || !org) return null;

  const cis = await CisProfile.findOne({ organizationId: new Types.ObjectId(organizationId) })
    .sort({ version: -1 })
    .lean();

  const requiredTerms = await TermsDocument.find({
    requiresAcceptance: true,
    publishedAt: { $ne: null },
  }).lean();

  const acceptances = await TermsAcceptance.find({
    userId: new Types.ObjectId(userId),
    organizationId: new Types.ObjectId(organizationId),
  }).lean();

  const acceptedKeys = new Set(
    acceptances.map((a) => `${a.termsKey}:${a.termsVersion}`),
  );

  const termsComplete = requiredTerms.every((doc) =>
    acceptedKeys.has(`${doc.key}:${doc.version}`),
  );

  const { getEnv } = await import("@/lib/config/env");
  const phoneRequired = getEnv().REQUIRE_PHONE_OTP;

  const steps = buildOnboardingSteps({
    emailVerified: Boolean(user.emailVerifiedAt),
    phoneVerified: Boolean(user.phoneVerifiedAt),
    phoneRequired,
    termsAccepted: termsComplete,
    cisStatus: cis?.status,
    orgOnboardingStatus: org.onboardingStatus,
    orgStatus: org.status,
  });

  return {
    organization: {
      id: String(org._id),
      legalName: org.legalName,
      status: org.status,
      onboardingStatus: org.onboardingStatus,
      verificationNotes: org.verificationNotes,
    },
    cis: cis
      ? {
          version: cis.version,
          status: cis.status,
          reviewComments: cis.reviewComments,
          rejectionReason: cis.rejectionReason,
        }
      : null,
    steps,
    canTrade: canAccessTradingFunctions({
      orgStatus: org.status,
      orgOnboardingStatus: org.onboardingStatus,
      steps,
    }),
  };
}
