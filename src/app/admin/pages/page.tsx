import { requirePortalAccess } from "@/lib/auth/portal-access";
import { listEditablePages } from "@/lib/content/page-content";
import { tryConnectMongo, isMongoConfigured } from "@/lib/db/mongoose";
import { PortalPage } from "@/components/portal/PortalPage";
import { AdminPagesList } from "@/components/admin/AdminPagesList";

export const dynamic = "force-dynamic";

export default async function AdminWebsitePagesPage() {
  await requirePortalAccess("admin");
  const mongoConfigured = isMongoConfigured();
  const conn = mongoConfigured ? await tryConnectMongo() : null;
  const pages = await listEditablePages();

  return (
    <PortalPage
      title="Website Pages"
      description="Edit marketing page copy section by section (heroes, body text, CTAs, SEO). Status must be Published. Product rows: Admin → Products. Packaging types: Admin → Packaging. Payment tables: Admin → Payment Terms. Legal PDFs: Admin → Terms & Policies."
    >
      <div className="space-y-4">
        <p className="text-sm text-[var(--stone)]">
          Database:{" "}
          {conn
            ? "MongoDB connected — edits are saved to the database."
            : mongoConfigured
              ? "MongoDB URI set but unreachable — edits cannot be saved until connection is restored."
              : "Not configured — set MONGODB_URI and run npm run seed."}
        </p>
        {!conn ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            You can preview section fields from the default catalogue, but saving requires a working
            MongoDB connection.
          </p>
        ) : null}
        <AdminPagesList
          pages={pages.map((p) => ({
            slug: p.slug,
            title: p.title,
            path: p.path,
            status: p.status,
            sectionCount: p.sections.length,
            seoTitle: p.seoTitle,
          }))}
        />
        <p className="text-sm text-[var(--stone)]">
          Tip: open a page, edit each section, set status to <strong>Published</strong>, then save. Long
          lists use one line per bullet in the textarea. Dispute, logistics, inspections, verification,
          packaging, and resources now include full section lists — scroll the editor for every block.
        </p>
      </div>
    </PortalPage>
  );
}
