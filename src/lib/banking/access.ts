import { Types } from "mongoose";
import { ForbiddenError } from "@/lib/auth/errors";
import { getAuthContext } from "@/lib/auth/auth-context";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import type { Permission } from "@/lib/authorization/permissions";
import { hasPermission } from "@/lib/authorization/permissions";

export async function assertBankingInstrumentAccess(
  userId: string,
  instrumentId: string,
  requiredPermissions?: Permission[],
): Promise<{
  userId: string;
  permissions: Permission[];
  roles: string[];
  instrument: Awaited<ReturnType<typeof loadInstrument>>;
}> {
  if (!isMongoConfigured()) throw new ForbiddenError("Database required");

  await tryConnectMongo();
  const ctx = await getAuthContext(userId);
  if (!ctx) throw new ForbiddenError("Authentication required");

  const instrument = await loadInstrument(instrumentId);
  if (!instrument) throw new ForbiddenError("Instrument not found or access denied");

  const roles = ctx.memberships.flatMap((m) => m.roles);
  const allPerms = ctx.permissions;

  const isInternal = ctx.isInternal;

  const isBankingAdviser = roles.includes("banking_advisor");
  const isBuyer = roles.some((r) => r === "buyer_org_admin" || r === "buyer_member");
  const isSupplier = roles.some((r) => r === "supplier_org_admin" || r === "supplier_member");

  if (isInternal && hasPermission(allPerms, "banking:review")) {
    return { userId, permissions: allPerms, roles, instrument };
  }

  if (isBankingAdviser) {
    const { BankingPartyAssignment } = await import("@/models");
    const assignment = await BankingPartyAssignment.findOne({
      bankingInstrumentId: instrument._id,
      userId: new Types.ObjectId(userId),
      bankingRole: "external_banking_adviser",
      active: true,
    }).lean();
    if (!assignment) throw new ForbiddenError("Not assigned to this instrument");
    return { userId, permissions: allPerms, roles, instrument };
  }

  if (isBuyer && instrument.transactionSide === "buyer_sale") {
    const membership = ctx.memberships.find(
      (m) => m.status === "active" && (m.roles.includes("buyer_org_admin") || m.roles.includes("buyer_member")),
    );
    if (!membership || String(instrument.applicantOrganizationId) !== membership.organizationId) {
      throw new ForbiddenError("Buyer access denied");
    }
    return { userId, permissions: allPerms, roles, instrument };
  }

  if (isSupplier && instrument.transactionSide === "supplier_purchase") {
    const membership = ctx.memberships.find(
      (m) =>
        m.status === "active" &&
        (m.roles.includes("supplier_org_admin") || m.roles.includes("supplier_member")),
    );
    if (!membership || String(instrument.beneficiaryOrganizationId) !== membership.organizationId) {
      throw new ForbiddenError("Supplier access denied");
    }
    return { userId, permissions: allPerms, roles, instrument };
  }

  await writeDeniedAudit(userId, instrumentId);
  throw new ForbiddenError("Forbidden");
}

async function writeDeniedAudit(userId: string, instrumentId: string) {
  const { writeAuditEvent } = await import("@/lib/audit/log");
  await writeAuditEvent({
    action: "banking.access_denied",
    targetType: "banking_instrument",
    targetId: instrumentId,
    actorUserId: userId,
    result: "failure",
    failureReason: "unauthorized",
  });
}

export async function loadInstrument(instrumentId: string) {
  await tryConnectMongo();
  const { BankingInstrument } = await import("@/models");
  if (Types.ObjectId.isValid(instrumentId)) {
    return BankingInstrument.findById(instrumentId).lean();
  }
  return BankingInstrument.findOne({ instrumentId }).lean();
}

export async function loadInstrumentForTransaction(transactionId: string, side?: string) {
  await tryConnectMongo();
  const { BankingInstrument } = await import("@/models");
  const query: Record<string, unknown> = { transactionId: new Types.ObjectId(transactionId) };
  if (side) query.transactionSide = side;
  return BankingInstrument.findOne(query).lean();
}

/** External parties must never see opposite-side instruments. */
export function filterInstrumentForExternalParty(
  instrument: Record<string, unknown>,
  role: "buyer" | "supplier" | "adviser",
): Record<string, unknown> {
  const safe = { ...instrument };
  delete safe.internalNotes;
  if (role === "buyer" || role === "supplier") {
    delete safe.adviceNotes;
    delete safe.adviceEvidenceSource;
  }
  return safe;
}
