import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin/require-admin-api";
import { serializeTeamMember } from "@/lib/admin/team-serializer";
import { adminTeamSchema } from "@/lib/admin/team-validation";
import { tryConnectMongo } from "@/lib/db/mongoose";

export const runtime = "nodejs";

export async function GET() {
  if (!(await requireAdminApiSession())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!(await tryConnectMongo())) {
    return NextResponse.json({ error: "Service temporarily unavailable." }, { status: 503 });
  }

  try {
    const { TeamMember } = await import("@/models");
    const items = await TeamMember.find().sort({ displayOrder: 1, name: 1 }).lean();
    return NextResponse.json({ items: items.map(serializeTeamMember) });
  } catch (error) {
    console.error("[admin/team GET]", error);
    return NextResponse.json({ error: "Unable to load team members." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await requireAdminApiSession())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!(await tryConnectMongo())) {
    return NextResponse.json({ error: "Service temporarily unavailable." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = adminTeamSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const { TeamMember } = await import("@/models");
    const doc = await TeamMember.create({
      ...parsed.data,
      bio: parsed.data.bio || undefined,
      photo: parsed.data.photo || undefined,
    });
    return NextResponse.json({ ok: true, item: serializeTeamMember(doc.toObject()) });
  } catch (error) {
    console.error("[admin/team POST]", error);
    return NextResponse.json({ error: "Unable to create team member." }, { status: 500 });
  }
}
