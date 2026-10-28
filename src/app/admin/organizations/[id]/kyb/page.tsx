import { notFound } from "next/navigation";
import { Types } from "mongoose";
import { requirePortalAccess } from "@/lib/auth/portal-access";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { loadStaffKybView } from "@/lib/kyb/kyb-service";
import { PortalPage } from "@/components/portal/PortalPage";
import { AdminKybPanel } from "@/components/admin/AdminKybPanel";

export const dynamic = "force-dynamic";

/** Staff-only KYB checklist and validation for any organization (used for suppliers). */
export default async function AdminOrganizationKybPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePortalAccess("admin");
  const { id } = await params;
  if (!Types.ObjectId.isValid(id) || !(await tryConnectMongo())) notFound();
  const view = await loadStaffKybView(id);
  if (!view.organization) notFound();
  return (
    <PortalPage
      title="KYB and validation"
      description={`${view.organization.legalName} (${view.organization.type}). Staff only.`}
    >
      <AdminKybPanel organizationId={id} initial={JSON.parse(JSON.stringify(view))} />
    </PortalPage>
  );
}
