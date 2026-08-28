/**
 * Phase 7 seed: buyer invoice, supplier bill, costs, payments, commission, credit note, claim settlement.
 * Expected contribution profit: USD 30,000 on FK-S-2026-TEST-0001.
 */
import "./load-env";
import { getEnv } from "@/lib/config/env";
import { connectMongo, isMongoConfigured } from "@/lib/db/mongoose";
import { Types } from "mongoose";
import {
  createBuyerInvoiceDraft,
  approveBuyerInvoice,
  issueBuyerInvoice,
  createSupplierBill,
  approveSupplierBill,
  postSupplierBill,
} from "@/lib/finance/invoice-service";
import {
  createPaymentRecord,
  uploadPaymentEvidence,
  verifyPayment,
  allocatePayment,
} from "@/lib/finance/payment-service";
import {
  createCostEntry,
  approveFinancialEntry,
  postFinancialEntry,
} from "@/lib/finance/entry-service";
import { calculateTransactionProfitability } from "@/lib/finance/profitability-service";
import { allocateFinanceNumber } from "@/lib/finance/number";
import { money } from "@/lib/finance/money";
import { DEFAULT_COST_CATEGORIES } from "@/models/CostCategory";

const QA_MARKER = "TEST DOCUMENT — NOT VALID — FOR SOFTWARE QA ONLY";
const BUYER_TX = "FK-S-2026-TEST-0001";
const SUPPLIER_TX = "FK-P-2026-TEST-0001";
const DEAL_GROUP = "FK-DG-2026-TEST-0001";
const BUYER_SHIPMENT = "FK-SHP-2026-TEST-0001";
const SUPPLIER_SHIPMENT = "FK-SHP-2026-TEST-0002";
const SEED_MARKER = "phase7-seed-v1";

async function postCost(
  tradeUserId: string,
  financeUserId: string,
  input: {
    costCategoryCode: string;
    description: string;
    originalAmount: string;
    transactionId: string;
    shipmentLotId?: string;
    dealGroupId?: string;
    bankingInstrumentId?: string;
  },
) {
  const entry = await createCostEntry({
    entryType: "direct_cost",
    costCategoryCode: input.costCategoryCode,
    description: input.description,
    originalAmount: input.originalAmount,
    currency: "USD",
    entryDate: "2026-10-01",
    transactionId: input.transactionId,
    shipmentLotId: input.shipmentLotId,
    dealGroupId: input.dealGroupId,
    bankingInstrumentId: input.bankingInstrumentId,
    actorUserId: tradeUserId,
  });
  await approveFinancialEntry({ entryId: String(entry._id), actorUserId: financeUserId });
  await postFinancialEntry({ entryId: String(entry._id), actorUserId: financeUserId });
  return entry;
}

