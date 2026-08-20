import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin/require-admin-api";
import { serializeFaq } from "@/lib/admin/faq-serializer";
import { adminFaqSchema } from "@/lib/admin/faq-validation";
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
    const { Faq } = await import("@/models");
    const items = await Faq.find().sort({ displayOrder: 1, createdAt: 1 }).lean();
    return NextResponse.json({ items: items.map(serializeFaq) });
  } catch (error) {
    console.error("[admin/faqs GET]", error);
    return NextResponse.json({ error: "Unable to load FAQs." }, { status: 500 });
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

  const parsed = adminFaqSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const { Faq } = await import("@/models");
    const doc = await Faq.create(parsed.data);
    return NextResponse.json({ ok: true, item: serializeFaq(doc.toObject()) });
  } catch (error) {
    console.error("[admin/faqs POST]", error);
    return NextResponse.json({ error: "Unable to create FAQ." }, { status: 500 });
  }
}
