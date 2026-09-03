import { tryConnectMongo } from "@/lib/db/mongoose";

export type WorkspaceDashboardStats = {
  purchaseRequests: number;
  pendingApprovals: number;
  activeTransactions: number;
  openTasks: number;
  shipmentLots: number;
  pendingSupplierOffers: number;
};

export async function getWorkspaceDashboardStats(): Promise<WorkspaceDashboardStats | null> {
  if (!(await tryConnectMongo())) return null;

  const models = await import("@/models");

  const [
    purchaseRequests,
    pendingApprovals,
    activeTransactions,
    openTasks,
    shipmentLots,
    pendingSupplierOffers,
  ] = await Promise.all([
    models.PurchaseRequest.countDocuments({
      status: { $in: ["submitted", "under_review", "more_information_required"] },
    }),
    models.Approval.countDocuments({ decision: "pending" }),
    models.Transaction.countDocuments({ status: "active", deletedAt: null }),
    models.Task.countDocuments({ status: { $in: ["open", "in_progress"] } }).catch(() => 0),
    models.ShipmentLot.countDocuments({ status: { $nin: ["delivered", "cancelled"] } }).catch(
      () => 0,
    ),
    models.TradeOffer.countDocuments({
      status: { $in: ["submitted", "under_review"] },
    }),
  ]);

  return {
    purchaseRequests,
    pendingApprovals,
    activeTransactions,
    openTasks,
    shipmentLots,
    pendingSupplierOffers,
  };
}
