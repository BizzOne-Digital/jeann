import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin/require-admin-api";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { z } from "zod";

export const runtime = "nodejs";

const blogSchema = z.object({
  slug: z.string().trim().min(2).max(120),
  title: z.string().trim().min(2).max(240),
  excerpt: z.string().trim().max(500).optional(),
  body: z.string().trim().min(10),
  authorName: z.string().trim().min(2).max(120),
  categories: z.array(z.string()).default([]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  coverImage: z.string().optional(),
});

export async function GET() {
  if (!(await requireAdminApiSession())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!(await tryConnectMongo())) {
    return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
  }

  const { BlogPost } = await import("@/models");
  const items = await BlogPost.find().sort({ updatedAt: -1 }).lean();
  return NextResponse.json({
    items: items.map((doc) => ({
      id: String(doc._id),
      slug: doc.slug,
      title: doc.title,
      excerpt: doc.excerpt ?? "",
      status: doc.status,
      authorName: doc.authorName,
      publishedAt: doc.publishedAt,
      updatedAt: doc.updatedAt,
    })),
  });
}

export async function POST(request: NextRequest) {
  if (!(await requireAdminApiSession())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!(await tryConnectMongo())) {
    return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = blogSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 422 });
  }

  const { BlogPost } = await import("@/models");
  const doc = await BlogPost.create({
    ...parsed.data,
    slug: parsed.data.slug.toLowerCase(),
    publishedAt: parsed.data.status === "published" ? new Date() : undefined,
    locale: "en",
  });

  return NextResponse.json({ ok: true, id: String(doc._id) });
}
