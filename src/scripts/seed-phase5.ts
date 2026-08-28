/**
 * Phase 5 seed: buyer + supplier banking instruments in Draft Wording.
 */
import "./load-env";
import { getEnv } from "@/lib/config/env";
import { connectMongo, isMongoConfigured } from "@/lib/db/mongoose";
import { money } from "@/lib/finance/money";
import { Types } from "mongoose";

async function main() {
  const env = getEnv();
  if (env.NODE_ENV === "production") {
    console.error("seed-phase5 refuses to run in production.");
    process.exit(1);
  }
  if (!isMongoConfigured()) {
    console.error("MONGODB_URI required.");
    process.exit(1);
  }

  await connectMongo();
  const {
    Transaction,
    Organization,
    User,
    BankingInstrumentType,
    BankOrganization,
    BankingInstrument,
    BankingDeadline,
  } = await import("@/models");

  const buyerTx = await Transaction.findOne({ transactionNumber: "FK-S-2026-TEST-0001" });
  const supplierTx = await Transaction.findOne({ transactionNumber: "FK-P-2026-TEST-0001" });
  const tradeUser = await User.findOne({ email: "trade@test.finekarts.local" });
  const buyerOrg = await Organization.findOne({ registrationNumber: "TEST-ON-100001" });
  const supplierOrg = await Organization.findOne({ registrationNumber: "TEST-SUP-300003" });
  const finekartsOrg = await Organization.findOne({ type: "internal" });

  if (!buyerTx || !supplierTx || !tradeUser || !buyerOrg || !supplierOrg || !finekartsOrg) {
    console.error("Run seed:phase2, phase3, phase4 first.");
    process.exit(1);
  }

  await BankingInstrumentType.findOneAndUpdate(
    { code: "irrevocable_documentary_lc_sight" },
    {
      name: "Irrevocable Documentary LC at Sight",
      code: "irrevocable_documentary_lc_sight",
      active: true,
      buyerSideAvailable: true,
      supplierSideAvailable: true,
      effectiveAt: new Date(),
      createdByUserId: tradeUser._id,
    },
    { upsert: true },
  );

  const issuingBuyer = await BankOrganization.findOneAndUpdate(
    { bankId: "TEST-ISSUING-NOT-REAL" },
    {
      bankId: "TEST-ISSUING-NOT-REAL",
      legalName: "Test Issuing Bank — Not Real",
      country: "CA",
      verificationStatus: "information_provided",
      notes: "TEST DOCUMENT — NOT VALID — FOR SOFTWARE QA ONLY",
      createdByUserId: tradeUser._id,
    },
    { upsert: true, new: true },
  );

  const advisingBuyer = await BankOrganization.findOneAndUpdate(
    { bankId: "TEST-ADVISING-NOT-REAL" },
    {
      bankId: "TEST-ADVISING-NOT-REAL",
      legalName: "Test Advising Bank — Not Real",
      country: "CA",
      verificationStatus: "information_provided",
      createdByUserId: tradeUser._id,
    },
    { upsert: true, new: true },
  );

  const issuingFk = await BankOrganization.findOneAndUpdate(
    { bankId: "TEST-FK-BANK-NOT-REAL" },
    {
      bankId: "TEST-FK-BANK-NOT-REAL",
      legalName: "Test Finekarts Bank — Not Real",
      country: "CA",
      verificationStatus: "information_provided",
      createdByUserId: tradeUser._id,
    },
    { upsert: true, new: true },
  );

  const advisingSupplier = await BankOrganization.findOneAndUpdate(
    { bankId: "TEST-SUP-BANK-NOT-REAL" },
    {
      bankId: "TEST-SUP-BANK-NOT-REAL",
      legalName: "Test Supplier Bank — Not Real",
      country: "SG",
      verificationStatus: "information_provided",
      createdByUserId: tradeUser._id,
    },
    { upsert: true, new: true },
  );

  if (!await BankingInstrument.findOne({ transactionId: buyerTx._id })) {
    const buyerInst = await BankingInstrument.create({
      instrumentId: "BIN-2026-TEST-BUYER",
      transactionId: buyerTx._id,
      transactionSide: "buyer_sale",
      instrumentTypeCode: "irrevocable_documentary_lc_sight",
      applicantOrganizationId: buyerOrg._id,
      beneficiaryOrganizationId: finekartsOrg._id,
      issuingBankId: issuingBuyer._id,
      advisingBankId: advisingBuyer._id,
      currency: "USD",
      amount: Types.Decimal128.fromString(money("1050000").toString()),
      amountTolerance: "±5%",
      loadingPortPlace: "Port of Constanța, Romania",
      destinationPortPlace: "Port of Montreal, Canada",
      goodsDescription: "Refined Sunflower Oil — TEST DOCUMENT — NOT VALID — FOR SOFTWARE QA ONLY",
      latestShipmentDate: new Date("2026-09-30"),
      expiryDate: new Date("2026-10-21"),
      presentationPeriod: "21 calendar days (test only)",
      currentStatus: "draft_wording",
      currentVersion: 1,
      adviceAuthenticationStatus: "not_recorded",
      issuedCopyVerificationStatus: "unverified",
      createdByUserId: tradeUser._id,
      selectedByUserId: tradeUser._id,
      selectedAt: new Date(),
    });

    await BankingDeadline.create({
      bankingInstrumentId: buyerInst._id,
      deadlineType: "instrument_expiry",
      dueAt: new Date("2026-10-21"),
      timezone: "UTC",
      isCalendarDays: true,
      source: "seed",
      status: "upcoming",
      createdByUserId: tradeUser._id,
    });
  }

  if (!await BankingInstrument.findOne({ transactionId: supplierTx._id })) {
    await BankingInstrument.create({
      instrumentId: "BIN-2026-TEST-SUPPLIER",
      transactionId: supplierTx._id,
      transactionSide: "supplier_purchase",
      instrumentTypeCode: "irrevocable_documentary_lc_sight",
      applicantOrganizationId: finekartsOrg._id,
      beneficiaryOrganizationId: supplierOrg._id,
      issuingBankId: issuingFk._id,
      advisingBankId: advisingSupplier._id,
      currency: "USD",
      amount: Types.Decimal128.fromString(money("980000").toString()),
      amountTolerance: "±5%",
      loadingPortPlace: "Port of Constanța, Romania",
      destinationPortPlace: "Port of Montreal, Canada",
      goodsDescription: "Refined Sunflower Oil — TEST DOCUMENT — NOT VALID — FOR SOFTWARE QA ONLY",
      latestShipmentDate: new Date("2026-09-30"),
      currentStatus: "draft_wording",
      currentVersion: 1,
      adviceAuthenticationStatus: "not_recorded",
      issuedCopyVerificationStatus: "unverified",
      createdByUserId: tradeUser._id,
      selectedByUserId: tradeUser._id,
      selectedAt: new Date(),
    });
  }

  const adviser = await User.findOne({ email: "banking-adviser@test.finekarts.local" });
  if (adviser) {
    const buyerInst = await BankingInstrument.findOne({ transactionId: buyerTx._id });
    if (buyerInst) {
      const { BankingPartyAssignment } = await import("@/models");
      await BankingPartyAssignment.findOneAndUpdate(
        {
          bankingInstrumentId: buyerInst._id,
          userId: adviser._id,
          bankingRole: "external_banking_adviser",
        },
        {
          bankingInstrumentId: buyerInst._id,
          userId: adviser._id,
          bankingRole: "external_banking_adviser",
          accessScope: "assigned_instrument",
          assignedByUserId: tradeUser._id,
          assignedAt: new Date(),
          active: true,
        },
        { upsert: true },
      );
    }
  }

  console.log("Phase 5 seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
