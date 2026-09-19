import { mapCustomFieldsFromDoc } from "@/lib/admin/team-serializer";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { SEED_TEAM } from "@/lib/content/team-seed";

export type PublicTeamFieldDefinition = {
  key: string;
  label: string;
  displayOrder: number;
};

export type PublicTeamMember = {
  id: string;
  name: string;
  roleTitle: string;
  department: string;
  tier: "board" | "staff";
  bio: string;
  photo?: string;
  customFields: Record<string, string>;
  displayOrder: number;
};

function fromSeed(): PublicTeamMember[] {
  return SEED_TEAM.filter((member) => member.status === "published")
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((member, index) => ({
      id: `seed-${index}`,
      name: member.name,
      roleTitle: member.roleTitle,
      department: member.department ?? "",
      tier: member.tier,
      bio: member.bio,
      photo: member.photo,
      customFields: member.customFields ?? {},
      displayOrder: member.displayOrder,
    }));
}

export async function getPublishedTeamFieldDefinitions(): Promise<PublicTeamFieldDefinition[]> {
  if (!isMongoConfigured()) return [];
  const conn = await tryConnectMongo();
  if (!conn) return [];

  const { TeamMemberFieldDefinition } = await import("@/models");
  const defs = await TeamMemberFieldDefinition.find().sort({ displayOrder: 1, label: 1 }).lean();
  return defs.map((doc) => ({
    key: doc.key,
    label: doc.label,
    displayOrder: doc.displayOrder ?? 0,
  }));
}

export async function getPublishedTeamMembers(): Promise<PublicTeamMember[]> {
  if (!isMongoConfigured()) return fromSeed();
  const conn = await tryConnectMongo();
  if (!conn) return fromSeed();

  const { TeamMember } = await import("@/models");
  const docs = await TeamMember.find({ status: "published" })
    .sort({ displayOrder: 1, name: 1 })
    .lean();

  if (docs.length === 0) return fromSeed();

  return docs.map((doc) => ({
    id: String(doc._id),
    name: doc.name,
    roleTitle: doc.roleTitle,
    department: doc.department ?? "",
    tier: doc.tier === "board" || doc.tier === "staff" ? doc.tier : "staff",
    bio: doc.bio ?? "",
    photo: doc.photo,
    customFields: mapCustomFieldsFromDoc(doc.customFields),
    displayOrder: doc.displayOrder ?? 0,
  }));
}
