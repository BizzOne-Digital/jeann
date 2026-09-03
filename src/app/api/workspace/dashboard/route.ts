import { NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { getWorkspaceDashboardStats } from "@/lib/workspace/dashboard-service";

export const runtime = "nodejs";

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:read" });
    if ("error" in auth) return auth.error;
    if (!auth.ctx.isInternal) {
      return NextResponse.json({ error: "Workspace access required." }, { status: 403 });
    }

    const stats = await getWorkspaceDashboardStats();
    if (!stats) {
      return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
    }

    return NextResponse.json(stats);
  } catch (error) {
    return handleApiError(error);
  }
}
