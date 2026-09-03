import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertBuyerTransactionAccess } from "@/lib/transactions/buyer-access";
import {
  createThreadWithMessage,
  listThreadsForOrganization,
} from "@/lib/messages/message-service";

export const runtime = "nodejs";

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:read" });
    if ("error" in auth) return auth.error;

    const access = await assertBuyerTransactionAccess(auth.ctx.userId);
    const items = await listThreadsForOrganization(access.organizationId, "external");
    return NextResponse.json({ items });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:read" });
    if ("error" in auth) return auth.error;

    const access = await assertBuyerTransactionAccess(auth.ctx.userId);
    let body: { subject?: string; message?: string; transactionId?: string };
    try {
      body = (await request.json()) as typeof body;
    } catch {
      return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
    }

    const subject = body.subject?.trim();
    const message = body.message?.trim();
    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required." }, { status: 422 });
    }

    const threadId = await createThreadWithMessage({
      organizationId: access.organizationId,
      authorUserId: auth.ctx.userId,
      subject,
      body: message,
      transactionId: body.transactionId,
    });

    if (!threadId) {
      return NextResponse.json({ error: "Unable to create message thread." }, { status: 503 });
    }

    return NextResponse.json({ ok: true, threadId });
  } catch (error) {
    return handleApiError(error);
  }
}
