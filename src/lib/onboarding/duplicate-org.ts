import { Types } from "mongoose";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { normalizeCompanyName } from "@/lib/db/ids";
import type { OrganizationLean } from "@/models/Organization";

export type DuplicateCheckInput = {
  legalName: string;
  registrationNumber?: string;
  jurisdiction?: string;
  domain?: string;
  email?: string;
};

export type DuplicateCheckResult = {
  blockAutoCreate: boolean;
  duplicateReviewFlag: boolean;
  mergeReviewFlag: boolean;
  reasons: string[];
  matchedOrganizations: Array<{
    id: string;
    legalName: string;
    registrationNumber?: string;
    jurisdiction?: string;
    country: string;
  }>;
};

export async function checkDuplicateOrganization(
  input: DuplicateCheckInput,
): Promise<DuplicateCheckResult> {
  const reasons: string[] = [];
  const matched: OrganizationLean[] = [];

  if (!isMongoConfigured()) {
    return {
      blockAutoCreate: false,
      duplicateReviewFlag: false,
      mergeReviewFlag: false,
      reasons: [],
      matchedOrganizations: [],
    };
  }

  await tryConnectMongo();
  const { Organization } = await import("@/models");
  const normalized = normalizeCompanyName(input.legalName);

  if (input.registrationNumber && input.jurisdiction) {
    const exact = await Organization.findOne({
      registrationNumber: input.registrationNumber.trim(),
      jurisdiction: input.jurisdiction.trim(),
      deletedAt: null,
    }).lean();
    if (exact) {
      matched.push(exact);
      reasons.push("registration_number_jurisdiction_match");
    }
  }

  if (normalized) {
    const similar = await Organization.find({
      normalizedLegalName: normalized,
      deletedAt: null,
    }).lean();
    for (const org of similar) {
      if (!matched.some((m) => String(m._id) === String(org._id))) {
        matched.push(org);
        reasons.push("normalized_legal_name_match");
      }
    }
  }

  if (input.domain) {
    const domain = input.domain.toLowerCase().trim();
    const domainMatch = await Organization.findOne({
      domain,
      deletedAt: null,
    }).lean();
    if (domainMatch && !matched.some((m) => String(m._id) === String(domainMatch._id))) {
      matched.push(domainMatch);
      reasons.push("approved_domain_match");
    }
  }

  const blockAutoCreate = reasons.includes("registration_number_jurisdiction_match");
  const duplicateReviewFlag = matched.length > 0;
  const mergeReviewFlag = duplicateReviewFlag && !blockAutoCreate;

  return {
    blockAutoCreate,
    duplicateReviewFlag,
    mergeReviewFlag,
    reasons,
    matchedOrganizations: matched.map((org) => ({
      id: String(org._id),
      legalName: org.legalName,
      registrationNumber: org.registrationNumber,
      jurisdiction: org.jurisdiction,
      country: org.country,
    })),
  };
}

export async function assertOrganizationMembershipScope(
  userId: string,
  organizationId: string,
): Promise<boolean> {
  if (!Types.ObjectId.isValid(organizationId)) return false;
  if (!isMongoConfigured()) return false;
  await tryConnectMongo();
  const { OrganizationMembership } = await import("@/models");
  const membership = await OrganizationMembership.findOne({
    userId: new Types.ObjectId(userId),
    organizationId: new Types.ObjectId(organizationId),
    status: "active",
    deletedAt: null,
  }).lean();
  return Boolean(membership);
}
