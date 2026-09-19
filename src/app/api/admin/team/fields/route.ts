import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin/require-admin-api";
import { teamFieldKeyFromLabel } from "@/lib/admin/team-field-key";
import { serializeTeamFieldDefinition } from "@/lib/admin/team-serializer";
import { adminTeamFieldSchema } from "@/lib/admin/team-validation";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { revalidateMarketingPath } from "@/lib/content/revalidate-marketing";

export const runtime = "nodejs";

export async function GET() {
  if (!(await requireAdminApiSession())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!(await tryConnectMongo())) {
    return NextResponse.json({ error: "Service temporarily unavailable." }, { status: 503 });
  }

  try {
    const { TeamMemberFieldDefinition } = await import("@/models");
    const defs = await TeamMemberFieldDefinition.find().sort({ displayOrder: 1, label: 1 }).lean();
    return NextResponse.json({ fields: defs.map(serializeTeamFieldDefinition) });
  } catch (error) {
    console.error("[admin/team/fields GET]", error);
    return NextResponse.json({ error: "Unable to load team fields." }, { status: 500 });
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

  const parsed = adminTeamFieldSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const key = teamFieldKeyFromLabel(parsed.data.label);

  try {
    const { TeamMemberFieldDefinition } = await import("@/models");
    const count = await TeamMemberFieldDefinition.countDocuments();
    const doc = await TeamMemberFieldDefinition.create({
      key,
      label: parsed.data.label.trim(),
      displayOrder: count,
    });
    revalidateMarketingPath("/team");
    return NextResponse.json({ ok: true, field: serializeTeamFieldDefinition(doc.toObject()) });
  } catch (error) {
    const code = (error as { code?: number }).code;
    if (code === 11000) {
      return NextResponse.json({ error: "A field with this name already exists." }, { status: 409 });
    }
    console.error("[admin/team/fields POST]", error);
    return NextResponse.json({ error: "Unable to create field." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await requireAdminApiSession())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!(await tryConnectMongo())) {
    return NextResponse.json({ error: "Service temporarily unavailable." }, { status: 503 });
  }

  const key = request.nextUrl.searchParams.get("key")?.trim().toLowerCase();
  if (!key) {
    return NextResponse.json({ error: "Field key is required." }, { status: 400 });
  }

  try {
    const { TeamMember, TeamMemberFieldDefinition } = await import("@/models");
    const removed = await TeamMemberFieldDefinition.deleteOne({ key });
    if (removed.deletedCount === 0) {
      return NextResponse.json({ error: "Field not found." }, { status: 404 });
    }
    await TeamMember.updateMany({}, { $unset: { [`customFields.${key}`]: "" } });
    revalidateMarketingPath("/team");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/team/fields DELETE]", error);
    return NextResponse.json({ error: "Unable to delete field." }, { status: 500 });
  }
}
