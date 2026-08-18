import { requirePortalAccess } from "@/lib/auth/portal-access";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { PortalPage } from "@/components/portal/PortalPage";
import { AdminPackagingManager } from "@/components/admin/AdminPackagingManager";

export const dynamic = "force-dynamic";

export default async function AdminPackagingPage() {
  await requirePortalAccess("admin");
  await tryConnectMongo();
  const { PackagingType } = await import("@/models");
  const docs = await PackagingType.find({ deletedAt: null }).sort({ displayOrder: 1 }).lean();
  const initialItems = docs.map((d) => ({
    _id: String(d._id),
    slug: d.slug,
    name: d.name,
    mode: d.mode,
    description: d.description,
    advantages: d.advantages,
    displayOrder: d.displayOrder,
    status: d.status,
  }));

  return (
    <PortalPage
      title="Packaging catalogue"
      description="Add, update, or deactivate packaging types shown on the public site and buyer RFQ forms."
    >
      <AdminPackagingManager initialItems={initialItems} />
    </PortalPage>
  );
}
