import { notFound } from "next/navigation";
import { Types } from "mongoose";
import { requirePortalAccess } from "@/lib/auth/portal-access";
import { loadBuyerDetail } from "@/lib/admin/buyer-approval";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { PortalPage } from "@/components/portal/PortalPage";
import { AdminBuyerReview } from "@/components/admin/AdminBuyerReview";
import { AdminKybPanel } from "@/components/admin/AdminKybPanel";
import { loadStaffKybView } from "@/lib/kyb/kyb-service";

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

  const kybView = await loadStaffKybView(id);

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
      <div className="mt-8">
        <h2 className="mb-3 text-xl font-semibold text-[var(--navy)]">KYB and company validation</h2>
        <AdminKybPanel organizationId={id} initial={JSON.parse(JSON.stringify(kybView))} />
      </div>
    </PortalPage>
  );
}
