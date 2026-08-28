"use client";

import { TransactionWorkspaceTabs } from "@/components/portal/TransactionWorkspaceTabs";

export function SupplierTransactionWorkspace({ transactionId }: { transactionId: string }) {
  return (
    <TransactionWorkspaceTabs
      transactionId={transactionId}
      apiBase="/api/portal/supplier/transactions"
      mode="supplier"
      showFinance={false}
      showStaffActions={false}
    />
  );
}
