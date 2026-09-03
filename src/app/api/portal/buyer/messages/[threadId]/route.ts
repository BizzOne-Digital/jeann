import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertBuyerTransactionAccess } from "@/lib/transactions/buyer-access";
import { getThreadMessages, replyToThread } from "@/lib/messages/message-service";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:read" });
    if ("error" in auth) return auth.error;

    const access = await assertBuyerTransactionAccess(auth.ctx.userId);
    const { threadId } = await params;
    const thread = await getThreadMessages(threadId, access.organizationId);
    if (!thread) {
      return NextResponse.json({ error: "Thread not found." }, { status: 404 });
    }

    return NextResponse.json(thread);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:read" });
    if ("error" in auth) return auth.error;

    const access = await assertBuyerTransactionAccess(auth.ctx.userId);
    const { threadId } = await params;
    let body: { message?: string };
    try {
      body = (await request.json()) as typeof body;
    } catch {
      return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
    }

    const message = body.message?.trim();
    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 422 });
    }

    const ok = await replyToThread({
      threadId,
      organizationId: access.organizationId,
      authorUserId: auth.ctx.userId,
      body: message,
    });

    if (!ok) {
      return NextResponse.json({ error: "Unable to send message." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
