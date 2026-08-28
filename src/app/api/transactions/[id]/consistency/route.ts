import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { validateTransactionConsistency } from "@/lib/transactions/consistency";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:read" });
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const result = await validateTransactionConsistency(id);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
