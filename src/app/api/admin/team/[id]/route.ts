import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { requireAdminApiSession } from "@/lib/admin/require-admin-api";
import { serializeTeamMember } from "@/lib/admin/team-serializer";
import { adminTeamSchema } from "@/lib/admin/team-validation";
import { tryConnectMongo } from "@/lib/db/mongoose";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  if (!(await requireAdminApiSession())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!(await tryConnectMongo())) {
    return NextResponse.json({ error: "Service temporarily unavailable." }, { status: 503 });
  }

  const { id } = await context.params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid team member id." }, { status: 400 });
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
    const doc = await TeamMember.findByIdAndUpdate(
      id,
      {
        $set: {
          ...parsed.data,
          bio: parsed.data.bio || undefined,
          photo: parsed.data.photo || undefined,
        },
      },
      { new: true },
    ).lean();

    if (!doc) {
      return NextResponse.json({ error: "Team member not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, item: serializeTeamMember(doc) });
  } catch (error) {
    console.error("[admin/team/:id PUT]", error);
    return NextResponse.json({ error: "Unable to update team member." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  if (!(await requireAdminApiSession())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!(await tryConnectMongo())) {
    return NextResponse.json({ error: "Service temporarily unavailable." }, { status: 503 });
  }

  const { id } = await context.params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid team member id." }, { status: 400 });
  }

  try {
    const { TeamMember } = await import("@/models");
    const result = await TeamMember.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Team member not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/team/:id DELETE]", error);
    return NextResponse.json({ error: "Unable to delete team member." }, { status: 500 });
  }
}
