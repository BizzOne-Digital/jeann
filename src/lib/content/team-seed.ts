export type SeedTeamMember = {
  name: string;
  roleTitle: string;
  department?: string;
  tier: "board" | "staff";
  bio: string;
  photo?: string;
  displayOrder: number;
  status: "published" | "unpublished";
};

export const SEED_TEAM: SeedTeamMember[] = [
  {
    name: "Alexandra Chen",
    roleTitle: "Director of Trade Operations",
    department: "Trade Operations",
    tier: "board",
    bio: "Board oversight of buyer programmes and supplier onboarding across edible oils, sugar, and grains.",
    displayOrder: 1,
    status: "published",
  },
  {
    name: "Marcus Okonkwo",
    roleTitle: "Head of Logistics & Inspections",
    tier: "staff",
    bio: "Structures inspection routing, loading milestones, and Incoterm hand-offs for bulk and containerised programmes.",
    displayOrder: 2,
    status: "published",
  },
  {
    name: "Elena Vasquez",
    roleTitle: "Compliance & Documentation Lead",
    tier: "staff",
    bio: "Oversees contract templates, verification workflows, and counterpart document packages through closing.",
    displayOrder: 3,
    status: "published",
  },
];
