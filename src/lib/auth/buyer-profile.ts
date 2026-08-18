import type { ActiveSession } from "@/lib/auth/session";
import { getBuyerOrganizationId } from "@/lib/auth/buyer-org";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";

export type BuyerFormDefaults = {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
};

/** Prefill buyer portal forms from session + organization. */
export async function getBuyerFormDefaults(session: ActiveSession): Promise<BuyerFormDefaults> {
  const user = session.user;
  let companyName = "";

  if (isMongoConfigured()) {
    await tryConnectMongo();
    const orgId = await getBuyerOrganizationId(session);
    if (orgId) {
      const { Organization } = await import("@/models");
      const org = await Organization.findById(orgId).lean();
      companyName = org?.legalName ?? "";
    }
  }

  return {
    companyName,
    contactName: user.name ?? "",
    email: user.email ?? "",
    phone: user.phone ?? "",
  };
}
