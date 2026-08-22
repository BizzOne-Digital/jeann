import { requirePortalAccess } from "@/lib/auth/portal-access";
import {
  loadPaymentTermsConfig,
  mergePaymentTermsWithConfig,
} from "@/lib/payment-terms/config";
import { PortalPage } from "@/components/portal/PortalPage";
import { AdminPaymentTermsManager } from "@/components/admin/AdminPaymentTermsManager";

export const dynamic = "force-dynamic";

export default async function AdminPaymentTermsPage() {
  await requirePortalAccess("admin");
  const config = await loadPaymentTermsConfig();
  const terms = mergePaymentTermsWithConfig(config);

  return (
    <PortalPage
      title="Payment Terms"
      description="Enable payment structures suitable for current commodity programmes. Buyers only see enabled terms."
    >
      <AdminPaymentTermsManager initialConfig={config} initialTerms={terms} />
    </PortalPage>
  );
}
