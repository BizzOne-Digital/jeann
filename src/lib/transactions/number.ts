import { Types } from "mongoose";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";

const MAX_RETRIES = 5;

/**
 * Allocates a unique buyer sale transaction number: FK-S-YYYY-NNNNNN
 * Uses atomic counter increment — safe under concurrent requests.
 */
export async function allocateBuyerSaleTransactionNumber(
  year = new Date().getUTCFullYear(),
): Promise<string> {
  return allocateTransactionNumber("S", year);
}

/**
 * Allocates a unique supplier purchase transaction number: FK-P-YYYY-NNNNNN
 */
export async function allocateSupplierPurchaseTransactionNumber(
  year = new Date().getUTCFullYear(),
): Promise<string> {
  return allocateTransactionNumber("P", year);
}

/**
 * Allocates a unique deal group number: FK-DG-YYYY-NNNNNN
 */
export async function allocateDealGroupNumber(
  year = new Date().getUTCFullYear(),
): Promise<string> {
  if (!isMongoConfigured()) {
    throw new Error("Database required for deal group number allocation");
  }
  await tryConnectMongo();
  const { TransactionCounter } = await import("@/models");

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const counter = await TransactionCounter.findOneAndUpdate(
      { year, side: "DG" },
      { $inc: { sequence: 1 } },
      { upsert: true, new: true },
    );
    const sequence = counter.sequence;
    const number = `FK-DG-${year}-${String(sequence).padStart(6, "0")}`;
    const { DealGroup } = await import("@/models");
    const exists = await DealGroup.findOne({ dealGroupNumber: number }).lean();
    if (!exists) return number;
  }
  throw new Error("Unable to allocate unique deal group number");
}

async function allocateTransactionNumber(side: "S" | "P", year: number): Promise<string> {
  if (!isMongoConfigured()) {
    throw new Error("Database required for transaction number allocation");
  }

  await tryConnectMongo();
  const { TransactionCounter } = await import("@/models");

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const counter = await TransactionCounter.findOneAndUpdate(
      { year, side },
      { $inc: { sequence: 1 } },
      { upsert: true, new: true },
    );

    const sequence = counter.sequence;
    const number = `FK-${side}-${year}-${String(sequence).padStart(6, "0")}`;

    const { Transaction } = await import("@/models");
    const exists = await Transaction.findOne({ transactionNumber: number }).lean();
    if (!exists) return number;
  }

  throw new Error("Unable to allocate unique transaction number");
}

/** Reserve a specific number for seeding (development only). */
export async function reserveTransactionNumber(
  transactionNumber: string,
  year: number,
  sequence: number,
  side: "S" | "P" = "S",
): Promise<void> {
  if (!isMongoConfigured()) return;
  await tryConnectMongo();
  const { TransactionCounter } = await import("@/models");
  await TransactionCounter.findOneAndUpdate(
    { year, side },
    { $max: { sequence: sequence } },
    { upsert: true },
  );
  void transactionNumber;
}

export function parseTransactionNumber(value: string): {
  side: string;
  year: number;
  sequence: number;
} | null {
  const match = /^FK-(S|P)-(\d{4})-(\d{6})$/.exec(value.trim());
  if (!match) return null;
  return {
    side: match[1],
    year: Number(match[2]),
    sequence: Number(match[3]),
  };
}

export function parseDealGroupNumber(value: string): {
  year: number;
  sequence: number;
} | null {
  const match = /^FK-DG-(\d{4})-(\d{6})$/.exec(value.trim());
  if (!match) return null;
  return { year: Number(match[1]), sequence: Number(match[2]) };
}

export async function assertTransactionBelongsToOrg(
  transactionId: string,
  organizationId: string,
): Promise<boolean> {
  if (!Types.ObjectId.isValid(transactionId) || !Types.ObjectId.isValid(organizationId)) {
    return false;
  }
  await tryConnectMongo();
  const { Transaction } = await import("@/models");
  const tx = await Transaction.findOne({
    _id: transactionId,
    organizationId: new Types.ObjectId(organizationId),
    deletedAt: null,
  }).lean();
  return Boolean(tx);
}
