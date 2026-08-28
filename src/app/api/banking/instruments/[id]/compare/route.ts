import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertBankingInstrumentAccess } from "@/lib/banking/access";
import { compareInstrumentWithContract } from "@/lib/banking/consistency";

export const runtime = "nodejs";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "banking:review" });
    if ("error" in auth) return auth.error;

    const { id } = await params;
    await assertBankingInstrumentAccess(auth.ctx.userId, id);
    const result = await compareInstrumentWithContract(id);

    return NextResponse.json({
      blocking: result.blocking,
      warnings: result.warnings,
      disclaimer:
        "Deterministic comparison only. Not bank-approved. Corrections require amendment or authorized external action.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