async function main() {
  const env = getEnv();
  if (env.NODE_ENV === "production") {
    console.error("seed-phase7 refuses to run in production.");
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
    DealGroup,
    ShipmentLot,
    FinancialSettings,
    CostCategory,
    BankingInstrument,
    BuyerInvoice,
    CommissionRecord,
    CreditNote,
    TradeClaim,
    ClaimSettlement,
    FinancialPeriod,
  } = await import("@/models");

  const buyerTx = await Transaction.findOne({ transactionNumber: BUYER_TX });
  const supplierTx = await Transaction.findOne({ transactionNumber: SUPPLIER_TX });
  const dealGroup = await DealGroup.findOne({ dealGroupNumber: DEAL_GROUP });
  const buyerLot = await ShipmentLot.findOne({ shipmentLotNumber: BUYER_SHIPMENT });
  const supplierLot = await ShipmentLot.findOne({ shipmentLotNumber: SUPPLIER_SHIPMENT });
  const buyerOrg = await Organization.findOne({ legalName: "Atlas Global Foods Test Ltd." });
  const supplierOrg = await Organization.findOne({ registrationNumber: "TEST-SUP-300003" });
  const tradeUser = await User.findOne({ email: "trade@test.finekarts.local" });
  const financeUser = await User.findOne({ email: "finance@test.finekarts.local" });
  const buyerUser = await User.findOne({ email: "buyer-a@test.finekarts.local" });
  const bankingInstrument = buyerTx
    ? await BankingInstrument.findOne({ transactionId: buyerTx._id })
    : null;

  if (
    !buyerTx ||
    !supplierTx ||
    !dealGroup ||
    !buyerLot ||
    !supplierLot ||
    !buyerOrg ||
    !supplierOrg ||
    !tradeUser ||
    !financeUser ||
    !buyerUser
  ) {
    console.error("Run seed:phase2 through phase6 first.");
    process.exit(1);
  }

  const tradeId = String(tradeUser._id);
  const financeId = String(financeUser._id);
  const buyerUserId = String(buyerUser._id);
  const buyerTxId = String(buyerTx._id);
  const supplierTxId = String(supplierTx._id);
  const dealGroupId = String(dealGroup._id);
  const buyerLotId = String(buyerLot._id);
  const supplierLotId = String(supplierLot._id);
  const buyerOrgId = String(buyerOrg._id);
  const supplierOrgId = String(supplierOrg._id);

  if (!await FinancialSettings.findOne()) {
    await FinancialSettings.create({
      baseReportingCurrency: "USD",
      defaultTransactionCurrency: "USD",
      roundingPrecision: 2,
      roundingMode: "half_up",
      fiscalYearStartMonth: 1,
      defaultTimezone: "America/Toronto",
      invoiceNumberFormat: "FK-INV-{YEAR}-{SEQ}",
      billNumberFormat: "FK-BILL-{YEAR}-{SEQ}",
      creditNoteNumberFormat: "FK-CN-{YEAR}-{SEQ}",
      separationOfDutiesEnabled: true,
    });
  }

  for (const cat of DEFAULT_COST_CATEGORIES) {
    await CostCategory.findOneAndUpdate(
      { code: cat.code },
      {
        code: cat.code,
        name: cat.name,
        active: true,
        createdByUserId: tradeUser._id,
      },
      { upsert: true },
    );
  }

  let invoice = await BuyerInvoice.findOne({
    transactionId: buyerTx._id,
    qaMarker: QA_MARKER,
  });

  if (!invoice) {
    invoice = await createBuyerInvoiceDraft({
      buyerOrganizationId: buyerOrgId,
      transactionId: buyerTxId,
      shipmentLotId: buyerLotId,
      currency: "USD",
      lineItems: [
        {
          description: `Refined Sunflower Oil 1000 MT — ${QA_MARKER}`,
          quantity: "1000",
          unit: "MT",
          unitPrice: "1050",
        },
      ],
      invoiceDate: "2026-10-01",
      dueDate: "2026-11-01",
      contractReference: BUYER_TX,
      actorUserId: financeId,
      applyTax: false,
    });
    await approveBuyerInvoice({ invoiceId: String(invoice._id), actorUserId: financeId });
    invoice = await issueBuyerInvoice({ invoiceId: String(invoice._id), actorUserId: financeId });
  }

  const { SupplierBill } = await import("@/models");
  let bill = await SupplierBill.findOne({
    transactionId: supplierTx._id,
    qaMarker: QA_MARKER,
  });

  if (!bill) {
    bill = await createSupplierBill({
      supplierOrganizationId: supplierOrgId,
      transactionId: supplierTxId,
      shipmentLotId: supplierLotId,
      supplierInvoiceReference: `SUP-INV-TEST-2026 — ${QA_MARKER}`,
      currency: "USD",
      total: "980000",
      description: `Procurement 1000 MT — ${QA_MARKER}`,
      invoiceDate: "2026-10-01",
      dueDate: "2026-11-15",
      actorUserId: tradeId,
    });
    await approveSupplierBill({ billId: String(bill._id), actorUserId: financeId });
    bill = await postSupplierBill({ billId: String(bill._id), actorUserId: financeId });
  }

  const costs = [
    { code: "freight", amount: "20000", desc: "Ocean freight — TEST" },
    { code: "insurance", amount: "3000", desc: "Cargo insurance — TEST" },
    { code: "inspection", amount: "2000", desc: "SGS inspection — TEST" },
    { code: "packaging", amount: "4000", desc: "Flexitank packaging — TEST" },
    { code: "port_charges", amount: "2000", desc: "Port and storage — TEST" },
    { code: "bank_fees", amount: "4000", desc: "LC bank fees — TEST" },
    { code: "agent_commission", amount: "5000", desc: "Agent commission — TEST" },
  ];

  const { FinancialEntry } = await import("@/models");
  const existingCosts = await FinancialEntry.countDocuments({
    transactionId: buyerTx._id,
    entryType: "direct_cost",
    status: "posted",
    description: { $regex: SEED_MARKER },
  });

  if (existingCosts === 0) {
    for (const c of costs) {
      await postCost(tradeId, financeId, {
        costCategoryCode: c.code,
        description: `${c.desc} — ${SEED_MARKER}`,
        originalAmount: c.amount,
        transactionId: buyerTxId,
        shipmentLotId: buyerLotId,
        dealGroupId,
        bankingInstrumentId: c.code === "bank_fees" && bankingInstrument
          ? String(bankingInstrument._id)
          : undefined,
      });
    }
  }

  if (!await CommissionRecord.findOne({ transactionId: buyerTx._id })) {
    await CommissionRecord.create({
      transactionId: buyerTx._id,
      shipmentLotId: buyerLot._id,
      agentName: "Test Agent — NOT REAL",
      commissionType: "fixed",
      fixedAmount: Types.Decimal128.fromString("5000"),
      currency: "USD",
      calculatedAmount: Types.Decimal128.fromString("5000"),
      dueDate: new Date("2026-11-01"),
      approvalStatus: "approved",
      paymentStatus: "unpaid",
      supportingAgreementRef: QA_MARKER,
      createdByUserId: tradeUser._id,
      approvedByUserId: financeUser._id,
    });
  }

  const { PaymentRecord, PaymentAllocation } = await import("@/models");
  const buyerAllocCount = await PaymentAllocation.countDocuments({ buyerInvoiceId: invoice._id });
  if (buyerAllocCount === 0) {
    const partialPay = await createPaymentRecord({
      direction: "incoming",
      payerOrganizationId: buyerOrgId,
      amount: "500000",
      currency: "USD",
      paymentDate: "2026-10-15",
      method: "wire",
      bankReference: "TEST-BUYER-PAY-001",
      actorUserId: financeId,
      buyerVisible: true,
    });
    await uploadPaymentEvidence({
      paymentId: String(partialPay._id),
      evidenceDocumentId: new Types.ObjectId().toString(),
      actorUserId: buyerUserId,
    });
    await verifyPayment({
      paymentId: String(partialPay._id),
      actorUserId: financeId,
      approved: true,
    });
    await allocatePayment({
      paymentId: String(partialPay._id),
      buyerInvoiceId: String(invoice._id),
      allocatedAmount: "500000",
      currency: "USD",
      actorUserId: financeId,
    });

    const finalPay = await createPaymentRecord({
      direction: "incoming",
      payerOrganizationId: buyerOrgId,
      amount: "550000",
      currency: "USD",
      paymentDate: "2026-10-28",
      method: "wire",
      bankReference: "TEST-BUYER-PAY-002",
      actorUserId: financeId,
      buyerVisible: true,
      autoVerify: true,
    });
    await allocatePayment({
      paymentId: String(finalPay._id),
      buyerInvoiceId: String(invoice._id),
      allocatedAmount: "550000",
      currency: "USD",
      actorUserId: financeId,
    });
  }

  const supplierAllocCount = await PaymentAllocation.countDocuments({ supplierBillId: bill._id });
  if (supplierAllocCount === 0) {
    const partialOut = await createPaymentRecord({
      direction: "outgoing",
      payeeOrganizationId: supplierOrgId,
      amount: "480000",
      currency: "USD",
      paymentDate: "2026-10-20",
      method: "wire",
      bankReference: "TEST-SUP-PAY-001",
      actorUserId: financeId,
      supplierVisible: true,
      autoVerify: true,
    });
    await allocatePayment({
      paymentId: String(partialOut._id),
      supplierBillId: String(bill._id),
      allocatedAmount: "480000",
      currency: "USD",
      actorUserId: financeId,
    });

    const finalOut = await createPaymentRecord({
      direction: "outgoing",
      payeeOrganizationId: supplierOrgId,
      amount: "500000",
      currency: "USD",
      paymentDate: "2026-11-05",
      method: "wire",
      bankReference: "TEST-SUP-PAY-002",
      actorUserId: financeId,
      supplierVisible: true,
      autoVerify: true,
    });
    await allocatePayment({
      paymentId: String(finalOut._id),
      supplierBillId: String(bill._id),
      allocatedAmount: "500000",
      currency: "USD",
      actorUserId: financeId,
    });
  }

  if (!await CreditNote.findOne({ buyerInvoiceId: invoice._id })) {
    const noteNumber = await allocateFinanceNumber("CN");
    await CreditNote.create({
      noteNumber,
      noteType: "credit",
      buyerInvoiceId: invoice._id,
      reason: `QA credit adjustment — ${QA_MARKER}`,
      currency: "USD",
      amount: Types.Decimal128.fromString("0"),
      status: "issued",
      approvedByUserId: financeUser._id,
      issuedAt: new Date(),
      createdByUserId: financeUser._id,
      qaMarker: QA_MARKER,
    });
  }

  let claim = await TradeClaim.findOne({ shipmentLotId: buyerLot._id, description: { $regex: SEED_MARKER } });
  if (!claim) {
    claim = await TradeClaim.create({
      shipmentLotId: buyerLot._id,
      transactionId: buyerTx._id,
      claimNumber: "FK-CLM-2026-TEST-0001",
      claimType: "quality",
      claimantOrganizationId: buyerOrg._id,
      respondentOrganizationId: supplierOrg._id,
      description: `Minor quality variance — ${SEED_MARKER}`,
      claimedAmountPlaceholder: Types.Decimal128.fromString("0"),
      currency: "USD",
      status: "resolved",
      buyerVisible: true,
      supplierVisible: true,
      createdByUserId: tradeUser._id,
    });
  }

  if (!await ClaimSettlement.findOne({ tradeClaimId: claim._id })) {
    await ClaimSettlement.create({
      tradeClaimId: claim._id,
      settlementAmount: Types.Decimal128.fromString("0"),
      currency: "USD",
      responsibleOrganizationId: supplierOrg._id,
      settlementMethod: "waived",
      approvalStatus: "approved",
      approvedByUserId: financeUser._id,
      notes: QA_MARKER,
      createdByUserId: tradeUser._id,
    });
  }

  if (!await FinancialPeriod.findOne({ status: "open", periodType: "month" })) {
    await FinancialPeriod.create({
      periodType: "month",
      label: "2026-10",
      startDate: new Date("2026-10-01"),
      endDate: new Date("2026-10-31"),
      status: "open",
    });
  }

  const profitability = await calculateTransactionProfitability(buyerTxId, "USD");
  console.log("Phase 7 seed complete.");
  console.log("Buyer invoice total:", invoice.total.toString());
  console.log("Supplier bill total:", bill.total.toString());
  console.log("Contribution profit (expected 30000):", profitability.contributionProfit);
  console.log("Invoice:", invoice.invoiceNumber, "status:", invoice.status);
  console.log("Bill:", bill.billNumber, "status:", bill.status);

  if (!money(profitability.contributionProfit).eq(money("30000"))) {
    console.warn(
      "WARNING: contribution profit differs from expected USD 30,000 — review seed costs.",
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
