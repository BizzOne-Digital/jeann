import { requirePortalAccess } from "@/lib/auth/portal-access";
import { PortalPage } from "@/components/portal/PortalPage";
import { AdminInvitationsManager } from "@/components/admin/AdminInvitationsManager";

export const dynamic = "force-dynamic";

export default async function AdminInvitationsPage() {
  await requirePortalAccess("admin");

  return (
    <PortalPage
      title="Invitations"
      description="Invite buyers, suppliers, banking advisers, and internal staff. Pending supplier offers can be linked when the organization is created on accept."
    >
      <AdminInvitationsManager />
    </PortalPage>
  );
}
