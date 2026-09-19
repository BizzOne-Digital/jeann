import type { TeamMemberLean } from "@/models";
import type { TeamMemberFieldDefinitionLean } from "@/models/TeamMemberFieldDefinition";

export type AdminTeamFieldDefinition = {
  key: string;
  label: string;
  displayOrder: number;
};

export type AdminTeamItem = {
  _id: string;
  name: string;
  roleTitle: string;
  department: string;
  tier: "board" | "staff";
  bio: string;
  photo: string;
  customFields: Record<string, string>;
  displayOrder: number;
  status: "published" | "unpublished";
};

export function mapCustomFieldsFromDoc(
  value: TeamMemberLean["customFields"],
): Record<string, string> {
  if (!value) return {};
  if (value instanceof Map) {
    return Object.fromEntries(value.entries());
  }
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).filter(([, v]) => typeof v === "string"),
    ) as Record<string, string>;
  }
  return {};
}

export function serializeTeamMember(doc: TeamMemberLean): AdminTeamItem {
  return {
    _id: String(doc._id),
    name: doc.name,
    roleTitle: doc.roleTitle,
    department: doc.department ?? "",
    tier: doc.tier === "board" ? "board" : "staff",
    bio: doc.bio ?? "",
    photo: doc.photo ?? "",
    customFields: mapCustomFieldsFromDoc(doc.customFields),
    displayOrder: doc.displayOrder ?? 0,
    status: doc.status,
  };
}

export function serializeTeamFieldDefinition(
  doc: TeamMemberFieldDefinitionLean,
): AdminTeamFieldDefinition {
  return {
    key: doc.key,
    label: doc.label,
    displayOrder: doc.displayOrder ?? 0,
  };
}
