import { Types } from "mongoose";
import { ForbiddenError } from "@/lib/auth/errors";
import { getAuthContext } from "@/lib/auth/auth-context";
import { tryConnectMongo } from "@/lib/db/mongoose";

export async function assertShipmentLotAccess(userId: string, lotId: string) {
  await tryConnectMongo();
  const ctx = await getAuthContext(userId);
  if (!ctx) throw new ForbiddenError("Authentication required");

  const { ShipmentLot, Transaction } = await import("@/models");
  const lot = Types.ObjectId.isValid(lotId)
    ? await ShipmentLot.findById(lotId).lean()
    : await ShipmentLot.findOne({ shipmentLotNumber: lotId }).lean();
  if (!lot) throw new ForbiddenError("Shipment not found or access denied");

  const roles = ctx.memberships.flatMap((m) => m.roles);
  const isInternal = ctx.isInternal;

  if (isInternal && ctx.permissions.includes("shipments:read")) {
    return { lot, permissions: ctx.permissions, roles };
  }

  const tx = await Transaction.findById(lot.transactionId).lean();
  if (!tx) throw new ForbiddenError("Access denied");

  const isBuyer = roles.some((r) => r === "buyer_org_admin" || r === "buyer_member");
  const isSupplier = roles.some((r) => r === "supplier_org_admin" || r === "supplier_member");

  if (isBuyer && lot.transactionSide === "buyer_sale") {
    const membership = ctx.memberships.find((m) => m.status === "active");
    if (!membership || String(tx.organizationId) !== membership.organizationId) {
      throw new ForbiddenError("Access denied");
    }
    return { lot, permissions: ctx.permissions, roles };
  }

  if (isSupplier && lot.transactionSide === "supplier_purchase") {
    const membership = ctx.memberships.find((m) => m.status === "active");
    if (!membership || String(tx.organizationId) !== membership.organizationId) {
      throw new ForbiddenError("Access denied");
    }
    return { lot, permissions: ctx.permissions, roles };
  }

  const { writeAuditEvent } = await import("@/lib/audit/log");
  await writeAuditEvent({
    action: "shipment.access_denied",
    targetType: "shipment_lot",
    targetId: String(lot._id),
    actorUserId: userId,
    result: "failure",
  });
  throw new ForbiddenError("Forbidden");
}

export function assertInternalShipmentAllocationAccess(roles: string[]) {
  const allowed = [
    "ceo_super_admin",
    "general_manager",
    "trade_manager",
    "employee_operations",
  ];
  if (!roles.some((r) => allowed.includes(r))) {
    throw new ForbiddenError("Forbidden");
  }
}
