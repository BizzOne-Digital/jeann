import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { completeStaffStep } from "@/lib/transactions/step-service";

export const runtime = "nodejs";

const schema = z.object({
  action: z.enum(["complete", "skip"]),
  reason: z.string().trim().max(1000).optional(),
});

/** Staff complete (or skip, with a reason) a step that no single document completes, for example the verification of CIS, RWA and FIS. */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string; stepKey: string }> }) {
  try {
    const auth = await requireApiAuth({ permissions: "documents:write" });
    if ("error" in auth) return auth.error;
    if (!auth.ctx.isInternal) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    const { id, stepKey } = await params;
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 422 });
    const result = await completeStaffStep({
      transactionId: id,
      stepKey,
      action: parsed.data.action,
      reason: parsed.data.reason,
      actorUserId: auth.ctx.userId,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return handleApiError(error);
  }
}
