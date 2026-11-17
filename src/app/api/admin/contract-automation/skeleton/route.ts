import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminDeniedResponse, requireAdminApiSession } from "@/lib/admin/require-admin-api";
import { publishClientSkeleton } from "@/lib/contracts/template-service";

export const runtime = "nodejs";

const schema = z.object({ key: z.enum(["sco_buyer"]) });

/** Admin: publish the client's skeleton for a document as a new version. */
export async function POST(request: NextRequest) {
  const session = await requireAdminApiSession();
  if (!session) return adminDeniedResponse();
  const body = schema.safeParse(await request.json().catch(() => ({})));
  if (!body.success) return NextResponse.json({ error: "Unknown skeleton." }, { status: 422 });
  const result = await publishClientSkeleton(body.data.key, session.userId);
  return NextResponse.json({ ok: true, ...result });
}
