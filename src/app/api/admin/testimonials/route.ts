import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin/require-admin-api";
import { serializeTestimonial } from "@/lib/admin/testimonial-serializer";
import {
  adminTestimonialSchema,
} from "@/lib/admin/testimonial-validation";
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
    const { Testimonial } = await import("@/models");
    const items = await Testimonial.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ items: items.map(serializeTestimonial) });
  } catch (error) {
    console.error("[admin/testimonials GET]", error);
    return NextResponse.json({ error: "Unable to load testimonials." }, { status: 500 });
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

  const parsed = adminTestimonialSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const { Testimonial } = await import("@/models");
    const doc = await Testimonial.create({
      quote: parsed.data.quote,
      attribution: parsed.data.attribution,
      company: parsed.data.company || undefined,
      status: parsed.data.status,
      isPlaceholder: false,
    });
    return NextResponse.json({ ok: true, item: serializeTestimonial(doc.toObject()) });
  } catch (error) {
    console.error("[admin/testimonials POST]", error);
    return NextResponse.json({ error: "Unable to create testimonial." }, { status: 500 });
  }
}
