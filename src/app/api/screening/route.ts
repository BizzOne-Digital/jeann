import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import {
  createScreeningCase,
  reviewScreeningMatch,
} from "@/lib/integrations/screening-service";

export const runtime = "nodejs";

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "orgs:verify" });
    if ("error" in auth) return auth.error;

    const { ScreeningCase, ScreeningMatch } = await import("@/models");
    const cases = await ScreeningCase.find().sort({ createdAt: -1 }).limit(50).lean();
    return NextResponse.json({
      items: cases.map((c) => ({
        id: String(c._id),
        screeningType: c.screeningType,
        status: c.status,
        matchCount: c.matchCount,
        riskLevel: c.riskLevel,
      })),
      matchCount: await ScreeningMatch.countDocuments(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const auth = await requireApiAuth({ permissions: "orgs:verify" });
    if ("error" in auth) return auth.error;

    if (body.action === "review_match") {
      const match = await reviewScreeningMatch({
        matchId: body.matchId,
        reviewerUserId: auth.sessionUserId,
        reviewStatus: body.reviewStatus,
        resolutionReason: body.resolutionReason,
      });
      return NextResponse.json({ id: String(match._id), reviewStatus: match.reviewStatus });
    }

    const { screeningCase } = await createScreeningCase({
      organizationId: body.organizationId,
      screeningType: body.screeningType ?? "company",
      organizationName: body.organizationName,
      country: body.country,
      actorUserId: auth.sessionUserId,
    });

    return NextResponse.json({
      id: String(screeningCase._id),
      status: screeningCase.status,
      matchCount: screeningCase.matchCount,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "feature_disabled") {
      return NextResponse.json({ error: "Screening is disabled." }, { status: 403 });
    }
    return handleApiError(error);
  }
}
