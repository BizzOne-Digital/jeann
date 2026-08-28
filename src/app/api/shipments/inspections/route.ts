import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { createInspectionRequest, reviewInspectionReport } from "@/lib/shipments/inspection-service";

export const runtime = "nodejs";

const createSchema = z.object({
  shipmentLotId: z.string(),
  inspectionType: z.string(),
  inspectionProvider: z.string(),
  inspectionLocation: z.string().optional(),
  requestedDate: z.string().optional(),
  scheduledDate: z.string().optional(),
  scope: z.string().optional(),
  requestedTests: z.array(z.string()).optional(),
});

const reviewSchema = z.object({
  action: z.literal("review"),
  inspectionId: z.string(),
  decision: z.enum(["accepted", "rejected"]),
  resultSummary: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.action === "review") {
      const auth = await requireApiAuth({ permissions: "documents:approve" });
      if ("error" in auth) return auth.error;
      const parsed = reviewSchema.parse(body);
      const record = await reviewInspectionReport({
        inspectionId: parsed.inspectionId,
        decision: parsed.decision,
        reviewerUserId: auth.ctx.userId,
        resultSummary: parsed.resultSummary,
      });
      return NextResponse.json({ id: String(record._id), status: record.status });
    }

    const auth = await requireApiAuth({ permissions: "shipments:write" });
    if ("error" in auth) return auth.error;
    const parsed = createSchema.parse(body);
    const record = await createInspectionRequest({
      ...parsed,
      actorUserId: auth.ctx.userId,
    });
    return NextResponse.json({ id: String(record._id), status: record.status });
  } catch (error) {
    return handleApiError(error);
  }
}
