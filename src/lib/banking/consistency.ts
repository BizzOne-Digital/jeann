import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";

export type InstrumentConsistencyIssue = {
  severity: "error" | "warning" | "info";
  field: string;
  sourceDocument?: string;
  sourceField?: string;
  instrumentField?: string;
  expected?: string;
  actual?: string;
  message: string;
  suggestedAction?: string;
};

export async function compareInstrumentWithContract(
  instrumentId: string,
): Promise<{ blocking: InstrumentConsistencyIssue[]; warnings: InstrumentConsistencyIssue[] }> {
  if (!isMongoConfigured()) {
    return { blocking: [], warnings: [] };
  }

  await tryConnectMongo();
  const { BankingInstrument, CommercialTerms, ProcurementTerms, Transaction } =
    await import("@/models");

  const instrument = await BankingInstrument.findById(instrumentId).lean();
  if (!instrument) {
    return {
      blocking: [{ severity: "error", field: "instrument", message: "Instrument not found" }],
      warnings: [],
    };
  }

  const tx = await Transaction.findById(instrument.transactionId).lean();
  const blocking: InstrumentConsistencyIssue[] = [];
  const warnings: InstrumentConsistencyIssue[] = [];

  const terms =
    instrument.transactionSide === "buyer_sale"
      ? await CommercialTerms.findOne({ transactionId: instrument.transactionId })
          .sort({ version: -1 })
          .lean()
      : await ProcurementTerms.findOne({ transactionId: instrument.transactionId })
          .sort({ version: -1 })
          .lean();

  if (!terms) {
    blocking.push({
      severity: "error",
      field: "terms",
      message: "Commercial/procurement terms missing",
      suggestedAction: "Complete transaction terms before comparison",
    });
    return { blocking, warnings };
  }

  const contractAmount =
    instrument.transactionSide === "buyer_sale"
      ? (terms as { totalEstimatedValue?: { toString(): string } }).totalEstimatedValue?.toString()
      : (terms as { procurementTotal?: { toString(): string } }).procurementTotal?.toString();

  const contractCurrency = terms.currency;
  const instAmount = instrument.amount?.toString();
  const instCurrency = instrument.currency;

  if (contractCurrency && instCurrency && contractCurrency !== instCurrency) {
    blocking.push({
      severity: "error",
      field: "currency",
      sourceDocument: "contract_terms",
      expected: contractCurrency,
      actual: instCurrency,
      message: "Currency mismatch between instrument and contract",
      suggestedAction: "Request amendment or corrected instrument copy",
    });
  }

  if (contractAmount && instAmount && contractAmount !== instAmount) {
    const diff = Math.abs(Number(contractAmount) - Number(instAmount));
    if (diff > 0.01) {
      blocking.push({
        severity: "error",
        field: "amount",
        sourceDocument: "contract_terms",
        sourceField: "total",
        instrumentField: "amount",
        expected: contractAmount,
        actual: instAmount,
        message: "Amount mismatch between instrument and contract",
        suggestedAction: "Review with banking coordinator; amendment may be required",
      });
    }
  }

  const contractProduct = terms.productName;
  if (
    contractProduct &&
    instrument.goodsDescription &&
    contractProduct.toLowerCase() !== instrument.goodsDescription.toLowerCase()
  ) {
    warnings.push({
      severity: "warning",
      field: "goodsDescription",
      expected: contractProduct,
      actual: instrument.goodsDescription,
      message: "Product description differs from contract terms",
    });
  }

  const loadingPort =
    instrument.transactionSide === "buyer_sale"
      ? (terms as { loadingPort?: string }).loadingPort
      : (terms as { loadingPort?: string }).loadingPort;
  const destination =
    instrument.transactionSide === "buyer_sale"
      ? (terms as { destinationPort?: string }).destinationPort
      : (terms as { destinationPlace?: string }).destinationPlace;

  if (loadingPort && instrument.loadingPortPlace && loadingPort !== instrument.loadingPortPlace) {
    blocking.push({
      severity: "error",
      field: "loadingPortPlace",
      expected: loadingPort,
      actual: instrument.loadingPortPlace,
      message: "Loading port mismatch",
    });
  }

  if (
    destination &&
    instrument.destinationPortPlace &&
    destination !== instrument.destinationPortPlace
  ) {
    blocking.push({
      severity: "error",
      field: "destinationPortPlace",
      expected: destination,
      actual: instrument.destinationPortPlace,
      message: "Destination port/place mismatch",
    });
  }

  if (tx?.transactionNumber) {
    warnings.push({
      severity: "info",
      field: "contractReference",
      message: `Comparison performed against transaction ${tx.transactionNumber}. Not bank-approved.`,
    });
  }

  return { blocking, warnings };
}
