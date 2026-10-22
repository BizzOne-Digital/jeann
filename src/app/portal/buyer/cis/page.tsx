import { requirePortalAccess } from "@/lib/auth/portal-access";
import { getBuyerOrganizationId } from "@/lib/auth/buyer-org";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { BuyerCisPdfDownload } from "@/components/portal/BuyerCisPdfDownload";
import { CisDraftForm } from "@/components/portal/CisDraftForm";
import { PortalPage } from "@/components/portal/PortalPage";

export default async function CisPage() {
  const session = await requirePortalAccess("buyer");
  let initial = {
    legalName: "",
    registrationNumber: "",
    taxId: "",
    previousHsCode: "",
    registeredAddress: "",
    authorizedRepresentative: session.user.name || "",
    managerPhone: session.user.phone || "",
    status: "draft",
  };

  if (isMongoConfigured()) {
    await tryConnectMongo();
    const orgId = await getBuyerOrganizationId(session);
    if (orgId) {
      const { CisProfile, Organization } = await import("@/models");
      const org = await Organization.findById(orgId).lean();
      const cis = await CisProfile.findOne({ organizationId: orgId }).sort({ version: -1 }).lean();
      initial = {
        legalName: cis?.legalName || org?.legalName || "",
        registrationNumber: cis?.registrationNumber || org?.registrationNumber || "",
        taxId: cis?.taxId || org?.taxNumber || "",
        previousHsCode: org?.previousHsCode || "",
        registeredAddress:
          cis?.addresses?.[0]?.line1 || org?.businessAddressLine1 || "",
        authorizedRepresentative:
          cis?.authorizedSigners?.[0]?.name ||
          cis?.representatives?.[0]?.name ||
          session.user.name ||
          "",
        managerPhone:
          cis?.representatives?.[0]?.phone ||
          cis?.contacts?.[0]?.phone ||
          session.user.phone ||
          "",
        status: cis?.status || "draft",
      };
    }
  }

  return (
    <PortalPage
      title="Corporate information sheet"
      description="Provide your company details for qualification — use the PDF or the online draft below."
    >
      <BuyerCisPdfDownload />
      <CisDraftForm initial={initial} />
    </PortalPage>
  );
}
