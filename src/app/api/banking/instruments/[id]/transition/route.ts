import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertBankingInstrumentAccess } from "@/lib/banking/access";
import { transitionBankingInstrument } from "@/lib/banking/instrument-service";
import type { BankingInstrumentLifecycleStatus } from "@/models/BankingInstrument";

export const runtime = "nodejs";

const schema = z.object({
  toStatus: z.string(),
  reason: z.string().optional(),
  evidence: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "banking:review" });
    if ("error" in auth) return auth.error;

    const { id } = await params;
    await assertBankingInstrumentAccess(auth.ctx.userId, id);
    const body = schema.parse(await request.json());

    const instrument = await transitionBankingInstrument({
      instrumentId: id,
      toStatus: body.toStatus as BankingInstrumentLifecycleStatus,
      actorUserId: auth.ctx.userId,
      permissions: auth.ctx.permissions,
      reason: body.reason,
      evidence: body.evidence,
    });

    return NextResponse.json({ ok: true, currentStatus: instrument.currentStatus });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "invalid_transition") {
        return NextResponse.json({ error: "Invalid transition." }, { status: 409 });
      }
      if (error.message === "forbidden") {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
    }
    return handleApiError(error);
  }
}
