import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin/require-admin-api";
import {
  serializeSiteSettings,
  DEFAULT_SITE_SETTINGS,
} from "@/lib/admin/site-settings-serializer";
import {
  adminSiteSettingsSchema,
  siteSettingsInputToMongo,
} from "@/lib/admin/site-settings-validation";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { SITE_SETTINGS_KEY } from "@/models/SiteSettings";

export const runtime = "nodejs";

export async function GET() {
  if (!(await requireAdminApiSession())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!(await tryConnectMongo())) {
    return NextResponse.json({ error: "Service temporarily unavailable." }, { status: 503 });
  }

  try {
    const { SiteSettings } = await import("@/models");
    const doc = await SiteSettings.findOne({ key: SITE_SETTINGS_KEY }).lean();
    if (!doc) {
      return NextResponse.json({ settings: DEFAULT_SITE_SETTINGS, seeded: false });
    }
    return NextResponse.json({ settings: serializeSiteSettings(doc), seeded: true });
  } catch (error) {
    console.error("[admin/settings GET]", error);
    return NextResponse.json({ error: "Unable to load settings." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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

  const parsed = adminSiteSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const { SiteSettings } = await import("@/models");
    const doc = await SiteSettings.findOneAndUpdate(
      { key: SITE_SETTINGS_KEY },
      { $set: siteSettingsInputToMongo(parsed.data) },
      { upsert: true, new: true },
    ).lean();
    return NextResponse.json({ ok: true, settings: serializeSiteSettings(doc) });
  } catch (error) {
    console.error("[admin/settings PUT]", error);
    return NextResponse.json({ error: "Unable to save settings." }, { status: 500 });
  }
}
