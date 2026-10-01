import type { Types } from "mongoose";
import { normalizeCompanyName } from "@/lib/db/ids";

const CAREER_POOL_LEGAL_NAME = "Finekarts Career Applicant Pool";

/** Shared internal org for career portal accounts (role: career_applicant). */
export async function getOrCreateCareerApplicantOrganization(): Promise<Types.ObjectId> {
  const { Organization } = await import("@/models");
  const normalizedLegalName = normalizeCompanyName(CAREER_POOL_LEGAL_NAME);
  const existing = await Organization.findOne({
    normalizedLegalName,
    type: "internal",
    deletedAt: null,
  })
    .select("_id")
    .lean();
  if (existing) return existing._id;

  const created = await Organization.create({
    type: "internal",
    legalName: CAREER_POOL_LEGAL_NAME,
    normalizedLegalName,
    country: "CA",
    status: "verified",
    onboardingStatus: "approved",
    mergeReviewFlag: false,
    duplicateReviewFlag: false,
  });
  return created._id;
}
