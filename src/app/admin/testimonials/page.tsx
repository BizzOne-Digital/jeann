import { requirePortalAccess } from "@/lib/auth/portal-access";
import { serializeTestimonial } from "@/lib/admin/testimonial-serializer";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { PortalPage } from "@/components/portal/PortalPage";
import { AdminTestimonialsManager } from "@/components/admin/AdminTestimonialsManager";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  await requirePortalAccess("admin");
  const mongoConfigured = isMongoConfigured();
  const conn = mongoConfigured ? await tryConnectMongo() : null;

  let initialItems: ReturnType<typeof serializeTestimonial>[] = [];
  if (conn) {
    const { Testimonial } = await import("@/models");
    const docs = await Testimonial.find().sort({ createdAt: -1 }).lean();
    initialItems = docs.map(serializeTestimonial);
  }

  return (
    <PortalPage
      title="Testimonials"
      description="Manage client testimonials shown on the public site. Only published entries appear publicly."
    >
      <div className="space-y-4">
        <p className="text-sm text-[var(--stone)]">
          Database:{" "}
          {conn
            ? `${initialItems.length} testimonial${initialItems.length === 1 ? "" : "s"}`
            : mongoConfigured
              ? "MongoDB URI set but unreachable — edits cannot be saved."
              : "Not configured — set MONGODB_URI and run npm run seed."}
        </p>
        {!conn ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Testimonial management requires a working MongoDB connection.
          </p>
        ) : (
          <AdminTestimonialsManager initialItems={initialItems} />
        )}
      </div>
    </PortalPage>
  );
}
