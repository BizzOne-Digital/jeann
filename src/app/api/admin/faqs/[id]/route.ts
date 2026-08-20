import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { requireAdminApiSession } from "@/lib/admin/require-admin-api";
import { serializeFaq } from "@/lib/admin/faq-serializer";
import { adminFaqSchema } from "@/lib/admin/faq-validation";
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
    return NextResponse.json({ error: "Invalid FAQ id." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = adminFaqSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const { Faq } = await import("@/models");
    const doc = await Faq.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean();
    if (!doc) {
      return NextResponse.json({ error: "FAQ not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, item: serializeFaq(doc) });
  } catch (error) {
    console.error("[admin/faqs/:id PUT]", error);
    return NextResponse.json({ error: "Unable to update FAQ." }, { status: 500 });
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
    return NextResponse.json({ error: "Invalid FAQ id." }, { status: 400 });
  }

  try {
    const { Faq } = await import("@/models");
    const result = await Faq.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "FAQ not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/faqs/:id DELETE]", error);
    return NextResponse.json({ error: "Unable to delete FAQ." }, { status: 500 });
  }
}
