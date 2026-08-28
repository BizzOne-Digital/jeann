import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { askInternalAssistant } from "@/lib/integrations/internal-assistant-service";

export const runtime = "nodejs";

const schema = z.object({
  question: z.string().min(2).max(1000),
  transactionId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "ai:use" });
    if ("error" in auth) return auth.error;

    const parsed = schema.parse(await request.json());
    const result = await askInternalAssistant({
      userId: auth.sessionUserId,
      question: parsed.question,
      transactionId: parsed.transactionId,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "feature_disabled") {
      return NextResponse.json({ error: "Internal assistant is disabled." }, { status: 403 });
    }
    return handleApiError(error);
  }
}
