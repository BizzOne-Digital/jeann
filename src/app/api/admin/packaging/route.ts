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
  await tryConnectMongo();
  const { OrganizationMembership } = await import("@/models");
  const membership = await OrganizationMembership.findOne({
    userId: session.userId,
    status: "active",
    deletedAt: null,
    roles: { $in: ["ceo_super_admin", "general_manager"] },
  }).lean();
  return membership ? session : null;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await tryConnectMongo();
  const { PackagingType } = await import("@/models");
  const items = await PackagingType.find({ deletedAt: null }).sort({ displayOrder: 1 }).lean();
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const parsed = packagingSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 422 });
  }
  await tryConnectMongo();
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
}

export async function DELETE(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  await tryConnectMongo();
  const { PackagingType } = await import("@/models");
  await PackagingType.updateOne({ slug }, { $set: { status: "inactive", deletedAt: new Date() } });
  return NextResponse.json({ ok: true });
}
