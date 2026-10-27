import { requirePortalAccess } from "@/lib/auth/portal-access";
import { PortalPage } from "@/components/portal/PortalPage";
import { AdminTradeAlertEditor } from "@/components/admin/AdminTradeAlertEditor";
import { getTradeAlert } from "@/lib/content/trade-alert-store";

export const dynamic = "force-dynamic";

export default async function AdminTradeAlertPage() {
  await requirePortalAccess("admin");
  const tradeAlert = await getTradeAlert();

  return (
    <PortalPage
      title="Trade Alert"
      description="Internal market reference ticker for back-office use. Edit the lines below; it is not shown on the public website."
    >
      <AdminTradeAlertEditor initial={tradeAlert} />
    </PortalPage>
  );
}
