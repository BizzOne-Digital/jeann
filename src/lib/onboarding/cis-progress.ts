import { Types } from "mongoose";

/** Buyer-facing CIS (Corporation Information Sheet) progress. Never exposes staff verification data. */

export type CisProgressItem = { key: string; label: string; complete: boolean };

export type CisProgress = {
  items: CisProgressItem[];
  complete: number;
  total: number;
  label: string;
};

export function buildCisProgress(input: {
  hasCompanyDetails: boolean;
  hasRegisteredAddress: boolean;
  hasAuthorizedRepresentative: boolean;
  hasSupportingDocuments: boolean;
}): CisProgress {
  const items: CisProgressItem[] = [
    { key: "company_details", label: "Company name, registration and tax details", complete: input.hasCompanyDetails },
    { key: "registered_address", label: "Registered address", complete: input.hasRegisteredAddress },
    { key: "representative", label: "Authorized representative and contact", complete: input.hasAuthorizedRepresentative },
    { key: "supporting_documents", label: "CIS supporting documents uploaded", complete: input.hasSupportingDocuments },
  ];
  const complete = items.filter((i) => i.complete).length;
  return { items, complete, total: items.length, label: `${complete} of ${items.length} complete` };
}

export async function loadCisProgress(organizationId: string): Promise<CisProgress> {
  const { tryConnectMongo } = await import("@/lib/db/mongoose");
  await tryConnectMongo();
  const { CisProfile, KybDocument } = await import("@/models");
  const orgOid = new Types.ObjectId(organizationId);
  const cis = await CisProfile.findOne({ organizationId: orgOid }).sort({ version: -1 }).lean();
  if (!cis) {
    return buildCisProgress({
      hasCompanyDetails: false,
      hasRegisteredAddress: false,
      hasAuthorizedRepresentative: false,
      hasSupportingDocuments: false,
    });
  }
  const docCount = await KybDocument.countDocuments({ organizationId: orgOid, cisProfileId: cis._id, deletedAt: null });
  return buildCisProgress({
    hasCompanyDetails: Boolean(cis.legalName?.trim() && cis.registrationNumber?.trim() && cis.taxId?.trim()),
    hasRegisteredAddress: (cis.addresses?.length ?? 0) > 0,
    hasAuthorizedRepresentative:
      (cis.authorizedSigners?.length ?? 0) + (cis.representatives?.length ?? 0) > 0,
    hasSupportingDocuments: docCount > 0,
  });
}
