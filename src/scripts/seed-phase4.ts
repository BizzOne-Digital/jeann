/**
 * Phase 4 seed: FK-P-2026-TEST-0001 + FK-DG-2026-TEST-0001 linked to FK-S-2026-TEST-0001
 */
import "./load-env";
import { getEnv } from "@/lib/config/env";
import { connectMongo, isMongoConfigured } from "@/lib/db/mongoose";
import { reserveTransactionNumber } from "@/lib/transactions/number";
import { money, mulMoney } from "@/lib/finance/money";
import { Types } from "mongoose";
import { SUPPLIER_WORKFLOW_STEPS } from "@/lib/workflows/transitions";

const TEST_PROC_NUMBER = "FK-P-2026-TEST-0001";
const TEST_DG_NUMBER = "FK-DG-2026-TEST-0001";
const BUYER_TEST_NUMBER = "FK-S-2026-TEST-0001";

async function main() {
  const env = getEnv();
  if (env.NODE_ENV === "production") {
    console.error("seed-phase4 refuses to run in production.");
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
    Transaction,
    ProcurementTerms,
    WorkflowStep,
    Product,
    ProductSpecificationVersion,
    DealGroup,
    DealGroupTransaction,
    DealAllocation,
    TransactionCounter,
  } = await import("@/models");

  const supplierOrg = await Organization.findOne({
    registrationNumber: "TEST-SUP-300003",
  });
  const buyerTx = await Transaction.findOne({ transactionNumber: BUYER_TEST_NUMBER });
  const tradeUser = await User.findOne({ email: "trade@test.finekarts.local" });

  if (!supplierOrg || !buyerTx || !tradeUser) {
    console.error("Run seed:phase2 and seed:phase3 first.");
    process.exit(1);
  }

  const existing = await Transaction.findOne({ transactionNumber: TEST_PROC_NUMBER });
  if (existing) {
    console.log("Phase 4 test procurement already exists:", TEST_PROC_NUMBER);
    return;
  }

  await reserveTransactionNumber(TEST_PROC_NUMBER, 2026, 1, "P");
  await TransactionCounter.findOneAndUpdate(
    { year: 2026, side: "DG" },
    { $max: { sequence: 1 } },
    { upsert: true },
  );

  const product = await Product.findOne().lean();
  const spec = await ProductSpecificationVersion.findOne({
    specificationName: "Refined Sunflower Oil QA Spec",
  }).lean();

  const finekartsInternal = await Organization.findOne({ type: "internal" }).lean();

  const tx = await Transaction.create({
    transactionNumber: TEST_PROC_NUMBER,
    transactionType: "supplier_purchase",
    side: "supplier",
    organizationId: supplierOrg._id,
    counterpartyOrgId: finekartsInternal?._id,
    productId: product?._id,
    status: "active",
    workflowStatus: "offer_pending",
    currentStepKey: "supplier_sco_fco",
    assignedTradeManagerId: tradeUser._id,
    createdBy: tradeUser._id,
    submittedAt: new Date(),
    supplierVisibleNotes: "TEST TRANSACTION — NOT VALID — FOR SOFTWARE QA ONLY",
  });

  const qty = money("1000");
  const unitPrice = money("980");
  const total = mulMoney(qty, unitPrice);

  await ProcurementTerms.create({
    transactionId: tx._id,
    organizationId: supplierOrg._id,
    productId: product?._id,
    productName: "Refined Sunflower Oil",
    specificationVersionId: spec?._id,
    productOrigin: "Romania",
    quantity: Types.Decimal128.fromString(qty.toString()),
    quantityUnit: "MT",
    quantityTolerance: "±5%",
    currency: "USD",
    procurementUnitPrice: Types.Decimal128.fromString(unitPrice.toString()),
    procurementTotal: Types.Decimal128.fromString(total.toString()),
    incoterm: "CIF Port of Montreal, Canada, Incoterms 2020",
    loadingPort: "Port of Constanța, Romania",
    destinationPlace: "Port of Montreal, Canada",
    packaging: "Flexitanks",
    inspection: "SGS or equivalent",
    paymentProposal: "Irrevocable Documentary LC at sight",
    shipmentSchedule: "September 15–30, 2026",
    version: 1,
    approvalStatus: "approved",
    supplierVisibleNotes: "TEST DOCUMENT — NOT VALID — FOR SOFTWARE QA ONLY",
  });

  for (const step of SUPPLIER_WORKFLOW_STEPS) {
    await WorkflowStep.create({
      transactionId: tx._id,
      key: step.key,
      order: step.order,
      title: step.title,
      status: step.order === 1 ? "ready" : "not_started",
      locked: false,
    });
  }

  const dealGroup = await DealGroup.findOneAndUpdate(
    { dealGroupNumber: TEST_DG_NUMBER },
    {
      dealGroupNumber: TEST_DG_NUMBER,
      name: "QA Sunflower Oil Deal Group",
      productName: "Refined Sunflower Oil",
      productId: product?._id,
      status: "active",
      specificationCompatibilityStatus: "compatible",
      leadTradeManagerId: tradeUser._id,
      createdByUserId: tradeUser._id,
      internalNotes: "TEST — NOT VALID — FOR SOFTWARE QA ONLY",
    },
    { upsert: true, new: true },
  );

  await DealGroupTransaction.findOneAndUpdate(
    { dealGroupId: dealGroup._id, transactionId: buyerTx._id },
    {
      dealGroupId: dealGroup._id,
      transactionId: buyerTx._id,
      transactionType: "buyer_sale",
      relationshipType: "buyer_sale",
      linkedByUserId: tradeUser._id,
      linkedAt: new Date(),
      active: true,
    },
    { upsert: true },
  );

  await DealGroupTransaction.findOneAndUpdate(
    { dealGroupId: dealGroup._id, transactionId: tx._id },
    {
      dealGroupId: dealGroup._id,
      transactionId: tx._id,
      transactionType: "supplier_purchase",
      relationshipType: "supplier_purchase",
      linkedByUserId: tradeUser._id,
      linkedAt: new Date(),
      active: true,
    },
    { upsert: true },
  );

  await DealAllocation.findOneAndUpdate(
    {
      dealGroupId: dealGroup._id,
      buyerTransactionId: buyerTx._id,
      supplierTransactionId: tx._id,
    },
    {
      dealGroupId: dealGroup._id,
      buyerTransactionId: buyerTx._id,
      supplierTransactionId: tx._id,
      productId: product?._id,
      specificationVersionId: spec?._id,
      allocatedQuantity: Types.Decimal128.fromString(qty.toString()),
      unit: "MT",
      allocationStatus: "confirmed",
      internalNote: "TEST allocation — QA only",
      createdByUserId: tradeUser._id,
    },
    { upsert: true },
  );

  console.log("Phase 4 seed complete:", TEST_PROC_NUMBER, TEST_DG_NUMBER);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
