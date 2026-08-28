/**
 * Phase 2 development/staging seed accounts. Never runs in production.
 * Usage: NODE_ENV=development tsx src/scripts/seed-phase2.ts
 */
import "./load-env";
import { getEnv } from "@/lib/config/env";
import { connectMongo, isMongoConfigured } from "@/lib/db/mongoose";
import { hashPassword } from "@/lib/auth/password";
import { normalizeCompanyName } from "@/lib/db/ids";

async function main() {
  const env = getEnv();
  if (env.NODE_ENV === "production") {
    console.error("seed-phase2 refuses to run in production.");
    process.exit(1);
  }

  if (!isMongoConfigured()) {
    console.error("MONGODB_URI required.");
    process.exit(1);
  }

  await connectMongo();
  const {
    User,
    Organization,
    OrganizationMembership,
    TermsDocument,
    TermsAcceptance,
    CisProfile,
  } = await import("@/models");

  const password =
    process.env.PHASE2_SEED_PASSWORD ??
    process.env.INITIAL_ADMIN_PASSWORD ??
    "Phase2TestPassword!12";

  console.log("Using seed password from env (not logged). Set PHASE2_SEED_PASSWORD to override.");

  async function seedUser(input: {
    email: string;
    name: string;
    firstName: string;
    lastName: string;
    roles: string[];
    orgId: string;
    orgType: "internal" | "buyer" | "supplier" | "banking_adviser";
  }) {
    const email = input.email.toLowerCase();
    const passwordHash = await hashPassword(password);
    const user = await User.findOneAndUpdate(
      { email },
      {
        email,
        normalizedEmail: email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        name: input.name,
        status: "active",
        emailVerifiedAt: new Date(),
        phoneVerifiedAt: new Date(),
        mfaEnabled: false,
      },
      { upsert: true, new: true },
    );

    await OrganizationMembership.findOneAndUpdate(
      { userId: user._id, organizationId: input.orgId },
      {
        userId: user._id,
        organizationId: input.orgId,
        roles: input.roles,
        customPermissions: [],
        status: "active",
      },
      { upsert: true, new: true },
    );

    return user;
  }

  async function completeTestOrgOnboarding(input: {
    userId: string;
    organizationId: string;
    legalName: string;
    registrationNumber: string;
    jurisdiction: string;
    country: string;
    email: string;
  }) {
    const requiredTerms = await TermsDocument.find({
      requiresAcceptance: true,
      publishedAt: { $ne: null },
    }).lean();

    for (const doc of requiredTerms) {
      await TermsAcceptance.findOneAndUpdate(
        {
          userId: input.userId,
          termsKey: doc.key,
          termsVersion: doc.version,
        },
        {
          userId: input.userId,
          organizationId: input.organizationId,
          termsKey: doc.key,
          termsVersion: doc.version,
          acceptedAt: new Date(),
        },
        { upsert: true },
      );
    }

    await CisProfile.findOneAndUpdate(
      { organizationId: input.organizationId, version: 1 },
      {
        organizationId: input.organizationId,
        version: 1,
        status: "approved",
        legalName: input.legalName,
        registrationNumber: input.registrationNumber,
        jurisdiction: input.jurisdiction,
        businessType: "Trading company",
        representatives: [
          { name: input.legalName, title: "Director", email: input.email },
        ],
        contacts: [{ name: input.legalName, email: input.email }],
        addresses: [
          {
            label: "Registered",
            line1: "100 Test Street",
            city: "Toronto",
            region: input.country === "CA" ? "ON" : undefined,
            postalCode: "M5X 1A1",
            country: input.country,
          },
        ],
        productInterests: [{ productName: "Edible oils" }],
        authorizedSigners: [{ name: input.legalName, title: "Director", email: input.email }],
        sensitiveFieldsMasked: {},
        submittedAt: new Date(),
        approvedAt: new Date(),
      },
      { upsert: true },
    );
  }

  const testOnboardingTargets: Array<{
    userId: string;
    organizationId: string;
    legalName: string;
    registrationNumber: string;
    jurisdiction: string;
    country: string;
    email: string;
  }> = [];

  const internalOrg = await Organization.findOneAndUpdate(
    { legalName: "Finekarts Internal Test", type: "internal" },
    {
      type: "internal",
      legalName: "Finekarts Internal Test",
      normalizedLegalName: normalizeCompanyName("Finekarts Internal Test"),
      country: "CA",
      status: "verified",
      onboardingStatus: "approved",
    },
    { upsert: true, new: true },
  );

  const buyers = [
    {
      legalName: "Atlas Global Foods Test Ltd.",
      registrationNumber: "TEST-ON-100001",
      jurisdiction: "Ontario, Canada",
      country: "CA",
      email: "buyer-a@test.finekarts.local",
      role: "buyer_org_admin",
    },
    {
      legalName: "NorthStar Wholesale Test Corp.",
      registrationNumber: "TEST-BC-200002",
      jurisdiction: "British Columbia, Canada",
      country: "CA",
      email: "buyer-b@test.finekarts.local",
      role: "buyer_org_admin",
    },
  ];

  for (const b of buyers) {
    const org = await Organization.findOneAndUpdate(
      { registrationNumber: b.registrationNumber },
      {
        type: "buyer",
        legalName: b.legalName,
        normalizedLegalName: normalizeCompanyName(b.legalName),
        registrationNumber: b.registrationNumber,
        jurisdiction: b.jurisdiction,
        country: b.country,
        status: "verified",
        onboardingStatus: "approved",
        approvedAt: new Date(),
      },
      { upsert: true, new: true },
    );
    const user = await seedUser({
      email: b.email,
      name: b.legalName,
      firstName: b.legalName.split(" ")[0],
      lastName: "Test",
      roles: [b.role],
      orgId: String(org._id),
      orgType: "buyer",
    });
    testOnboardingTargets.push({
      userId: String(user._id),
      organizationId: String(org._id),
      legalName: b.legalName,
      registrationNumber: b.registrationNumber,
      jurisdiction: b.jurisdiction,
      country: b.country,
      email: b.email,
    });
  }

  const supplierOrg = await Organization.findOneAndUpdate(
    { registrationNumber: "TEST-SUP-300003" },
    {
      type: "supplier",
      legalName: "Sunrise Commodity Supply Test Ltd.",
      normalizedLegalName: normalizeCompanyName("Sunrise Commodity Supply Test Ltd."),
      registrationNumber: "TEST-SUP-300003",
      jurisdiction: "Singapore",
      country: "SG",
      status: "verified",
      onboardingStatus: "approved",
      approvedAt: new Date(),
    },
    { upsert: true, new: true },
  );

  const supplierUser = await seedUser({
    email: "supplier-a@test.finekarts.local",
    name: "Supplier A Test",
    firstName: "Supplier",
    lastName: "A",
    roles: ["supplier_org_admin"],
    orgId: String(supplierOrg._id),
    orgType: "supplier",
  });
  testOnboardingTargets.push({
    userId: String(supplierUser._id),
    organizationId: String(supplierOrg._id),
    legalName: "Sunrise Commodity Supply Test Ltd.",
    registrationNumber: "TEST-SUP-300003",
    jurisdiction: "Singapore",
    country: "SG",
    email: "supplier-a@test.finekarts.local",
  });

  const roleSeeds = [
    { email: "super-admin@test.finekarts.local", roles: ["ceo_super_admin"], name: "Super Admin Test" },
    { email: "admin@test.finekarts.local", roles: ["general_manager"], name: "Administrator Test" },
    { email: "trade@test.finekarts.local", roles: ["trade_manager"], name: "Trade Manager Test" },
    { email: "compliance@test.finekarts.local", roles: ["compliance_reviewer"], name: "Compliance Test" },
    { email: "finance@test.finekarts.local", roles: ["finance"], name: "Finance Test" },
    { email: "shipping@test.finekarts.local", roles: ["employee_operations"], name: "Shipping Test" },
  ];

  for (const r of roleSeeds) {
    await seedUser({
      email: r.email,
      name: r.name,
      firstName: r.name.split(" ")[0],
      lastName: "User",
      roles: r.roles,
      orgId: String(internalOrg._id),
      orgType: "internal",
    });
  }

  const adviserOrg = await Organization.findOneAndUpdate(
    { legalName: "External Banking Adviser Test Org" },
    {
      type: "banking_adviser",
      legalName: "External Banking Adviser Test Org",
      normalizedLegalName: normalizeCompanyName("External Banking Adviser Test Org"),
      country: "GB",
      status: "verified",
      onboardingStatus: "approved",
    },
    { upsert: true, new: true },
  );

  await seedUser({
    email: "banking-adviser@test.finekarts.local",
    name: "Banking Adviser Test",
    firstName: "Banking",
    lastName: "Adviser",
    roles: ["banking_advisor"],
    orgId: String(adviserOrg._id),
    orgType: "banking_adviser",
  });

  for (const key of [
    "buyer_portal_terms",
    "supplier_portal_terms",
    "privacy_notice",
    "confidentiality_agreement",
  ]) {
    await TermsDocument.findOneAndUpdate(
      { key, version: 1, locale: "en" },
      {
        key,
        version: 1,
        locale: "en",
        title: `${key} (test)`,
        body: `Test terms body for ${key}`,
        effectiveAt: new Date(),
        publishedAt: new Date(),
        requiresAcceptance: true,
      },
      { upsert: true },
    );
  }

  for (const target of testOnboardingTargets) {
    await completeTestOrgOnboarding(target);
  }

  console.log("Phase 2 seed complete.");
  console.log("Test accounts use PHASE2_SEED_PASSWORD or INITIAL_ADMIN_PASSWORD.");
  console.log("Emails: super-admin@test.finekarts.local, buyer-a@test.finekarts.local, supplier-a@test.finekarts.local, etc.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
