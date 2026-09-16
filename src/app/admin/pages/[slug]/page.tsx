import { notFound } from "next/navigation";
import { requirePortalAccess } from "@/lib/auth/portal-access";
import { getAdminPageForEditor } from "@/lib/content/page-content";
import { getRegistryPage } from "@/lib/content/page-registry";
import { PortalPage } from "@/components/portal/PortalPage";
import { AdminPageEditor } from "@/components/admin/AdminPageEditor";

export const dynamic = "force-dynamic";

export default async function AdminWebsitePageEditor({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requirePortalAccess("admin");
  const { slug } = await params;
  if (!getRegistryPage(slug)) notFound();

  const page = await getAdminPageForEditor(slug);
  if (!page) notFound();

  return (
    <PortalPage
      title={page.title}
      description={`Fields below match the live site at ${page.path}. Save with status Published to update the website.`}
    >
      <AdminPageEditor initialPage={page} />
    </PortalPage>
  );
}
