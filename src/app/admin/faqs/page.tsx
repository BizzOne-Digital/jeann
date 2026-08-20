import { requirePortalAccess } from "@/lib/auth/portal-access";
import { serializeFaq } from "@/lib/admin/faq-serializer";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { PortalPage } from "@/components/portal/PortalPage";
import { AdminFaqsManager } from "@/components/admin/AdminFaqsManager";

export const dynamic = "force-dynamic";

export default async function AdminFaqsPage() {
  await requirePortalAccess("admin");
  const mongoConfigured = isMongoConfigured();
  const conn = mongoConfigured ? await tryConnectMongo() : null;

  let initialItems: ReturnType<typeof serializeFaq>[] = [];
  if (conn) {
    const { Faq } = await import("@/models");
    const docs = await Faq.find().sort({ displayOrder: 1, createdAt: 1 }).lean();
    initialItems = docs.map(serializeFaq);
  }

  return (
    <PortalPage
      title="FAQs"
      description="Manage frequently asked questions shown on the public FAQ page."
    >
      <div className="space-y-4">
        <p className="text-sm text-[var(--stone)]">
          Database:{" "}
          {conn
            ? `${initialItems.length} FAQ record${initialItems.length === 1 ? "" : "s"}`
            : mongoConfigured
              ? "MongoDB URI set but unreachable — edits cannot be saved."
              : "Not configured — set MONGODB_URI and run npm run seed."}
        </p>
        {!conn ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            FAQ management requires a working MongoDB connection.
          </p>
        ) : (
          <AdminFaqsManager initialItems={initialItems} />
        )}
      </div>
    </PortalPage>
  );
}
