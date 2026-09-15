export type SeedTeamMember = {
  name: string;
  roleTitle: string;
  department: string;
  tier: "board" | "staff";
  bio: string;
  photo?: string;
  displayOrder: number;
  status: "published" | "unpublished";
};

/** Board rows use name, position (roleTitle), and department — staff are managed separately and are not listed on /team. */
export const SEED_TEAM: SeedTeamMember[] = [
  {
    name: "Jean Joseph",
    roleTitle: "Chief Executive Officer",
    department: "Executive Office",
    tier: "board",
    bio: "",
    displayOrder: 0,
    status: "published",
  },
  {
    name: "Alexandra Chen",
    roleTitle: "Director of Trade Operations",
    department: "Trade Operations",
    tier: "board",
    bio: "",
    displayOrder: 1,
    status: "published",
  },
  {
    name: "Marcus Okonkwo",
    roleTitle: "Director of Logistics",
    department: "Logistics & Inspections",
    tier: "board",
    bio: "",
    displayOrder: 2,
    status: "published",
  },
  {
    name: "Elena Vasquez",
    roleTitle: "Director of Compliance",
    department: "Compliance & Documentation",
    tier: "board",
    bio: "",
    displayOrder: 3,
    status: "published",
  },
];
