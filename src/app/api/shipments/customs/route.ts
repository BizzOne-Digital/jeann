import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { upsertCustomsRecord } from "@/lib/shipments/customs-service";

export const runtime = "nodejs";

const schema = z.object({
  shipmentLotId: z.string(),
  country: z.string(),
  port: z.string().optional(),
  brokerAgent: z.string().optional(),
  declarationReference: z.string().optional(),
  submittedDate: z.string().optional(),
  currentStatus: z.string(),
  holdReason: z.string().optional(),
  requiredAction: z.string().optional(),
  releaseDate: z.string().optional(),
  dataSource: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "shipments:write" });
    if ("error" in auth) return auth.error;

    const body = schema.parse(await request.json());
    const record = await upsertCustomsRecord({
      ...body,
      actorUserId: auth.ctx.userId,
    });

    return NextResponse.json({
      id: String(record._id),
      currentStatus: record.currentStatus,
      dataSource: record.dataSource,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
