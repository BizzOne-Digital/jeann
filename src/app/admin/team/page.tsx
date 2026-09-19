import { requirePortalAccess } from "@/lib/auth/portal-access";
import { serializeTeamFieldDefinition, serializeTeamMember } from "@/lib/admin/team-serializer";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { PortalPage } from "@/components/portal/PortalPage";
import { AdminTeamManager } from "@/components/admin/AdminTeamManager";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  await requirePortalAccess("admin");
  const mongoConfigured = isMongoConfigured();
  const conn = mongoConfigured ? await tryConnectMongo() : null;

  let initialItems: ReturnType<typeof serializeTeamMember>[] = [];
  let initialFields: ReturnType<typeof serializeTeamFieldDefinition>[] = [];
  if (conn) {
    const { TeamMember, TeamMemberFieldDefinition } = await import("@/models");
    const [docs, fields] = await Promise.all([
      TeamMember.find().sort({ displayOrder: 1, name: 1 }).lean(),
      TeamMemberFieldDefinition.find().sort({ displayOrder: 1, label: 1 }).lean(),
    ]);
    initialItems = docs.map(serializeTeamMember);
    initialFields = fields.map(serializeTeamFieldDefinition);
  }

  return (
    <PortalPage
      title="Team"
      description="Manage public team profiles. Only published members appear on the website."
    >
      <div className="space-y-4">
        <p className="text-sm text-[var(--stone)]">
          Database:{" "}
          {conn
            ? `${initialItems.length} team profile${initialItems.length === 1 ? "" : "s"}`
            : mongoConfigured
              ? "MongoDB URI set but unreachable."
              : "Not configured — set MONGODB_URI and run npm run seed."}
        </p>
        {!conn ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Team management requires a working MongoDB connection.
          </p>
        ) : (
          <AdminTeamManager initialItems={initialItems} initialFields={initialFields} />
        )}
      </div>
    </PortalPage>
  );
}
