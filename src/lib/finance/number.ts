import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";

const MAX_RETRIES = 5;

export async function allocateFinanceNumber(
  side: "INV" | "BILL" | "PAY" | "FIN" | "CN",
  year = new Date().getUTCFullYear(),
): Promise<string> {
  if (!isMongoConfigured()) {
    throw new Error("Database required for finance number allocation");
  }
  await tryConnectMongo();
  const { TransactionCounter } = await import("@/models");

  const prefix =
    side === "INV"
      ? "FK-INV"
      : side === "BILL"
        ? "FK-BILL"
        : side === "PAY"
          ? "FK-PAY"
          : side === "CN"
            ? "FK-CN"
            : "FK-FIN";

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const counter = await TransactionCounter.findOneAndUpdate(
      { year, side },
      { $inc: { sequence: 1 } },
      { upsert: true, new: true },
    );
    const sequence = counter.sequence;
    const number = `${prefix}-${year}-${String(sequence).padStart(6, "0")}`;
    return number;
  }
  throw new Error("Unable to allocate finance number");
}

export async function reserveFinanceNumber(
  number: string,
  side: string,
  year: number,
  sequence: number,
): Promise<void> {
  if (!isMongoConfigured()) return;
  await tryConnectMongo();
  const { TransactionCounter } = await import("@/models");
  await TransactionCounter.findOneAndUpdate(
    { year, side },
    { $max: { sequence: sequence } },
    { upsert: true },
  );
  void number;
}
