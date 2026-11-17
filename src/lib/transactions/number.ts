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

/** Order numbers that start with a product code, for example RSO-CIF-000123-26. */
export const PRODUCT_ORDER_NUMBER = /^([A-Z0-9]{2,8})-(FOB|CIF)-(\d{6})-(\d{2})$/;

export function formatProductOrderNumber(code: string, incoterm: string, sequence: number, year: number): string {
  const term = incoterm.toUpperCase() === "FOB" ? "FOB" : "CIF";
  return code.toUpperCase() + "-" + term + "-" + String(sequence).padStart(6, "0") + "-" + String(year % 100).padStart(2, "0");
}

export function parseProductOrderNumber(value: string): { code: string; incoterm: string; sequence: number; year: number } | null {
  const m = PRODUCT_ORDER_NUMBER.exec(value.trim());
  if (!m) return null;
  return { code: m[1], incoterm: m[2], sequence: Number(m[3]), year: 2000 + Number(m[4]) };
}

/** The same order number with another Incoterm (the buyer may change FOB or CIF before submitting). */
export function withIncoterm(orderNumber: string, incoterm: string): string {
  const parsed = parseProductOrderNumber(orderNumber);
  if (!parsed) return orderNumber;
  return formatProductOrderNumber(parsed.code, incoterm, parsed.sequence, parsed.year);
}

/**
 * Allocates the next order number for a product: CODE-INCOTERM-NNNNNN-YY. One counter per year is
 * shared by all products, so the sequence part is unique on its own.
 */
export async function allocateProductOrderNumber(
  code: string,
  incoterm: string,
  year = new Date().getUTCFullYear(),
): Promise<string> {
  if (!isMongoConfigured()) throw new Error("Database required for order number allocation");
  await tryConnectMongo();
  const { TransactionCounter, Transaction, PurchaseRequest } = await import("@/models");
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const counter = await TransactionCounter.findOneAndUpdate(
      { year, side: "O" },
      { $inc: { sequence: 1 } },
      { upsert: true, new: true },
    );
    const number = formatProductOrderNumber(code, incoterm, counter.sequence, year);
    const taken =
      (await Transaction.exists({ transactionNumber: { $regex: "^[A-Z0-9]{2,8}-(FOB|CIF)-" + String(counter.sequence).padStart(6, "0") + "-" + String(year % 100).padStart(2, "0") + "$" } })) ||
      (await PurchaseRequest.exists({ reference: { $regex: "^[A-Z0-9]{2,8}-(FOB|CIF)-" + String(counter.sequence).padStart(6, "0") + "-" + String(year % 100).padStart(2, "0") + "$" } }));
    if (!taken) return number;
  }
  throw new Error("Unable to allocate a unique order number");
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
