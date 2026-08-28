import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { getAccountingProvider, syncEntityToAccounting } from "@/lib/finance/accounting-provider";

export const runtime = "nodejs";

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "finance:read" });
    if ("error" in auth) return auth.error;

    const provider = getAccountingProvider();
    const connection = await provider.testConnection();
    const { AccountingSyncRecord } = await import("@/models");
    const recent = await AccountingSyncRecord.find()
      .sort({ updatedAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({
      connection,
      configured: process.env.ACCOUNTING_PROVIDER_CONFIGURED === "true",
      recentSyncs: recent.map((r) => ({
        entityType: r.entityType,
        internalEntityId: r.internalEntityId,
        status: r.status,
        lastAttemptAt: r.lastAttemptAt,
        errorSummary: r.errorSummary,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "finance:write" });
    if ("error" in auth) return auth.error;

    const body = await request.json();
    if (body.action === "test_connection") {
      const provider = getAccountingProvider();
      const result = await provider.testConnection();
      return NextResponse.json(result);
    }

    if (body.action === "sync" && body.entityType && body.internalId) {
      const result = await syncEntityToAccounting(
        body.entityType as "invoice" | "bill" | "payment" | "customer" | "vendor" | "credit_note",
        body.internalId,
      );
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    return handleApiError(error);
  }
}
