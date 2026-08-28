import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { processESignatureWebhook } from "@/lib/integrations/esignature-service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-signature") ?? request.headers.get("x-hub-signature-256");
    const payload = await request.text();
    const correlationId = request.headers.get("x-correlation-id") ?? nanoid();

    const result = await processESignatureWebhook(payload, signature ?? undefined, correlationId);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    if (error instanceof Error && error.message === "invalid_signature") {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 400 });
  }
}
