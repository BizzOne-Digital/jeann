import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { SecurityEvent } from "@/models/SecurityEvent";
import { connectMongo } from "@/lib/db/mongoose";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "security:read" });
    if ("error" in auth) return auth.error;

    await connectMongo();
    const limit = Math.min(Number(request.nextUrl.searchParams.get("limit") ?? 50), 100);
    const severity = request.nextUrl.searchParams.get("severity");
    const filter: Record<string, unknown> = {};
    if (severity) filter.severity = severity;

    const events = await SecurityEvent.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      events: events.map((e) => ({
        id: String(e._id),
        eventType: e.eventType,
        severity: e.severity,
        result: e.result,
        userId: e.userId ? String(e.userId) : null,
        organizationId: e.organizationId ? String(e.organizationId) : null,
        targetType: e.targetType,
        targetId: e.targetId,
        reviewed: e.reviewed,
        createdAt: e.createdAt?.toISOString(),
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
