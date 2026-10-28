import { NextResponse } from "next/server";
import { adminDeniedResponse, requireAdminApiSession } from "@/lib/admin/require-admin-api";
import { listEditablePages } from "@/lib/content/page-content";

export const runtime = "nodejs";

export async function GET() {
  if (!(await requireAdminApiSession())) {
    return adminDeniedResponse();
  }
  try {
    const pages = await listEditablePages();
    return NextResponse.json({
      pages: pages.map((p) => ({
        slug: p.slug,
        title: p.title,
        path: p.path,
        status: p.status,
        sectionCount: p.sections.length,
        seoTitle: p.seoTitle,
      })),
    });
  } catch (error) {
    console.error("[admin/pages GET]", error);
    return NextResponse.json({ error: "Unable to load pages." }, { status: 500 });
  }
}
