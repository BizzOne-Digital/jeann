import type { Types } from "mongoose";

export type TransactionBankingSummary = {
  id?: string;
  instrumentId?: string;
  status: string;
  statusLabel: string;
  instrumentType: string;
  currency?: string;
  amount?: string;
};

export async function getTransactionBankingSummary(
  transactionId: Types.ObjectId | string,
): Promise<TransactionBankingSummary | null> {
  const { BankingInstrument, BankingInstrumentRecord, BankingInstrumentType } = await import(
    "@/models"
  );
  const { BANKING_STATUS_LABELS } = await import("@/lib/banking/workflow");

  const instrument = await BankingInstrument.findOne({ transactionId }).lean();
  if (instrument) {
    const type = await BankingInstrumentType.findOne({ code: instrument.instrumentTypeCode }).lean();
    const status = instrument.currentStatus;
    return {
      id: String(instrument._id),
      instrumentId: instrument.instrumentId,
      status,
      statusLabel: BANKING_STATUS_LABELS[status] ?? status,
      instrumentType: type?.name ?? instrument.instrumentTypeCode,
      currency: instrument.currency,
      amount: instrument.amount?.toString(),
    };
  }

  const legacy = await BankingInstrumentRecord.findOne({ transactionId }).lean();
  if (!legacy) return null;

  const status = legacy.status;
  return {
    status,
    statusLabel: BANKING_STATUS_LABELS[status] ?? status.replaceAll("_", " "),
    instrumentType: legacy.instrumentType ?? "Banking instrument",
  };
}
