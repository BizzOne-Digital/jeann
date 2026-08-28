import { Types } from "mongoose";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { notifyAdmins, notifyUser } from "@/lib/notifications/service";
import type { CisProfileStatus } from "@/models/CisProfile";

const EDITABLE_STATUSES: CisProfileStatus[] = ["draft"];

export async function getLatestCisProfile(organizationId: string) {
  if (!isMongoConfigured()) return null;
  await tryConnectMongo();
  const { CisProfile } = await import("@/models");
  return CisProfile.findOne({
    organizationId: new Types.ObjectId(organizationId),
  })
    .sort({ version: -1 })
    .lean();
}

export async function getOrCreateDraftCis(organizationId: string) {
  await tryConnectMongo();
  const { CisProfile } = await import("@/models");
  const orgOid = new Types.ObjectId(organizationId);
  const latest = await CisProfile.findOne({ organizationId: orgOid }).sort({ version: -1 });

  if (latest?.status === "draft") {
    return latest;
  }

  if (latest?.status === "changes_requested") {
    const version = latest.version + 1;
    return CisProfile.create({
      organizationId: orgOid,
      version,
      status: "draft",
      legalName: latest.legalName,
      tradingName: latest.tradingName,
      registrationNumber: latest.registrationNumber,
      taxId: latest.taxId,
      incorporationDate: latest.incorporationDate,
      jurisdiction: latest.jurisdiction,
      businessType: latest.businessType,
      website: latest.website,
      representatives: latest.representatives,
      contacts: latest.contacts,
      addresses: latest.addresses,
      productInterests: latest.productInterests,
      authorizedSigners: latest.authorizedSigners,
      sensitiveFieldsMasked: latest.sensitiveFieldsMasked,
      businessActivities: latest.businessActivities,
    });
  }

  if (!latest) {
    return CisProfile.create({
      organizationId: orgOid,
      version: 1,
      status: "draft",
      legalName: "",
      representatives: [],
      contacts: [],
      addresses: [],
      productInterests: [],
      authorizedSigners: [],
      sensitiveFieldsMasked: {},
    });
  }

  throw new Error("cis_locked");
}

export async function updateCisDraft(
  organizationId: string,
  patch: Record<string, unknown>,
): Promise<void> {
  const draft = await getOrCreateDraftCis(organizationId);
  if (!EDITABLE_STATUSES.includes(draft.status)) {
    throw new Error("cis_locked");
  }

  const allowed = [
    "legalName",
    "tradingName",
    "registrationNumber",
    "taxId",
    "incorporationDate",
    "jurisdiction",
    "businessType",
    "website",
    "representatives",
    "contacts",
    "addresses",
    "productInterests",
    "authorizedSigners",
    "businessActivities",
    "sensitiveFieldsMasked",
  ];

  for (const key of allowed) {
    if (patch[key] !== undefined) {
      (draft as Record<string, unknown>)[key] = patch[key];
    }
  }

  await draft.save();
}

export async function submitCisProfile(input: {
  organizationId: string;
  userId: string;
}): Promise<{ version: number }> {
  await tryConnectMongo();
  const { CisProfile, Organization, KybDocument } = await import("@/models");

  const draft = await CisProfile.findOne({
    organizationId: new Types.ObjectId(input.organizationId),
  })
    .sort({ version: -1 });

  if (!draft || !EDITABLE_STATUSES.includes(draft.status)) {
    throw new Error("no_editable_cis");
  }

  if (!draft.legalName?.trim()) throw new Error("incomplete_cis");
  if (!draft.addresses?.length) throw new Error("incomplete_cis");

  const docCount = await KybDocument.countDocuments({
    organizationId: new Types.ObjectId(input.organizationId),
    cisProfileId: draft._id,
    deletedAt: null,
  });
  if (docCount === 0) throw new Error("documents_required");

  const wasChangesRequested = draft.status === "changes_requested";

  draft.status = wasChangesRequested ? "resubmitted" : "submitted";
  draft.submittedAt = new Date();
  draft.lockedAt = new Date();
  await draft.save();

  await Organization.updateOne(
    { _id: input.organizationId },
    { $set: { onboardingStatus: "cis_kyb_submitted" } },
  );

  const org = await Organization.findById(input.organizationId).lean();

  await notifyUser({
    userId: input.userId,
    organizationId: input.organizationId,
    type: "cis_submitted",
    title: "CIS/KYB submitted",
    body: "Your CIS/KYB application has been submitted for review.",
    href: "/portal/buyer/onboarding",
  });

  await notifyAdmins({
    type: "cis_submitted",
    title: "CIS/KYB submission",
    body: `${org?.legalName ?? "An organization"} submitted CIS/KYB for review.`,
    href: `/admin/organizations`,
    emailSubject: "CIS/KYB submission pending review",
    emailText: `${org?.legalName ?? "An organization"} submitted CIS/KYB for review.`,
  });

  return { version: draft.version };
}

export async function reviewCisProfile(input: {
  organizationId: string;
  cisProfileId: string;
  actorUserId: string;
  action: "approve" | "reject" | "request_changes" | "start_review";
  comment?: string;
  reason?: string;
}): Promise<void> {
  await tryConnectMongo();
  const { CisProfile, Organization } = await import("@/models");

  const cis = await CisProfile.findOne({
    _id: input.cisProfileId,
    organizationId: new Types.ObjectId(input.organizationId),
  });
  if (!cis) throw new Error("cis_not_found");

  const org = await Organization.findById(input.organizationId);
  if (!org) throw new Error("org_not_found");

  const actorId = new Types.ObjectId(input.actorUserId);
  const now = new Date();

  switch (input.action) {
    case "start_review":
      if (
        cis.status === "submitted" ||
        cis.status === "resubmitted"
      ) {
        cis.status = "under_review";
        cis.reviewedByUserId = actorId;
        cis.reviewedAt = now;
        org.onboardingStatus = "under_review";
      }
      break;
    case "request_changes":
      if (!input.comment?.trim()) throw new Error("comment_required");
      cis.status = "changes_requested";
      cis.reviewComments = input.comment;
      cis.reviewedByUserId = actorId;
      cis.reviewedAt = now;
      org.onboardingStatus = "changes_requested";
      org.verificationNotes = input.comment;
      break;
    case "reject":
      if (!input.reason?.trim()) throw new Error("reason_required");
      cis.status = "rejected";
      cis.rejectionReason = input.reason;
      cis.reviewedByUserId = actorId;
      cis.reviewedAt = now;
      org.status = "rejected";
      org.onboardingStatus = "rejected";
      org.verificationNotes = input.reason;
      break;
    case "approve":
      if (!input.comment?.trim()) throw new Error("comment_required");
      cis.status = "approved";
      cis.reviewComments = input.comment;
      cis.reviewedByUserId = actorId;
      cis.reviewedAt = now;
      cis.approvedAt = now;
      org.status = "verified";
      org.onboardingStatus = "approved";
      org.approvedByUserId = actorId;
      org.approvedAt = now;
      org.verificationNotes = input.comment;
      break;
    default:
      throw new Error("invalid_action");
  }

  await cis.save();
  await org.save();
}

export async function listCisVersions(organizationId: string) {
  await tryConnectMongo();
  const { CisProfile } = await import("@/models");
  return CisProfile.find({ organizationId: new Types.ObjectId(organizationId) })
    .sort({ version: -1 })
    .select("version status submittedAt reviewedAt approvedAt reviewComments rejectionReason")
    .lean();
}
