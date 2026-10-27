import { requirePortalAccess } from "@/lib/auth/portal-access";
import { PortalPage } from "@/components/portal/PortalPage";
import { AdminStepTemplatesManager } from "@/components/admin/AdminStepTemplatesManager";

export const dynamic = "force-dynamic";

export default async function AdminStepTemplatesPage() {
  await requirePortalAccess("admin");
  return (
    <PortalPage
      title="Step templates"
      description="Add, edit or remove the pre-built documents and workflow steps used on the buyer and supplier portals. Each save creates a new version."
    >
      <AdminStepTemplatesManager />
    </PortalPage>
  );
}
