export type SeedTeamMember = {
  name: string;
  roleTitle: string;
  department: string;
  tier: "board" | "staff";
  bio: string;
  photo?: string;
  customFields?: Record<string, string>;
  displayOrder: number;
  status: "published" | "unpublished";
};

const placeholderPhoto = (n: number) => `/images/team/${String(n).padStart(2, "0")}.jpg`;

/** Twelve team profiles — swap photos in Admin → Team or replace files under public/images/team/. */
export const SEED_TEAM: SeedTeamMember[] = [
  {
    name: "Jean Joseph",
    roleTitle: "Chief Executive Officer",
    department: "Executive Office",
    tier: "board",
    bio: "",
    photo: placeholderPhoto(1),
    displayOrder: 0,
    status: "published",
  },
  {
    name: "Alexandra Chen",
    roleTitle: "Chief Operating Officer",
    department: "Trade Operations",
    tier: "board",
    bio: "",
    photo: placeholderPhoto(2),
    displayOrder: 1,
    status: "published",
  },
  {
    name: "Marcus Okonkwo",
    roleTitle: "Director of Logistics",
    department: "Logistics & Inspections",
    tier: "board",
    bio: "",
    photo: placeholderPhoto(3),
    displayOrder: 2,
    status: "published",
  },
  {
    name: "Elena Vasquez",
    roleTitle: "Director of Compliance",
    department: "Compliance & Documentation",
    tier: "board",
    bio: "",
    photo: placeholderPhoto(4),
    displayOrder: 3,
    status: "published",
  },
  {
    name: "David Okello",
    roleTitle: "Head of Procurement",
    department: "Sourcing & Origins",
    tier: "board",
    bio: "",
    photo: placeholderPhoto(5),
    displayOrder: 4,
    status: "published",
  },
  {
    name: "Sarah Mitchell",
    roleTitle: "Trade Finance Manager",
    department: "Banking & Structured Finance",
    tier: "board",
    bio: "",
    photo: placeholderPhoto(6),
    displayOrder: 5,
    status: "published",
  },
  {
    name: "James Hartford",
    roleTitle: "Senior Commodity Trader",
    department: "Edible Oils & Sugar",
    tier: "board",
    bio: "",
    photo: placeholderPhoto(7),
    displayOrder: 6,
    status: "published",
  },
  {
    name: "Priya Sharma",
    roleTitle: "Quality & Inspection Lead",
    department: "Inspection Coordination",
    tier: "board",
    bio: "",
    photo: placeholderPhoto(8),
    displayOrder: 7,
    status: "published",
  },
  {
    name: "Michael Torres",
    roleTitle: "Documentation Manager",
    department: "Shipping & Documentation",
    tier: "board",
    bio: "",
    photo: placeholderPhoto(9),
    displayOrder: 8,
    status: "published",
  },
  {
    name: "Fatima Al-Hassan",
    roleTitle: "Buyer Relations Director",
    department: "Buyer Programmes",
    tier: "board",
    bio: "",
    photo: placeholderPhoto(10),
    displayOrder: 9,
    status: "published",
  },
  {
    name: "Robert Kim",
    roleTitle: "Risk & Insurance Manager",
    department: "Marine & Trade Insurance",
    tier: "board",
    bio: "",
    photo: placeholderPhoto(11),
    displayOrder: 10,
    status: "published",
  },
  {
    name: "Amara Diallo",
    roleTitle: "People & Administration Director",
    department: "Human Resources",
    tier: "board",
    bio: "",
    photo: placeholderPhoto(12),
    displayOrder: 11,
    status: "published",
  },
];
