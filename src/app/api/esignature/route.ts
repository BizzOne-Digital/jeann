import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import {
  createESignatureEnvelope,
  sendESignatureEnvelope,
} from "@/lib/integrations/esignature-service";

export const runtime = "nodejs";

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "documents:read" });
    if ("error" in auth) return auth.error;
    const { ESignatureEnvelope } = await import("@/models");
    const items = await ESignatureEnvelope.find().sort({ createdAt: -1 }).limit(50).lean();
    return NextResponse.json({
      items: items.map((e) => ({
        id: String(e._id),
        internalEnvelopeNumber: e.internalEnvelopeNumber,
        status: e.status,
        providerAdapter: e.providerAdapter,
        sentAt: e.sentAt,
        completedAt: e.completedAt,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const auth = await requireApiAuth({ permissions: "documents:write" });
    if ("error" in auth) return auth.error;

    if (body.action === "send") {
      const envelope = await sendESignatureEnvelope(body.envelopeId, auth.sessionUserId);
      return NextResponse.json({ id: String(envelope._id), status: envelope.status });
    }

    const envelope = await createESignatureEnvelope({
      documentVersionId: body.documentVersionId,
      transactionId: body.transactionId,
      recipients: body.recipients ?? [],
      actorUserId: auth.sessionUserId,
    });
    return NextResponse.json({ id: String(envelope._id), status: envelope.status });
  } catch (error) {
    if (error instanceof Error && error.message === "feature_disabled") {
      return NextResponse.json({ error: "E-signature is disabled." }, { status: 403 });
    }
    return handleApiError(error);
  }
}
