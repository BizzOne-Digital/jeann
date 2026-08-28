import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";

const MAX_RETRIES = 5;

export async function allocateShipmentLotNumber(
  year = new Date().getUTCFullYear(),
): Promise<string> {
  if (!isMongoConfigured()) {
    throw new Error("Database required for shipment number allocation");
  }

  await tryConnectMongo();
  const { TransactionCounter, ShipmentLot } = await import("@/models");

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const counter = await TransactionCounter.findOneAndUpdate(
      { year, side: "SHP" },
      { $inc: { sequence: 1 } },
      { upsert: true, new: true },
    );
    const sequence = counter.sequence;
    const number = `FK-SHP-${year}-${String(sequence).padStart(6, "0")}`;
    const exists = await ShipmentLot.findOne({ shipmentLotNumber: number }).lean();
    if (!exists) return number;
  }
  throw new Error("Unable to allocate unique shipment lot number");
}

export async function reserveShipmentLotNumber(
  shipmentLotNumber: string,
  year: number,
  sequence: number,
): Promise<void> {
  if (!isMongoConfigured()) return;
  await tryConnectMongo();
  const { TransactionCounter } = await import("@/models");
  await TransactionCounter.findOneAndUpdate(
    { year, side: "SHP" },
    { $max: { sequence: sequence } },
    { upsert: true },
  );
  void shipmentLotNumber;
}
