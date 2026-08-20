export type SeedTeamMember = {
  name: string;
  roleTitle: string;
  bio: string;
  photo?: string;
  displayOrder: number;
  status: "published" | "unpublished";
};

export const SEED_TEAM: SeedTeamMember[] = [
  {
    name: "Alexandra Chen",
    roleTitle: "Director of Trade Operations",
    bio: "Coordinates buyer programmes and supplier onboarding across edible oils, sugar, and grains with a focus on documentation discipline.",
    displayOrder: 0,
    status: "published",
  },
  {
    name: "Marcus Okonkwo",
    roleTitle: "Head of Logistics & Inspections",
    bio: "Structures inspection routing, loading milestones, and Incoterm hand-offs for bulk and containerised programmes.",
    displayOrder: 1,
    status: "published",
  },
  {
    name: "Elena Vasquez",
    roleTitle: "Compliance & Documentation Lead",
    bio: "Oversees contract templates, verification workflows, and counterpart document packages through closing.",
    displayOrder: 2,
    status: "published",
  },
];
