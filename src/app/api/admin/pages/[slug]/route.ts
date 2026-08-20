import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApiSession } from "@/lib/admin/require-admin-api";
import { getEditablePage, saveEditablePage } from "@/lib/content/page-content";

export const runtime = "nodejs";

const saveSchema = z.object({
  title: z.string().trim().min(1).max(200),
  seoTitle: z.string().trim().max(200),
  seoDescription: z.string().trim().max(500),
  status: z.enum(["draft", "published", "archived"]),
  sections: z.array(
    z.object({
      id: z.string().min(1),
      fields: z.record(z.string(), z.string()),
    }),
  ),
});

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  if (!(await requireAdminApiSession())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { slug } = await context.params;
  try {
    const page = await getEditablePage(slug);
    if (!page) return NextResponse.json({ error: "Page not found." }, { status: 404 });
    return NextResponse.json({ page });
  } catch (error) {
    console.error("[admin/pages/:slug GET]", error);
    return NextResponse.json({ error: "Unable to load page." }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  if (!(await requireAdminApiSession())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { slug } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = saveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input.", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const page = await saveEditablePage({ slug, ...parsed.data });
    if (!page) return NextResponse.json({ error: "Page not found." }, { status: 404 });
    return NextResponse.json({ ok: true, page });
  } catch (error) {
    console.error("[admin/pages/:slug PUT]", error);
    return NextResponse.json(
      { error: "Unable to save page. Check MongoDB connection." },
      { status: 503 },
    );
  }
}
