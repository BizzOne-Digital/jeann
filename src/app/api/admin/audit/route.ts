import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "audit:read" });
    if ("error" in auth) return auth.error;

    const { AuditEvent } = await import("@/models");
    const limit = Math.min(Number(request.nextUrl.searchParams.get("limit") ?? 100), 500);
    const action = request.nextUrl.searchParams.get("action");
    const actorUserId = request.nextUrl.searchParams.get("userId");
    const organizationId = request.nextUrl.searchParams.get("organizationId");

    const filter: Record<string, unknown> = {};
    if (action) filter.action = action;
    if (actorUserId) filter.actorUserId = actorUserId;
    if (organizationId) filter.organizationId = organizationId;

    const items = await AuditEvent.find(filter).sort({ createdAt: -1 }).limit(limit).lean();

    return NextResponse.json({
      items: items.map((e) => ({
        id: String(e._id),
        action: e.action,
        targetType: e.targetType,
        targetId: e.targetId ? String(e.targetId) : null,
        actorUserId: e.actorUserId ? String(e.actorUserId) : null,
        organizationId: e.organizationId ? String(e.organizationId) : null,
        result: e.result,
        failureReason: e.failureReason,
        metadata: e.metadata,
        createdAt: e.createdAt,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
