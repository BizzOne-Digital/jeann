import type { TeamMemberLean } from "@/models";

export type AdminTeamItem = {
  _id: string;
  name: string;
  roleTitle: string;
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
    bio: doc.bio ?? "",
    photo: doc.photo ?? "",
    displayOrder: doc.displayOrder ?? 0,
    status: doc.status,
  };
}
