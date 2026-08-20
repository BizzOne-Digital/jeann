import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";

const packagingSchema = z.object({
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/),
  name: z.string().trim().min(2).max(120),
  mode: z.enum(["dry", "liquid", "unpackaged"]),
  description: z.string().trim().max(2000).optional(),
  advantages: z.array(z.string().trim().max(500)).max(20).default([]),
  displayOrder: z.number().int().min(0).optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

async function requireAdmin() {
  const session = await getSession();
  if (!session) return null;
  if (!isMongoConfigured()) return null;
  if (!(await tryConnectMongo())) return null;
  const { OrganizationMembership } = await import("@/models");
  const membership = await OrganizationMembership.findOne({
    userId: session.userId,
    status: "active",
    deletedAt: null,
    roles: { $in: ["ceo_super_admin", "general_manager"] },
  }).lean();
  return membership ? session : null;
}

function serviceUnavailable() {
  return NextResponse.json({ error: "Service temporarily unavailable." }, { status: 503 });
}

export async function GET() {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (!(await tryConnectMongo())) return serviceUnavailable();
    const { PackagingType } = await import("@/models");
    const items = await PackagingType.find({ deletedAt: null }).sort({ displayOrder: 1 }).lean();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("[admin/packaging GET]", error);
    return serviceUnavailable();
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const parsed = packagingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.flatten() },
        { status: 422 },
      );
    }
    if (!(await tryConnectMongo())) return serviceUnavailable();

    const { PackagingType } = await import("@/models");
    const input = parsed.data;
    const doc = await PackagingType.findOneAndUpdate(
      { slug: input.slug },
      {
        ...input,
        slug: input.slug.toLowerCase(),
        deletedAt: null,
      },
      { upsert: true, new: true },
    );
    return NextResponse.json({ ok: true, item: doc });
  } catch (error) {
    console.error("[admin/packaging POST]", error);
    return serviceUnavailable();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const slug = new URL(request.url).searchParams.get("slug");
    if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
    if (!(await tryConnectMongo())) return serviceUnavailable();

    const { PackagingType } = await import("@/models");
    await PackagingType.updateOne(
      { slug },
      { $set: { status: "inactive", deletedAt: new Date() } },
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/packaging DELETE]", error);
    return serviceUnavailable();
  }
}
