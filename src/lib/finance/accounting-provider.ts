export type AccountingSyncEntityType =
  | "customer"
  | "vendor"
  | "invoice"
  | "bill"
  | "credit_note"
  | "payment"
  | "tax_code";

export type AccountingConnectionResult = {
  ok: boolean;
  provider: string;
  message: string;
};

export type AccountingSyncResult = {
  ok: boolean;
  externalEntityId?: string;
  status: "not_configured" | "pending" | "success" | "failed" | "conflict";
  errorSummary?: string;
  idempotencyKey: string;
};

export interface AccountingProvider {
  readonly name: string;
  testConnection(): Promise<AccountingConnectionResult>;
  syncCustomer(internalOrgId: string): Promise<AccountingSyncResult>;
  syncVendor(internalOrgId: string): Promise<AccountingSyncResult>;
  syncInvoice(internalInvoiceId: string): Promise<AccountingSyncResult>;
  syncBill(internalBillId: string): Promise<AccountingSyncResult>;
  syncCreditNote(internalNoteId: string): Promise<AccountingSyncResult>;
  syncPayment(internalPaymentId: string): Promise<AccountingSyncResult>;
  getSyncStatus(entityType: AccountingSyncEntityType, internalId: string): Promise<AccountingSyncResult>;
  retrySync(idempotencyKey: string): Promise<AccountingSyncResult>;
}

export class DevelopmentAccountingProvider implements AccountingProvider {
  readonly name = "development_mock";

  async testConnection(): Promise<AccountingConnectionResult> {
    return {
      ok: true,
      provider: this.name,
      message: "Development mock — not a real accounting connection.",
    };
  }

  private mockSync(internalId: string, entityType: string): AccountingSyncResult {
    const configured = process.env.ACCOUNTING_PROVIDER_CONFIGURED === "true";
    if (!configured) {
      return {
        ok: false,
        status: "not_configured",
        errorSummary: "Accounting provider not configured. Use CSV export.",
        idempotencyKey: `${entityType}:${internalId}:not_configured`,
      };
    }
    return {
      ok: true,
      status: "success",
      externalEntityId: `MOCK-EXT-${entityType}-${internalId.slice(-6)}`,
      idempotencyKey: `${entityType}:${internalId}:${Date.now()}`,
    };
  }

  async syncCustomer(id: string) {
    return this.mockSync(id, "customer");
  }
  async syncVendor(id: string) {
    return this.mockSync(id, "vendor");
  }
  async syncInvoice(id: string) {
    return this.mockSync(id, "invoice");
  }
  async syncBill(id: string) {
    return this.mockSync(id, "bill");
  }
  async syncCreditNote(id: string) {
    return this.mockSync(id, "credit_note");
  }
  async syncPayment(id: string) {
    return this.mockSync(id, "payment");
  }
  async getSyncStatus(_entityType: AccountingSyncEntityType, internalId: string) {
    return this.mockSync(internalId, "status");
  }
  async retrySync(idempotencyKey: string) {
    return {
      ok: false,
      status: "failed" as const,
      errorSummary: "Retry not available in development mock.",
      idempotencyKey,
    };
  }
}

let cached: AccountingProvider | null = null;

export function getAccountingProvider(): AccountingProvider {
  if (cached) return cached;
  const provider = process.env.ACCOUNTING_PROVIDER ?? "development_mock";
  if (provider === "development_mock" || provider === "none") {
    cached = new DevelopmentAccountingProvider();
    return cached;
  }
  cached = new DevelopmentAccountingProvider();
  return cached;
}

export async function syncEntityToAccounting(
  entityType: AccountingSyncEntityType,
  internalId: string,
): Promise<AccountingSyncResult> {
  const provider = getAccountingProvider();
  const { AccountingSyncRecord } = await import("@/models");
  const idempotencyKey = `${provider.name}:${entityType}:${internalId}`;

  let result: AccountingSyncResult;
  switch (entityType) {
    case "invoice":
      result = await provider.syncInvoice(internalId);
      break;
    case "bill":
      result = await provider.syncBill(internalId);
      break;
    case "payment":
      result = await provider.syncPayment(internalId);
      break;
    case "customer":
      result = await provider.syncCustomer(internalId);
      break;
    case "vendor":
      result = await provider.syncVendor(internalId);
      break;
    case "credit_note":
      result = await provider.syncCreditNote(internalId);
      break;
    default:
      result = {
        ok: false,
        status: "failed",
        errorSummary: "Unsupported entity type",
        idempotencyKey,
      };
  }

  await AccountingSyncRecord.findOneAndUpdate(
    { idempotencyKey },
    {
      provider: provider.name,
      entityType,
      internalEntityId: internalId,
      externalEntityId: result.externalEntityId,
      syncDirection: "push",
      status: result.status,
      lastAttemptAt: new Date(),
      lastSuccessAt: result.ok ? new Date() : undefined,
      errorSummary: result.errorSummary,
      idempotencyKey,
    },
    { upsert: true },
  );

  return result;
}
