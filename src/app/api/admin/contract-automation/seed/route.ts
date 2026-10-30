import { NextResponse } from "next/server";
import { adminDeniedResponse, requireAdminApiSession } from "@/lib/admin/require-admin-api";
import { seedMissingDefaultTemplates } from "@/lib/contracts/template-service";

export const runtime = "nodejs";

export async function POST() {
  const session = await requireAdminApiSession();
  if (!session) return adminDeniedResponse();
  const result = await seedMissingDefaultTemplates(session.userId);
  return NextResponse.json({ ok: true, ...result });
}
