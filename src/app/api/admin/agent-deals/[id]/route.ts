import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { z } from "zod";
import { adminDeniedResponse, requireAdminApiSession } from "@/lib/admin/require-admin-api";
import { writeAuditEvent } from "@/lib/audit/log";
import { AGENT_DEAL_STATUSES } from "@/models/AgentDeal";

export const runtime = "nodejs";

const schema = z.object({
  status: z.enum(AGENT_DEAL_STATUSES),
  staffNotes: z.string().trim().max(4000).optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminApiSession();
  if (!session) return adminDeniedResponse();
  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input." }, { status: 422 });

  const { AgentDeal } = await import("@/models");
  const update: Record<string, unknown> = { status: parsed.data.status };
  if (parsed.data.staffNotes !== undefined) update.staffNotes = parsed.data.staffNotes;
  const doc = await AgentDeal.findByIdAndUpdate(id, { $set: update }, { new: true }).select("reference status").lean();
  if (!doc) return NextResponse.json({ error: "Not found." }, { status: 404 });

  await writeAuditEvent({
    action: "agent_deal.status_changed",
    targetType: "agent_deal",
    targetId: id,
    actorUserId: session.userId,
    metadata: { status: parsed.data.status },
  });
  return NextResponse.json({ ok: true, status: doc.status });
}
