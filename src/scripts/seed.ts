/**
 * Idempotent seed for Finekarts public content and platform defaults.
 * Requires MONGODB_URI. Creates admin only when INITIAL_ADMIN_* env vars are set.
 */
import "./load-env";
import { connectMongo, isMongoConfigured } from "@/lib/db/mongoose";
import {
  SEED_CATEGORIES,
  SEED_PACKAGING,
  SITE,
  SEED_FAQS,
  SEED_INSIGHTS,
} from "@/lib/content/catalog";
import { BUYER_WORKFLOW_STEPS, SUPPLIER_WORKFLOW_STEPS } from "@/lib/workflows/transitions";
import { hashPassword } from "@/lib/auth/password";
import { getEnv } from "@/lib/config/env";

async function main() {
  if (!isMongoConfigured()) {
    console.error(
      "MONGODB_URI is required for seeding. Public seed catalog still works from code without Mongo.",
    );
    process.exit(1);
  }

  await connectMongo();
  const {
    SiteSettings,
    ProductCategory,
    Product,
    PackagingType,
    Faq,
    BlogPost,
    WorkflowTemplate,
    TermsDocument,
    TaxConfiguration,
    AiKnowledgeEntry,
    IntegrationConfiguration,
    User,
    Organization,
    OrganizationMembership,
  } = await import("@/models");

  await SiteSettings.findOneAndUpdate(
    { key: "default" },
    {
      key: "default",
      companyName: SITE.name,
      email: SITE.email,
      phone: SITE.phone,
      addressVisible: false,
      seoDefaults: {
        title: `${SITE.name} | ${SITE.headline}`,
        description: SITE.positioning,
      },
      featureFlags: {
        supplierPortal: true,
        bankingPortal: true,
        aiAssistant: true,
        financeModule: true,
      },
      aiAssistantEnabled: true,
      locales: ["en"],
    },
    { upsert: true, new: true },
  );

  for (const [i, pack] of SEED_PACKAGING.entries()) {
    await PackagingType.findOneAndUpdate(
      { slug: pack.slug },
      { ...pack, displayOrder: i, status: "active" },
      { upsert: true },
    );
  }

  for (const [ci, cat] of SEED_CATEGORIES.entries()) {
    const category = await ProductCategory.findOneAndUpdate(
      { slug: cat.slug },
      {
        slug: cat.slug,
        name: cat.name,
        summary: cat.summary,
        displayOrder: ci,
        status: "published",
      },
      { upsert: true, new: true },
    );

    for (const [pi, product] of cat.products.entries()) {
      await Product.findOneAndUpdate(
        { slug: product.slug, categoryId: category._id },
        {
          categoryId: category._id,
          slug: product.slug,
          name: product.name,
          overview: product.overview,
          status: product.status,
          availabilityText: product.availabilityText,
          originOptions: product.originOptions,
          gradeSummary: product.gradeSummary,
          packagingOptionIds: [],
          inspectionOptions: product.inspectionOptions,
          incotermOptions: product.incotermOptions,
          documentCategories: product.documentCategories.map((label) => ({
            key: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            label,
            required: false,
          })),
          gallery: product.image
            ? [{ storageKey: product.image, alt: product.name, displayOrder: 0 }]
            : [],
          minOrderText: product.minOrderText,
          claims: {
            certified: { enabled: false, note: "" },
            inStock: { enabled: false, note: "" },
            readyToShip: { enabled: false, note: "" },
            specificOrigin: { enabled: false, note: "" },
          },
          displayOrder: pi,
          requiresAdminVerification: true,
        },
        { upsert: true },
      );
    }
  }

  for (const [i, faq] of SEED_FAQS.entries()) {
    await Faq.findOneAndUpdate(
      { question: faq.question },
      { ...faq, category: "General", displayOrder: i, status: "published" },
      { upsert: true },
    );
  }

  for (const post of SEED_INSIGHTS) {
    await BlogPost.findOneAndUpdate(
      { slug: post.slug },
      {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        body: `${post.body.join("\n\n")}\n\nEducational content only — not legal, banking, or tax advice.`,
        authorName: "Finekarts Trade Desk",
        categories: [post.category],
        tags: ["education"],
        status: "published",
        publishedAt: new Date(post.publishedAt),
        locale: "en",
      },
      { upsert: true },
    );
  }

  await WorkflowTemplate.findOneAndUpdate(
    { key: "buyer_default_v1", version: 1 },
    {
      key: "buyer_default_v1",
      side: "buyer",
      name: "Default buyer six-step workflow",
      version: 1,
      active: true,
      steps: BUYER_WORKFLOW_STEPS.map((s) => ({
        key: s.key,
        order: s.order,
        title: s.title,
        required: true,
      })),
    },
    { upsert: true },
  );

  await WorkflowTemplate.findOneAndUpdate(
    { key: "supplier_default_v1", version: 1 },
    {
      key: "supplier_default_v1",
      side: "supplier",
      name: "Default supplier six-step workflow",
      version: 1,
      active: true,
      steps: SUPPLIER_WORKFLOW_STEPS.map((s) => ({
        key: s.key,
        order: s.order,
        title: s.title,
        required: true,
      })),
    },
    { upsert: true },
  );

  await TermsDocument.findOneAndUpdate(
    { key: "buyer_portal", version: 1, locale: "en" },
    {
      key: "buyer_portal",
      version: 1,
      locale: "en",
      title: "Buyer Portal Terms (Draft — Legal Review Required)",
      body: "Draft buyer terms placeholder. Must be reviewed by qualified counsel before production use. Version 1 draft.",
      effectiveAt: new Date(),
      requiresAcceptance: true,
    },
    { upsert: true },
  );

  await TaxConfiguration.findOneAndUpdate(
    { jurisdiction: "CA-ON", code: "HST_EXAMPLE" },
    {
      jurisdiction: "CA-ON",
      code: "HST_EXAMPLE",
      rateString: "13",
      effectiveFrom: new Date("2024-01-01"),
      notes:
        "Example combined HST rate for configuration demos only. Not a universal rule. Accounting review required.",
      exampleOnly: true,
    },
    { upsert: true },
  );

  await AiKnowledgeEntry.findOneAndUpdate(
    { title: "Purchase requests" },
    {
      title: "Purchase requests",
      content:
        "Buyers submit RFQs with quantity, specs, destination, and Incoterm preference. Submission does not guarantee acceptance or supply.",
      tags: ["rfq", "process"],
      sourceType: "manual",
      published: true,
      locale: "en",
    },
    { upsert: true },
  );

  for (const key of ["email", "sms", "gemini", "storage", "shipment_tracking", "crm", "newsletter"]) {
    await IntegrationConfiguration.findOneAndUpdate(
      { key },
      {
        key,
        provider: "unconfigured",
        configured: false,
        status: "inactive",
        statusMessage: "Not configured — integration disabled until credentials are provided.",
        metadata: {},
      },
      { upsert: true },
    );
  }

  const env = getEnv();
  if (env.INITIAL_ADMIN_EMAIL && env.INITIAL_ADMIN_PASSWORD) {
    const email = env.INITIAL_ADMIN_EMAIL.toLowerCase();
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        passwordHash: await hashPassword(env.INITIAL_ADMIN_PASSWORD),
        name: env.INITIAL_ADMIN_NAME || "Platform Administrator",
        emailVerifiedAt: new Date(),
        status: "active",
      });
    }

    let org = await Organization.findOne({ type: "internal", legalName: SITE.name });
    if (!org) {
      org = await Organization.create({
        type: "internal",
        legalName: SITE.name,
        normalizedLegalName: "finekarts",
        country: "CA",
        status: "verified",
      });
    }

    await OrganizationMembership.findOneAndUpdate(
      { userId: user._id, organizationId: org._id },
      {
        userId: user._id,
        organizationId: org._id,
        roles: ["ceo_super_admin"],
        customPermissions: [],
        status: "active",
      },
      { upsert: true },
    );
    console.log(`Admin ensured for ${email}`);
  } else {
    console.log("INITIAL_ADMIN_* not set — skipped admin creation. Use npm run create-admin.");
  }

  // Demo buyer for local/MVP walkthrough (idempotent).
  const demoEmail = "buyer@demo.finekarts.com";
  const demoPassword = "DemoBuyer123!";
  let demoUser = await User.findOne({ email: demoEmail });
  if (!demoUser) {
    demoUser = await User.create({
      email: demoEmail,
      passwordHash: await hashPassword(demoPassword),
      name: "Demo Buyer",
      phone: "+1-416-555-0100",
      emailVerifiedAt: new Date(),
      status: "active",
    });
  }
  let buyerOrg = await Organization.findOne({
    type: "buyer",
    normalizedLegalName: "demo buyer trading",
    deletedAt: null,
  });
  if (!buyerOrg) {
    buyerOrg = await Organization.create({
      type: "buyer",
      legalName: "Demo Buyer Trading Ltd",
      normalizedLegalName: "demo buyer trading",
      country: "CA",
      status: "pending",
    });
  }
  await OrganizationMembership.findOneAndUpdate(
    { userId: demoUser._id, organizationId: buyerOrg._id },
    {
      userId: demoUser._id,
      organizationId: buyerOrg._id,
      roles: ["buyer_org_admin"],
      customPermissions: [],
      status: "active",
    },
    { upsert: true },
  );

  const { PurchaseRequest, CisProfile } = await import("@/models");
  const { generateLeadReference } = await import("@/lib/leads/persist");
  const existingPr = await PurchaseRequest.findOne({
    organizationId: buyerOrg._id,
  }).lean();
  if (!existingPr) {
    await PurchaseRequest.create({
      reference: generateLeadReference("PR"),
      organizationId: buyerOrg._id,
      contactName: "Demo Buyer",
      contactEmail: demoEmail,
      contactPhone: "+1-416-555-0100",
      contactCompany: "Demo Buyer Trading Ltd",
      productName: "Crude Degummed Soybean Oil",
      quantity: "500",
      unit: "MT",
      destinationCountry: "CA",
      destinationPort: "Montreal",
      incoterm: "CIF",
      packaging: "Flexitank",
      status: "submitted",
      termsVersion: 1,
      termsAcceptedAt: new Date(),
      source: "seed",
      attachments: [],
    });
  }

  await CisProfile.findOneAndUpdate(
    { organizationId: buyerOrg._id, version: 1 },
    {
      organizationId: buyerOrg._id,
      version: 1,
      status: "draft",
      legalName: "Demo Buyer Trading Ltd",
      tradingName: "Demo Buyer",
      registrationNumber: "DEMO-12345",
      jurisdiction: "Ontario, Canada",
      businessType: "Importer",
      representatives: [{ name: "Demo Buyer", title: "Director", email: demoEmail }],
      contacts: [{ name: "Demo Buyer", email: demoEmail, phone: "+1-416-555-0100" }],
      addresses: [
        {
          label: "Registered",
          line1: "100 King Street West",
          city: "Toronto",
          region: "ON",
          postalCode: "M5X 1A1",
          country: "CA",
        },
      ],
      productInterests: [{ productName: "Soybean Oil" }],
      authorizedSigners: [{ name: "Demo Buyer", title: "Director", email: demoEmail }],
      sensitiveFieldsMasked: {},
    },
    { upsert: true },
  );

  console.log(`Demo buyer ensured: ${demoEmail} / ${demoPassword}`);
  console.log("Seed completed successfully.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
