import { NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { getSecurityDashboardSummary } from "@/lib/security/security-service";
import { validateProductionEnvironment } from "@/lib/security/production-guards";

export const runtime = "nodejs";

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "security:read" });
    if ("error" in auth) return auth.error;

    const summary = await getSecurityDashboardSummary();
    const prodValidation = validateProductionEnvironment();

    return NextResponse.json({
      summary,
      productionValidation: prodValidation,
      environment: process.env.NODE_ENV ?? "development",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
