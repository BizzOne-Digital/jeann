import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import {
  runDocumentExtraction,
  runDocumentComparison,
  reviewAIExecution,
} from "@/lib/integrations/ai-execution-service";

export const runtime = "nodejs";

const extractSchema = z.object({
  documentVersionId: z.string(),
  documentType: z.string(),
  text: z.string().min(1).max(20000),
  transactionId: z.string().optional(),
});

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "ai:manage" });
    if ("error" in auth) return auth.error;
    const { AIExecution } = await import("@/models");
    const items = await AIExecution.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    return NextResponse.json({
      items: items.map((e) => ({
        id: String(e._id),
        capability: e.capability,
        model: e.model,
        humanReviewStatus: e.humanReviewStatus,
        providerAdapter: e.providerAdapter,
        createdAt: e.createdAt,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.action === "review") {
      const auth = await requireApiAuth({ permissions: "ai:manage" });
      if ("error" in auth) return auth.error;
      const execution = await reviewAIExecution({
        executionId: body.executionId,
        reviewerUserId: auth.sessionUserId,
        decision: body.decision,
        notes: body.notes,
      });
      return NextResponse.json({ id: String(execution._id), status: execution.humanReviewStatus });
    }

    if (body.action === "compare") {
      const auth = await requireApiAuth({ permissions: "ai:use" });
      if ("error" in auth) return auth.error;
      const { execution, result } = await runDocumentComparison({
        leftLabel: body.leftLabel,
        leftText: body.leftText,
        rightLabel: body.rightLabel,
        rightText: body.rightText,
        userId: auth.sessionUserId,
        transactionId: body.transactionId,
      });
      return NextResponse.json({
        executionId: String(execution._id),
        findings: result.data?.findings ?? [],
        disclaimer: result.disclaimer,
        status: result.status,
      });
    }

    const auth = await requireApiAuth({ permissions: "ai:use" });
    if ("error" in auth) return auth.error;
    const parsed = extractSchema.parse(body);
    const { execution, result } = await runDocumentExtraction({
      ...parsed,
      userId: auth.sessionUserId,
    });
    return NextResponse.json({
      executionId: String(execution._id),
      fields: result.data?.fields ?? [],
      disclaimer: result.disclaimer,
      status: result.status,
      humanReviewRequired: true,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "feature_disabled") {
      return NextResponse.json({ error: "AI feature is disabled." }, { status: 403 });
    }
    return handleApiError(error);
  }
}
