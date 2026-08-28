import { ForbiddenError } from "@/lib/auth/errors";
import { getAuthContext } from "@/lib/auth/auth-context";
import { tryConnectMongo } from "@/lib/db/mongoose";

export async function assertFinanceAccess(userId: string, scope: "internal" | "buyer" | "supplier") {
  await tryConnectMongo();
  const ctx = await getAuthContext(userId);
  if (!ctx) throw new ForbiddenError("Authentication required");

  if (scope === "internal") {
    if (!ctx.isInternal || !ctx.permissions.includes("finance:read")) {
      throw new ForbiddenError("Forbidden");
    }
    return ctx;
  }

  if (scope === "buyer") {
    const isBuyer = ctx.memberships.some((m) => m.roles.some((r) => r.startsWith("buyer_")));
    if (!isBuyer) throw new ForbiddenError("Forbidden");
    return ctx;
  }

  const isSupplier = ctx.memberships.some((m) => m.roles.some((r) => r.startsWith("supplier_")));
  if (!isSupplier) throw new ForbiddenError("Forbidden");
  return ctx;
}

export function assertProfitabilityAccess(ctx: Awaited<ReturnType<typeof getAuthContext>>) {
  if (!ctx?.permissions.includes("finance:read")) {
    throw new ForbiddenError("Profitability access denied");
  }
  if (!ctx.isInternal) {
    throw new ForbiddenError("Profitability is internal only");
  }
}
