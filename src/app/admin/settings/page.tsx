import { requirePortalAccess } from "@/lib/auth/portal-access";
import {
  DEFAULT_SITE_SETTINGS,
  serializeSiteSettings,
} from "@/lib/admin/site-settings-serializer";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { PortalPage } from "@/components/portal/PortalPage";
import { AdminSettingsEditor } from "@/components/admin/AdminSettingsEditor";
import { SITE_SETTINGS_KEY } from "@/models/SiteSettings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await requirePortalAccess("admin");
  const mongoConfigured = isMongoConfigured();
  const conn = mongoConfigured ? await tryConnectMongo() : null;

  let settings = DEFAULT_SITE_SETTINGS;
  let loadedFromDb = false;

  if (conn) {
    const { SiteSettings } = await import("@/models");
    const doc = await SiteSettings.findOne({ key: SITE_SETTINGS_KEY }).lean();
    if (doc) {
      settings = serializeSiteSettings(doc);
      loadedFromDb = true;
    }
  }

  return (
    <PortalPage
      title="Global Settings"
      description="Company contact, feature flags, locales, and SEO defaults stored in MongoDB."
    >
      <div className="space-y-4">
        <p className="text-sm text-[var(--stone)]">
          Database:{" "}
          {conn
            ? loadedFromDb
              ? "Site settings loaded from MongoDB."
              : "Connected — no saved settings yet. Save below or run npm run seed."
            : mongoConfigured
              ? "MongoDB URI set but unreachable."
              : "Not configured — set MONGODB_URI and run npm run seed."}
        </p>
        {!conn ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Settings cannot be saved without a working MongoDB connection.
          </p>
        ) : null}
        <AdminSettingsEditor initialSettings={settings} />
      </div>
    </PortalPage>
  );
}
