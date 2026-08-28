import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { loadOnboardingStatusForUser } from "@/lib/onboarding/status";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth();
    if ("error" in auth) return auth.error;

    const orgId =
      request.nextUrl.searchParams.get("organizationId") ??
      auth.ctx.memberships.find((m) => m.status === "active")?.organizationId;

    if (!orgId) {
      return NextResponse.json({ error: "No organization context." }, { status: 400 });
    }

    const membership = auth.ctx.memberships.find((m) => m.organizationId === orgId);
    if (!membership && !auth.ctx.isInternal) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const status = await loadOnboardingStatusForUser(auth.ctx.userId, orgId);
    if (!status) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    return NextResponse.json(status);
  } catch (error) {
    return handleApiError(error);
  }
}
