import { Types } from "mongoose";
import { writeAuditEvent } from "@/lib/audit/log";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { isFeatureEnabled } from "@/lib/integrations/feature-flags";
import { getScreeningProvider } from "@/lib/integrations/providers/screening-registry";

const QA_MARKER = "DEVELOPMENT TEST RESPONSE — NOT FROM A REAL PROVIDER";

export async function createScreeningCase(input: {
  organizationId: string;
  screeningType: "company" | "sanctions" | "pep" | "adverse_media" | "ongoing";
  organizationName: string;
  country?: string;
  actorUserId: string;
}) {
  const flag =
    input.screeningType === "sanctions"
      ? "sanctions_screening"
      : "company_screening";
  if (!(await isFeatureEnabled(flag))) throw new Error("feature_disabled");

  const provider = getScreeningProvider();
  const result = await provider.submitScreening({
    organizationName: input.organizationName,
    country: input.country,
    screeningType: input.screeningType,
  });

  if (!result.ok) throw new Error(result.errorSummary ?? "screening_failed");

  await tryConnectMongo();
  const { ScreeningCase, ScreeningMatch } = await import("@/models");

  const screeningCase = await ScreeningCase.create({
    organizationId: new Types.ObjectId(input.organizationId),
    providerAdapter: provider.adapterCode,
    screeningType: input.screeningType,
    providerRequestRef: result.requestRef,
    status: result.matches.length ? "match_found" : "pending_review",
    matchCount: result.matches.length,
    riskLevel: result.riskLevel,
    submittedByUserId: new Types.ObjectId(input.actorUserId),
    qaMarker: provider.adapterCode.includes("mock") ? QA_MARKER : undefined,
  });

  for (const m of result.matches) {
    await ScreeningMatch.create({
      screeningCaseId: screeningCase._id,
      providerMatchId: m.providerMatchId,
      matchType: m.matchType,
      matchedName: m.matchedName,
      matchScore: Types.Decimal128.fromString(m.matchScore),
      country: m.country,
      sourceListRef: m.sourceListRef,
      reviewStatus: "pending",
    });
  }

  await writeAuditEvent({
    action: "screening.case_created",
    targetType: "screening_case",
    targetId: String(screeningCase._id),
    actorUserId: input.actorUserId,
    result: "success",
  });

  return { screeningCase, result };
}

export async function reviewScreeningMatch(input: {
  matchId: string;
  reviewerUserId: string;
  reviewStatus: "false_positive" | "confirmed" | "further_review";
  resolutionReason?: string;
}) {
  await tryConnectMongo();
  const { ScreeningMatch, ScreeningCase } = await import("@/models");
  const match = await ScreeningMatch.findById(input.matchId);
  if (!match) throw new Error("not_found");

  match.reviewStatus = input.reviewStatus;
  match.reviewedByUserId = new Types.ObjectId(input.reviewerUserId);
  match.resolutionReason = input.resolutionReason;
  await match.save();

  const caseDoc = await ScreeningCase.findById(match.screeningCaseId);
  if (caseDoc) {
    caseDoc.reviewedByUserId = new Types.ObjectId(input.reviewerUserId);
    caseDoc.reviewDecision = input.reviewStatus;
    caseDoc.status = input.reviewStatus === "false_positive" ? "cleared" : "under_review";
    await caseDoc.save();
  }

  await writeAuditEvent({
    action: "screening.match_reviewed",
    targetType: "screening_match",
    targetId: String(match._id),
    actorUserId: input.reviewerUserId,
    result: "success",
    metadata: { reviewStatus: input.reviewStatus },
  });

  return match;
}
