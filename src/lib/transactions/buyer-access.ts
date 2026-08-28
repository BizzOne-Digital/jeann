import { Types } from "mongoose";
import { ForbiddenError } from "@/lib/auth/errors";
import { getAuthContext } from "@/lib/auth/auth-context";
import { loadOnboardingStatusForUser } from "@/lib/onboarding/status";
import { assertOrgScope } from "@/lib/authorization/authorize";
import { getEnv } from "@/lib/config/env";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import type { Permission } from "@/lib/authorization/permissions";

export type BuyerTransactionAccessResult = {
  userId: string;
  organizationId: string;
  permissions: Permission[];
  canTransact: boolean;
  blockers: string[];
};

export async function assertBuyerTransactionAccess(
  userId: string,
): Promise<BuyerTransactionAccessResult> {
  if (!isMongoConfigured()) {
    throw new ForbiddenError("Transaction access requires database");
  }

  await tryConnectMongo();
  const ctx = await getAuthContext(userId);
  if (!ctx) throw new ForbiddenError("Authentication required");

  if (ctx.user.status === "suspended" || ctx.user.status === "disabled") {
    throw new ForbiddenError("Account is suspended");
  }

  const membership = ctx.memberships.find(
    (m) =>
      m.status === "active" &&
      (m.roles.includes("buyer_org_admin") || m.roles.includes("buyer_member")),
  );
  if (!membership) {
    throw new ForbiddenError("Buyer organization membership required");
  }

  const blockers: string[] = [];
  const env = getEnv();

  if (!ctx.user.emailVerified) blockers.push("email_verification");
  if (env.REQUIRE_PHONE_OTP && !ctx.user.phoneVerified) blockers.push("phone_verification");

  const onboarding = await loadOnboardingStatusForUser(userId, membership.organizationId);
  if (!onboarding?.canTrade) {
    if (onboarding?.organization.status !== "verified") {
      blockers.push("organization_not_approved");
    }
    if (onboarding?.organization.onboardingStatus !== "approved") {
      blockers.push("cis_kyb_not_approved");
    }
    const incomplete = onboarding?.steps.filter((s) => s.required && !s.complete) ?? [];
    for (const step of incomplete) {
      blockers.push(step.key);
    }
  }

  const permissions = await assertOrgScope(userId, membership.organizationId);

  if (blockers.length > 0) {
    throw new ForbiddenError(
      `Complete onboarding before accessing transactions: ${blockers.join(", ")}`,
    );
  }

  return {
    userId,
    organizationId: membership.organizationId,
    permissions,
    canTransact: true,
    blockers,
  };
}

export async function getBuyerTransactionAccess(
  userId: string,
): Promise<BuyerTransactionAccessResult | { canTransact: false; blockers: string[] }> {
  try {
    return await assertBuyerTransactionAccess(userId);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      const message = error.message;
      const blockers = message.includes(":")
        ? message.split(":").slice(1).join(":").split(",").map((s) => s.trim())
        : ["access_denied"];
      return { canTransact: false, blockers };
    }
    throw error;
  }
}

export async function loadTransactionForBuyer(
  transactionId: string,
  userId: string,
  organizationId: string,
) {
  if (!Types.ObjectId.isValid(transactionId)) {
    throw new ForbiddenError("Invalid transaction");
  }

  await tryConnectMongo();
  const { Transaction } = await import("@/models");
  const tx = await Transaction.findOne({
    _id: transactionId,
    organizationId: new Types.ObjectId(organizationId),
    transactionType: "buyer_sale",
    side: "buyer",
    deletedAt: null,
  }).lean();

  if (!tx) throw new ForbiddenError("Transaction not found or access denied");
  return tx;
}
