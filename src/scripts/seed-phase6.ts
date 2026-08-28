/**
 * Phase 6 seed: buyer + supplier shipment lots, allocation, freight, inspection, checklist, tracking.
 */
import "./load-env";
import { getEnv } from "@/lib/config/env";
import { connectMongo, isMongoConfigured } from "@/lib/db/mongoose";
import { money } from "@/lib/finance/money";
import { Types } from "mongoose";
import { reserveShipmentLotNumber } from "@/lib/shipments/number";

const BUYER_SHIPMENT = "FK-SHP-2026-TEST-0001";
const SUPPLIER_SHIPMENT = "FK-SHP-2026-TEST-0002";
const BUYER_TX = "FK-S-2026-TEST-0001";
const SUPPLIER_TX = "FK-P-2026-TEST-0001";
const DEAL_GROUP = "FK-DG-2026-TEST-0001";

async function main() {
  const env = getEnv();
  if (env.NODE_ENV === "production") {
    console.error("seed-phase6 refuses to run in production.");
    process.exit(1);
  }
  if (!isMongoConfigured()) {
    console.error("MONGODB_URI required.");
    process.exit(1);
  }

  await connectMongo();
  const {
    Transaction,
    User,
    DealGroup,
    ShipmentLot,
    ShipmentLotAllocation,
    FreightBooking,
    InspectionRecord,
    ShipmentDocumentChecklist,
    ShipmentDocumentRequirement,
    TrackingReference,
    ShipmentTrackingEvent,
    TransactionCounter,
    BankingInstrument,
  } = await import("@/models");

  const buyerTx = await Transaction.findOne({ transactionNumber: BUYER_TX });
  const supplierTx = await Transaction.findOne({ transactionNumber: SUPPLIER_TX });
  const dealGroup = await DealGroup.findOne({ dealGroupNumber: DEAL_GROUP });
  const tradeUser = await User.findOne({ email: "trade@test.finekarts.local" });

  if (!buyerTx || !supplierTx || !dealGroup || !tradeUser) {
    console.error("Run seed:phase2 through phase5 first.");
    process.exit(1);
  }

  await TransactionCounter.findOneAndUpdate(
    { year: 2026, side: "SHP" },
    { $max: { sequence: 2 } },
    { upsert: true },
  );

  let buyerLot = await ShipmentLot.findOne({ shipmentLotNumber: BUYER_SHIPMENT });
  if (!buyerLot) {
    buyerLot = await ShipmentLot.create({
      shipmentLotNumber: BUYER_SHIPMENT,
      transactionId: buyerTx._id,
      transactionSide: "buyer_sale",
      dealGroupId: dealGroup._id,
      sequenceNumber: 1,
      plannedQuantity: Types.Decimal128.fromString(money("1000").toString()),
      quantityUnit: "MT",
      productName: "Refined Sunflower Oil",
      loadingPort: "Port of Constanța",
      destinationPort: "Port of Montreal",
      packaging: "Flexitanks",
      plannedLoadingDate: new Date("2026-09-20"),
      estimatedArrival: new Date("2026-10-10"),
      currentStatus: "allocated",
      createdByUserId: tradeUser._id,
    });
    await reserveShipmentLotNumber(BUYER_SHIPMENT, 2026, 1);
  }

  let supplierLot = await ShipmentLot.findOne({ shipmentLotNumber: SUPPLIER_SHIPMENT });
  if (!supplierLot) {
    supplierLot = await ShipmentLot.create({
      shipmentLotNumber: SUPPLIER_SHIPMENT,
      transactionId: supplierTx._id,
      transactionSide: "supplier_purchase",
      dealGroupId: dealGroup._id,
      sequenceNumber: 1,
      plannedQuantity: Types.Decimal128.fromString(money("1000").toString()),
      quantityUnit: "MT",
      productName: "Refined Sunflower Oil",
      loadingPort: "Port of Constanța",
      destinationPort: "Port of Montreal",
      packaging: "Flexitanks",
      plannedLoadingDate: new Date("2026-09-20"),
      estimatedArrival: new Date("2026-10-10"),
      currentStatus: "allocated",
      createdByUserId: tradeUser._id,
    });
    await reserveShipmentLotNumber(SUPPLIER_SHIPMENT, 2026, 2);
  }

  if (
    !await ShipmentLotAllocation.findOne({
      buyerShipmentLotId: buyerLot._id,
      supplierShipmentLotId: supplierLot._id,
    })
  ) {
    await ShipmentLotAllocation.create({
      dealGroupId: dealGroup._id,
      buyerShipmentLotId: buyerLot._id,
      supplierShipmentLotId: supplierLot._id,
      allocatedQuantity: Types.Decimal128.fromString(money("1000").toString()),
      unit: "MT",
      allocationStatus: "confirmed",
      compatibilityResult: "compatible",
      internalNotes: "TEST ALLOCATION — NOT VALID — FOR SOFTWARE QA ONLY",
      createdByUserId: tradeUser._id,
    });
  }

  if (!await FreightBooking.findOne({ shipmentLotId: buyerLot._id })) {
    await FreightBooking.create({
      shipmentLotId: buyerLot._id,
      freightForwarder: "Test Forwarder — NOT REAL",
      carrier: "Test Carrier Line — NOT REAL",
      bookingNumber: "TEST-BKG-2026-0001",
      bookingDate: new Date("2026-09-10"),
      transportMode: "ocean",
      vesselName: "MV TEST VESSEL",
      imoNumber: "IMO0000000",
      voyageNumber: "V2026-TEST",
      containerReferences: ["TESTCNTR0001", "TESTCNTR0002"],
      loadingPort: "Port of Constanța",
      destinationPort: "Port of Montreal",
      plannedDeparture: new Date("2026-09-22"),
      estimatedArrival: new Date("2026-10-10"),
      status: "confirmed",
      source: "manual",
      createdByUserId: tradeUser._id,
    });
  }

  if (!await InspectionRecord.findOne({ shipmentLotId: supplierLot._id })) {
    await InspectionRecord.create({
      shipmentLotId: supplierLot._id,
      inspectionType: "pre_shipment",
      inspectionProvider: "SGS",
      inspectionLocation: "Port of Constanța",
      requestedDate: new Date("2026-09-15"),
      scheduledDate: new Date("2026-09-18"),
      scope: "Quality and quantity — TEST DOCUMENT — NOT VALID — FOR SOFTWARE QA ONLY",
      requestedTests: ["FFA", "Moisture"],
      resultSummary: "Pending QA review",
      status: "scheduled",
      verificationStatus: "unverified",
      createdByUserId: tradeUser._id,
    });
  }

  const bankingInstrument = await BankingInstrument.findOne({ transactionId: buyerTx._id });
  const adviserUser = await User.findOne({ email: "banking-adviser@test.finekarts.local" });
  let checklist = await ShipmentDocumentChecklist.findOne({
    shipmentLotId: buyerLot._id,
    version: 1,
  });
  if (!checklist) {
    checklist = await ShipmentDocumentChecklist.create({
      shipmentLotId: buyerLot._id,
      transactionId: buyerTx._id,
      bankingInstrumentId: bankingInstrument?._id,
      destinationCountry: "Canada",
      destinationPort: "Port of Montreal",
      version: 1,
      status: "approved",
      buyerAuthorityNoticeConfirmed: true,
      approvedByUserId: tradeUser._id,
      approvalDate: new Date(),
    });

    const docTypes = [
      { type: "commercial_invoice", party: "supplier" },
      { type: "packing_list", party: "supplier" },
      { type: "ocean_bill_of_lading", party: "supplier" },
      { type: "certificate_of_origin", party: "supplier" },
      { type: "insurance_certificate", party: "buyer" },
    ];
    for (const d of docTypes) {
      await ShipmentDocumentRequirement.create({
        checklistId: checklist._id,
        documentType: d.type,
        required: true,
        responsibleParty: d.party,
        bankingRequirement: d.type !== "certificate_of_origin",
        destinationRequirement: d.type === "certificate_of_origin",
        uploadStatus: "not_started",
        validationStatus: "pending",
        approvalStatus: "pending",
        presentationStatus: "not_started",
        notes: "TEST DOCUMENT — NOT VALID — FOR SOFTWARE QA ONLY",
      });
    }
  }

  if (bankingInstrument && checklist && adviserUser) {
    const { PresentationPackage, CourierRecord } = await import("@/models");

    const existingPkg = await PresentationPackage.findOne({
      packageReference: "PKG-TEST-BUYER-0001",
    });
    if (!existingPkg) {
      await PresentationPackage.create({
        shipmentLotId: buyerLot._id,
        bankingInstrumentId: bankingInstrument._id,
        checklistId: checklist._id,
        packageReference: "PKG-TEST-BUYER-0001",
        documentManifest: [
          "commercial_invoice",
          "packing_list",
          "ocean_bill_of_lading",
          "certificate_of_origin",
          "insurance_certificate",
        ],
        checksum: "a3f5c9e2b1d8476098c4e2f1a0b3d5e7f9c1a2b4d6e8f0a2c4e6b8d0f2a4c6",
        status: "ready_for_presentation",
        validationSummary: JSON.stringify({ blocking: 0, warnings: 0 }),
        approvedByUserId: tradeUser._id,
        approvedAt: new Date(),
        createdByUserId: tradeUser._id,
      });
    }

    const existingCourier = await CourierRecord.findOne({
      bankingInstrumentId: bankingInstrument._id,
      trackingNumber: "TEST-COURIER-2026-0001",
    });
    if (!existingCourier) {
      await CourierRecord.create({
        bankingInstrumentId: bankingInstrument._id,
        courierCompany: "DHL Express — TEST",
        trackingNumber: "TEST-COURIER-2026-0001",
        sender: "Finekarts Incorporated",
        recipient: "Test Issuing Bank — Not Real",
        dispatchDate: new Date("2026-10-05"),
        expectedDeliveryDate: new Date("2026-10-08"),
        packageDescription:
          "LC presentation package — commercial invoice, B/L, COO, insurance — TEST ONLY",
        status: "in_transit",
        createdByUserId: adviserUser._id,
      });
    }
  }

  if (!await TrackingReference.findOne({ shipmentLotId: buyerLot._id })) {
    const ref = await TrackingReference.create({
      shipmentLotId: buyerLot._id,
      provider: "manual",
      referenceType: "booking_number",
      trackingNumber: "TEST-BKG-2026-0001",
      carrier: "Test Carrier Line — NOT REAL",
      dataSource: "manual",
      active: true,
      createdByUserId: tradeUser._id,
    });

    await ShipmentTrackingEvent.create({
      shipmentLotId: buyerLot._id,
      trackingReferenceId: ref._id,
      eventType: "departed",
      eventTimestamp: new Date("2026-09-22T12:00:00Z"),
      description: "TEST EVENT — NOT VALID — departed loading port",
      source: "manual",
      confidence: "estimated",
      buyerVisible: true,
      supplierVisible: true,
    });
  }

  console.log("Phase 6 seed complete.");
  console.log("Buyer shipment:", BUYER_SHIPMENT);
  console.log("Supplier shipment:", SUPPLIER_SHIPMENT);
  if (bankingInstrument) {
    console.log("Banking documents seed: presentation package PKG-TEST-BUYER-0001 + courier record");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
