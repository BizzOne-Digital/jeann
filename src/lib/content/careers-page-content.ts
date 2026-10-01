/** Canonical /privacy (Careers) marketing copy & form options. */

export const CAREERS_PAGE_HERO = {
  eyebrow: "Career portal",
  title: "Build your career in global commodity trade",
  description:
    "Finekarts Incorporated coordinates bulk agricultural commodity programmes for qualified international buyers. Join trade, logistics, procurement, compliance, and operations teams — start with a career portal account, then complete the full application and HR questionnaire.",
  primaryCta: { href: "#career-application", label: "Start application →" },
  secondaryCta: { href: "/team", label: "Meet the team" },
} as const;

export const CAREERS_PORTAL_ACCOUNT = {
  title: "Career portal account required",
  lead:
    "Create an account using your email address as your username and a secure password. Sign in anytime to update or submit your application dossier.",
} as const;

export const CAREERS_INTRO = {
  title: "Application intake & HR questionnaire",
  lead:
    "Our structured application captures education, work history, commodity expertise, and scenario-based responses — the same discipline we apply to trade execution.",
  pillars: [
    {
      title: "Trade & operations",
      body: "Roles across desk support, procurement, documentation, and shipment coordination.",
    },
    {
      title: "Compliance mindset",
      body: "Experience with inspection scope, banking instruments, and customs documentation is valued.",
    },
    {
      title: "Global corridors",
      body: "Multilingual candidates with hands-on bulk commodity exposure are encouraged to apply.",
    },
  ],
} as const;

export const CAREERS_FORM = {
  title: "Finekarts Inc. job application form",
  educationTitle: "1. Education & academic background",
  experienceTitle: "2. Past work experience",
  hrTitle: "3. Comprehensive HR & role-specific questions",
  uploadTitle: "4. Resume & document upload",
  uploadHeadline: "Upload candidate dossier",
  uploadHint: "Drag & drop your résumé / CV, cover letter, or portfolio. Accepted: PDF, DOCX (max 15MB).",
  submitLabel: "Submit complete application",
  successTitle: "Application received",
  successBody:
    "Thank you for applying to Finekarts Incorporated. Our HR and trade leadership team will review your dossier and contact you if there is a suitable opportunity.",
} as const;

export const EDUCATION_LEVEL_OPTIONS = [
  "High School",
  "High School Diploma",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate (Ph.D.)",
  "Professional Certification",
] as const;

export const EMPLOYMENT_STATUS_OPTIONS = [
  "Employed full-time",
  "Employed part-time",
  "Unemployed",
  "Student",
  "Freelance",
] as const;

export const WORK_AUTHORIZATION_OPTIONS = [
  "Canadian citizen",
  "Permanent resident",
  "Open work permit",
  "Require employer sponsorship",
] as const;

export const COMMODITY_FAMILIARITY_OPTIONS = [
  "Agri-commodities & grains (parboiled rice, jasmine rice, kidney beans, pulses)",
  "Refined & raw sugar (ICUMSA 45, 100, 600, 1200)",
  "Edible oils (sunflower, soybean, canola, palm oil)",
  "Metals & materials (copper cathodes, industrial supplies)",
  "Heavy machinery & equipment (construction, concrete mixers, power generators)",
] as const;

export const TRADE_DOCUMENT_OPTIONS = [
  "Bill of Lading (B/L) & Air Waybill (AWB)",
  "Certificate of analysis (COA) / quality inspection (SGS, Bureau Veritas)",
  "Phytosanitary certificate & health inspection",
  "Certificate of origin (CO)",
  "ISPM 15 / wood packaging & fumigation declarations",
  "Export packing list & commercial invoice",
] as const;

export const ACCURACY_CERTIFICATION_TEXT =
  "I certify that all information provided in this application, including attached work history and academic credentials, is accurate and complete.";
