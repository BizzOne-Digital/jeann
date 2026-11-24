import { requirePortalAccess } from "@/lib/auth/portal-access";
import { CompanyDetailsForm } from "@/components/portal/CompanyDetailsForm";
import { PortalPage } from "@/components/portal/PortalPage";

export const dynamic = "force-dynamic";

export default async function AgentCompanyDetailsPage() {
  await requirePortalAccess("agent");
  return (
    <PortalPage
      title="Company details"
      description="Contact, signatory and bank details that fill your documents automatically."
    >
      <CompanyDetailsForm />
    </PortalPage>
  );
}
