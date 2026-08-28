/**
 * Phase 3 seed: FK-S-2026-TEST-0001 staging transaction.
 * NODE_ENV !== production only.
 */
import "./load-env";
import { getEnv } from "@/lib/config/env";
import { connectMongo, isMongoConfigured } from "@/lib/db/mongoose";
import { reserveTransactionNumber } from "@/lib/transactions/number";
import { money, mulMoney } from "@/lib/finance/money";
import { Types } from "mongoose";
import { BUYER_WORKFLOW_STEPS } from "@/lib/workflows/transitions";

const TEST_NUMBER = "FK-S-2026-TEST-0001";

async function main() {
  const env = getEnv();
  if (env.NODE_ENV === "production") {
    console.error("seed-phase3 refuses to run in production.");
    process.exit(1);
  }
  if (!isMongoConfigured()) {
    console.error("MONGODB_URI required.");
    process.exit(1);
  }

  await connectMongo();
  const {
    Organization,
    User,
    OrganizationMembership,
    Transaction,
    CommercialTerms,
    WorkflowStep,
    ProductSpecificationVersion,
    Clause,
    Product,
  } = await import("@/models");

  const buyerOrg = await Organization.findOne({
    legalName: "Atlas Global Foods Test Ltd.",
  });
  if (!buyerOrg) {
    console.error("Run npm run seed:phase2 first.");
    process.exit(1);
  }

  const buyerUser = await User.findOne({ email: "buyer-a@test.finekarts.local" });
  if (!buyerUser) {
    console.error("Buyer A user missing.");
    process.exit(1);
  }

  const existing = await Transaction.findOne({ transactionNumber: TEST_NUMBER });
  if (existing) {
    console.log("Test transaction already exists:", TEST_NUMBER);
    return;
  }

  await reserveTransactionNumber(TEST_NUMBER, 2026, 1);

  const product = await Product.findOne().lean();
  const spec = await ProductSpecificationVersion.findOneAndUpdate(
    { specificationName: "Refined Sunflower Oil QA Spec", version: 1 },
    {
      productId: product?._id ?? new Types.ObjectId(),
      specificationName: "Refined Sunflower Oil QA Spec",
      version: 1,
      fields: { grade: "Refined", origin: "Romania" },
      origin: "Romania",
      packagingOptions: ["Flexitanks"],
      active: true,
      approvedAt: new Date(),
    },
    { upsert: true, new: true },
  );

  await Clause.findOneAndUpdate(
    { name: "QA Test Clause", version: 1 },
    {
      name: "QA Test Clause",
      category: "spa",
      version: 1,
      text: "This is a test clause for software QA only.",
      applicableDocumentTypes: ["spa"],
      classification: "required",
      active: true,
      effectiveAt: new Date(),
    },
    { upsert: true },
  );

  const tx = await Transaction.create({
    transactionNumber: TEST_NUMBER,
    transactionType: "buyer_sale",
    side: "buyer",
    organizationId: buyerOrg._id,
    productId: product?._id,
    status: "active",
    workflowStatus: "qualified",
    currentStepKey: "sco_fco",
    createdBy: buyerUser._id,
    submittedAt: new Date(),
    buyerVisibleNotes: "TEST TRANSACTION — NOT VALID — FOR SOFTWARE QA ONLY",
  });

  const qty = money("1000");
  const unitPrice = money("1050");
  const total = mulMoney(qty, unitPrice);

  await CommercialTerms.create({
    transactionId: tx._id,
    organizationId: buyerOrg._id,
    productId: product?._id,
    productName: "Refined Sunflower Oil",
    specificationVersionId: spec._id,
    productOrigin: "Romania",
    quantity: Types.Decimal128.fromString(qty.toString()),
    quantityUnit: "MT",
    quantityTolerance: "±5%",
    currency: "USD",
    unitPrice: Types.Decimal128.fromString(unitPrice.toString()),
    totalEstimatedValue: Types.Decimal128.fromString(total.toString()),
    incoterm: "CIF Port of Montreal, Canada, Incoterms 2020",
    loadingPort: "Port of Constanța, Romania",
    destinationPort: "Port of Montreal, Canada",
    packaging: "Flexitanks",
    inspectionCompany: "SGS or equivalent at loading port",
    paymentProposal: "Irrevocable Documentary LC at sight",
    shipmentSchedule: "September 15–30, 2026",
    version: 1,
    approvalStatus: "approved",
  });

  for (const step of BUYER_WORKFLOW_STEPS) {
    await WorkflowStep.create({
      transactionId: tx._id,
      key: step.key,
      order: step.order,
      title: step.title,
      status: step.order === 1 ? "ready" : "not_started",
      locked: false,
    });
  }

  console.log("Phase 3 seed complete:", TEST_NUMBER);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
