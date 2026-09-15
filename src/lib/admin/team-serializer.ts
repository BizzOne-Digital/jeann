import type { TeamMemberLean } from "@/models";

export type AdminTeamItem = {
  _id: string;
  name: string;
  roleTitle: string;
  department: string;
  tier: "board" | "staff";
  bio: string;
  photo: string;
  displayOrder: number;
  status: "published" | "unpublished";
};

export function serializeTeamMember(doc: TeamMemberLean): AdminTeamItem {
  return {
    _id: String(doc._id),
    name: doc.name,
    roleTitle: doc.roleTitle,
    department: doc.department ?? "",
    tier: doc.tier === "board" ? "board" : "staff",
    bio: doc.bio ?? "",
    photo: doc.photo ?? "",
    displayOrder: doc.displayOrder ?? 0,
    status: doc.status,
  };
}
