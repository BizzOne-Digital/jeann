import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { SEED_TEAM } from "@/lib/content/team-seed";

export type PublicTeamMember = {
  id: string;
  name: string;
  roleTitle: string;
  department: string;
  tier: "board" | "staff";
  bio: string;
  photo?: string;
};

function fromSeed(): PublicTeamMember[] {
  return SEED_TEAM.filter((member) => member.status === "published").map((member, index) => ({
    id: `seed-${index}`,
    name: member.name,
    roleTitle: member.roleTitle,
    department: member.department ?? "",
    tier: member.tier,
    bio: member.bio,
    photo: member.photo,
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
    tier: doc.tier === "board" ? "board" : "staff",
    bio: doc.bio ?? "",
    photo: doc.photo,
  }));
}
