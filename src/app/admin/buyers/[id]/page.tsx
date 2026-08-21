import { notFound } from "next/navigation";
import { Types } from "mongoose";
import { requirePortalAccess } from "@/lib/auth/portal-access";
import { loadBuyerDetail } from "@/lib/admin/buyer-approval";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { PortalPage } from "@/components/portal/PortalPage";
import { AdminBuyerReview } from "@/components/admin/AdminBuyerReview";

export const dynamic = "force-dynamic";

export default async function AdminBuyerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePortalAccess("admin");
  const { id } = await params;
  if (!(await tryConnectMongo())) notFound();

  const buyer = await loadBuyerDetail(id);
  if (!buyer) notFound();

  const { Approval } = await import("@/models");
  const approvals = await Approval.find({
    targetType: "buyer_organization",
    targetId: new Types.ObjectId(id),
  })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <PortalPage title="Review buyer" description="Approve or reject this buyer organization.">
      <AdminBuyerReview
        initialBuyer={buyer}
        initialApprovals={approvals.map((item) => ({
          _id: String(item._id),
          decision: item.decision,
          reason: item.reason ?? "",
          createdAt: item.createdAt ? new Date(item.createdAt).toLocaleString() : null,
        }))}
      />
    </PortalPage>
  );
}
